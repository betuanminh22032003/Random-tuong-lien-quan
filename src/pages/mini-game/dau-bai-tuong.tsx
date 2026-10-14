import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HEROES, Hero, ROLE_LABELS } from '@/data/heroes';
import { hashString, newSeed, Rng, rngFromSeed, sample, shareOrCopy } from '@/lib/random';
import { absoluteUrl } from '@/lib/seo';
import GamePage from '@/components/GamePage';

type StatKey = 'atk' | 'def' | 'spd' | 'mag';
type Phase = 'menu' | 'pick' | 'reveal' | 'done';

const STATS: Record<StatKey, string> = {
  atk: '⚔️ Công',
  def: '🛡️ Thủ',
  spd: '💨 Tốc',
  mag: '🔮 Phép',
};
const STAT_KEYS = Object.keys(STATS) as StatKey[];

// Card-game stats derived from role + tier + a stable per-hero jitter. For fun only.
const ROLE_BASE: Record<Hero['role'], Record<StatKey, number>> = {
  Warrior: { atk: 70, def: 70, spd: 55, mag: 30 },
  Assassin: { atk: 82, def: 40, spd: 85, mag: 35 },
  Mage: { atk: 35, def: 40, spd: 50, mag: 88 },
  Marksman: { atk: 86, def: 35, spd: 62, mag: 25 },
  Tank: { atk: 45, def: 90, spd: 40, mag: 42 },
  Support: { atk: 35, def: 66, spd: 55, mag: 66 },
};
const TIER_BONUS: Record<Hero['tier'], number> = { S: 6, A: 3, B: 0, C: -3 };

interface Card {
  hero: Hero;
  stats: Record<StatKey, number>;
}

function toCard(hero: Hero): Card {
  const base = ROLE_BASE[hero.role];
  const stats = {} as Record<StatKey, number>;
  STAT_KEYS.forEach(key => {
    const jitter = (hashString(`${hero.name}:${key}`) % 25) - 12;
    stats[key] = Math.max(10, Math.min(99, base[key] + jitter + TIER_BONUS[hero.tier]));
  });
  return { hero, stats };
}

const DECK = HEROES.filter(h => h.available !== false).map(toCard);
const ROUNDS = 5;

interface RoundResult {
  mine: Card;
  bot: Card;
  stat: StatKey;
  winner: 'me' | 'bot' | 'tie';
}

function bestStat(card: Card): StatKey {
  return STAT_KEYS.reduce((best, key) => (card.stats[key] > card.stats[best] ? key : best), STAT_KEYS[0]);
}

function botRespond(hand: Card[], stat: StatKey, rng: Rng): Card {
  const sorted = [...hand].sort((a, b) => b.stats[stat] - a.stats[stat]);
  return rng() < 0.65 ? sorted[0] : sorted[Math.floor(rng() * sorted.length)];
}

function botLead(hand: Card[]): { card: Card; stat: StatKey } {
  let pick = { card: hand[0], stat: bestStat(hand[0]) };
  hand.forEach(card => {
    const stat = bestStat(card);
    if (card.stats[stat] > pick.card.stats[pick.stat]) pick = { card, stat };
  });
  return pick;
}

function CardView({
  card,
  selected,
  onClick,
  highlight,
  disabled,
}: {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  highlight?: StatKey | null;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`hero-card${selected ? ' selected' : ''} tier-${card.hero.tier}`}
      onClick={onClick}
      disabled={disabled || !onClick}
    >
      <img src={card.hero.imageUrl} alt={card.hero.name} loading="lazy" />
      <strong>{card.hero.name}</strong>
      <span className="card-role">
        {ROLE_LABELS[card.hero.role]} · T{card.hero.tier}
      </span>
      <ul>
        {STAT_KEYS.map(key => (
          <li key={key} className={highlight === key ? 'hl' : ''}>
            <span>{STATS[key]}</span>
            <b>{card.stats[key]}</b>
          </li>
        ))}
      </ul>
    </button>
  );
}

export default function CardBattlePage() {
  const router = useRouter();
  const linkRead = useRef(false);
  const [seed, setSeed] = useState('');
  const [challenged, setChallenged] = useState(false);
  const [phase, setPhase] = useState<Phase>('menu');
  const [myHand, setMyHand] = useState<Card[]>([]);
  const [botHand, setBotHand] = useState<Card[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ me: 0, bot: 0 });
  const [selected, setSelected] = useState<Card | null>(null);
  const [botLeadPick, setBotLeadPick] = useState<{ card: Card; stat: StatKey } | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [shareMsg, setShareMsg] = useState('');
  const botRng = useRef<Rng>(Math.random);

  useEffect(() => {
    // Read shared-link params once; later router.replace calls are our own writes.
    if (!router.isReady || linkRead.current) return;
    linkRead.current = true;
    const { s } = router.query;
    if (typeof s === 'string' && /^[a-z0-9]{3,12}$/.test(s)) {
      setSeed(s);
      setChallenged(true);
    }
  }, [router.isReady, router.query]);

  const playerLeads = round % 2 === 0;

  const deal = useCallback(
    (fresh: boolean) => {
      const nextSeed = fresh || !seed ? newSeed() : seed;
      const rng = rngFromSeed(`cards:${nextSeed}`);
      const cards = sample(DECK, ROUNDS * 2, rng);
      botRng.current = rngFromSeed(`bot:${nextSeed}`);
      setSeed(nextSeed);
      if (fresh) setChallenged(false);
      setMyHand(cards.slice(0, ROUNDS));
      setBotHand(cards.slice(ROUNDS));
      setRound(0);
      setScore({ me: 0, bot: 0 });
      setSelected(null);
      setResult(null);
      setBotLeadPick(null);
      setShareMsg('');
      setPhase('pick');
      router.replace({ pathname: router.pathname, query: { s: nextSeed } }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [seed, router]
  );

  // When the bot leads, it commits to a card + stat before the player chooses.
  useEffect(() => {
    if (phase === 'pick' && !playerLeads && !botLeadPick && botHand.length) {
      setBotLeadPick(botLead(botHand));
    }
  }, [phase, playerLeads, botLeadPick, botHand]);

  const resolve = useCallback(
    (mine: Card, stat: StatKey) => {
      const bot = playerLeads ? botRespond(botHand, stat, botRng.current) : botLeadPick!.card;
      const diff = mine.stats[stat] - bot.stats[stat];
      const winner: RoundResult['winner'] = diff > 0 ? 'me' : diff < 0 ? 'bot' : 'tie';
      setResult({ mine, bot, stat, winner });
      setScore(prev => ({
        me: prev.me + (winner === 'me' ? 1 : 0),
        bot: prev.bot + (winner === 'bot' ? 1 : 0),
      }));
      setMyHand(prev => prev.filter(c => c !== mine));
      setBotHand(prev => prev.filter(c => c !== bot));
      setSelected(null);
      setPhase('reveal');
    },
    [playerLeads, botHand, botLeadPick]
  );

  const nextRound = useCallback(() => {
    setResult(null);
    setBotLeadPick(null);
    if (round + 1 >= ROUNDS) {
      setPhase('done');
      return;
    }
    setRound(r => r + 1);
    setPhase('pick');
  }, [round]);

  const share = useCallback(async () => {
    const res = await shareOrCopy(
      `🃏 Mình thắng máy ${score.me}-${score.bot} trong Đấu bài tướng Liên Quân. Cùng bộ bài này, bạn làm được không?`,
      absoluteUrl(`/mini-game/dau-bai-tuong/?s=${seed}`)
    );
    setShareMsg(res === 'copied' ? 'Đã copy link thách đấu!' : res === 'shared' ? 'Đã gửi!' : 'Không thể chia sẻ');
  }, [score, seed]);

  const verdict = useMemo(() => {
    if (score.me > score.bot) return '🏆 Chiến thắng!';
    if (score.me < score.bot) return '💀 Thất bại…';
    return '🤝 Hoà!';
  }, [score]);

  return (
    <GamePage
      slug="dau-bai-tuong"
      title="Đấu Bài Tướng Liên Quân - Game Thẻ Bài Online Miễn Phí | RandomTuong.vn"
      description="Đấu bài tướng Liên Quân: game thẻ bài chiến thuật với các tướng Liên Quân Mobile. Chọn lá bài và chỉ số Công, Thủ, Tốc, Phép để hạ máy qua 5 hiệp, gửi link thách bạn bè cùng bộ bài."
      keywords="đấu bài tướng liên quân, game thẻ bài liên quân, top trumps liên quân, mini game liên quân, game liên quân online"
      h1="Đấu Bài Tướng Liên Quân"
      lead="5 lá bài, 5 hiệp. Chọn đúng lá, đúng chỉ số để hạ máy!"
      howTo={[
        'Mỗi bên nhận 5 lá bài tướng với 4 chỉ số: Công, Thủ, Tốc, Phép.',
        'Hiệp lẻ bạn ra trước: chọn lá bài và chỉ số. Hiệp chẵn máy ra trước và công bố chỉ số, bạn chọn lá để đỡ.',
        'Chỉ số cao hơn thắng hiệp. Sau 5 hiệp ai thắng nhiều hơn là người chiến thắng. Gửi link để bạn bè chơi cùng bộ bài.',
      ]}
      faqs={[
        {
          question: 'Chỉ số trong Đấu bài tướng có phải chỉ số thật trong game không?',
          answer:
            'Không. Chỉ số bài được tính vui từ vai trò, tier tham khảo và một biến số cố định cho từng tướng, chỉ dùng trong mini game này.',
        },
        {
          question: 'Làm sao so điểm với bạn bè?',
          answer:
            'Sau ván đấu bấm Thách bạn bè. Link chứa mã bộ bài nên bạn bè nhận đúng 5 lá giống bạn và đối đầu cùng máy.',
        },
      ]}
    >
      <div className="panel game-panel">
        {phase === 'menu' && (
          <div className="quiz-menu">
            {challenged && <div className="challenge-banner">⚔️ Bạn được thách đấu với cùng bộ bài!</div>}
            <p>Mỗi tướng là một lá bài với chỉ số Công · Thủ · Tốc · Phép. Hạ máy trong 5 hiệp!</p>
            <div className="card-preview">
              {DECK.slice(0, 3).map(card => (
                <CardView key={card.hero.name} card={card} />
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={() => deal(!challenged)}>
                🃏 {challenged ? 'Nhận thách đấu' : 'Chia bài'}
              </button>
              {challenged && (
                <button className="btn btn-plain" type="button" onClick={() => deal(true)}>
                  Bộ bài mới
                </button>
              )}
            </div>
          </div>
        )}

        {(phase === 'pick' || phase === 'reveal') && (
          <div className="battle">
            <div className="quiz-hud">
              <span>
                Hiệp {round + 1}/{ROUNDS}
              </span>
              <strong>
                Bạn {score.me} – {score.bot} Máy
              </strong>
            </div>

            {phase === 'pick' && (
              <div className="bp-status">
                {playerLeads
                  ? selected
                    ? `Chọn chỉ số cho ${selected.hero.name}`
                    : '🟢 Lượt bạn ra trước: chọn 1 lá bài'
                  : botLeadPick
                    ? `🤖 Máy chọn ${STATS[botLeadPick.stat]} — chọn lá bài để đỡ`
                    : 'Máy đang suy nghĩ…'}
              </div>
            )}

            {phase === 'pick' && playerLeads && selected && (
              <div className="stat-picker">
                {STAT_KEYS.map(key => (
                  <button key={key} type="button" className="btn btn-secondary" onClick={() => resolve(selected, key)}>
                    {STATS[key]} {selected.stats[key]}
                  </button>
                ))}
              </div>
            )}

            {phase === 'reveal' && result && (
              <div className="battle-reveal">
                <div>
                  <span className="mini-title">Bạn</span>
                  <CardView card={result.mine} highlight={result.stat} />
                </div>
                <div className={`battle-vs ${result.winner}`}>
                  <b>{STATS[result.stat]}</b>
                  <span>
                    {result.mine.stats[result.stat]} vs {result.bot.stats[result.stat]}
                  </span>
                  <strong>
                    {result.winner === 'me' ? 'Bạn thắng!' : result.winner === 'bot' ? 'Máy thắng!' : 'Hoà!'}
                  </strong>
                  <button className="btn btn-primary" type="button" onClick={nextRound}>
                    {round + 1 >= ROUNDS ? '🏁 Kết quả' : 'Hiệp tiếp →'}
                  </button>
                </div>
                <div>
                  <span className="mini-title">Máy</span>
                  <CardView card={result.bot} highlight={result.stat} />
                </div>
              </div>
            )}

            {phase === 'pick' && (
              <div className="hand">
                {myHand.map(card => (
                  <CardView
                    key={card.hero.name}
                    card={card}
                    selected={selected === card}
                    highlight={!playerLeads ? botLeadPick?.stat : null}
                    onClick={() => {
                      if (playerLeads) setSelected(card);
                      else if (botLeadPick) resolve(card, botLeadPick.stat);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="quiz-result">
            <div className="result-score">
              {score.me} – {score.bot}
            </div>
            <p>{verdict}</p>
            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={share}>
                📤 Thách bạn bè
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => deal(true)}>
                ↻ Ván mới
              </button>
            </div>
            {shareMsg && <p className="toast">{shareMsg}</p>}
            <p className="source-note">
              Muốn biết thêm về tướng? Xem <Link href="/tuong/">danh sách tướng</Link> hoặc{' '}
              <Link href="/tier-list-lien-quan/">tier list</Link>.
            </p>
          </div>
        )}
      </div>
    </GamePage>
  );
}
