import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HEROES, Hero, slugify } from '@/data/heroes';
import { TEAM_LANES } from '@/data/site';
import { newSeed, parsePlayerNames, pickRandom, Rng, rngFromSeed, shareOrCopy, shuffle } from '@/lib/random';
import { absoluteUrl } from '@/lib/seo';
import GamePage from '@/components/GamePage';

interface Slot {
  player: string;
  lane: string;
  hero: Hero | null;
}

const ACTIVE_HEROES = HEROES.filter(h => h.available !== false);
const DEFAULT_NAMES = 'Minh\nTuấn\nHà\nLong\nQuân\nTrang';

function pickHero(used: Set<string>, laneIndex: number, rng: Rng): Hero {
  const lane = TEAM_LANES[laneIndex % TEAM_LANES.length];
  let pool = ACTIVE_HEROES.filter(h => !used.has(h.name) && (laneIndex < TEAM_LANES.length ? lane.match(h) : true));
  if (!pool.length) pool = ACTIVE_HEROES.filter(h => !used.has(h.name));
  const hero = pickRandom(pool, rng);
  used.add(hero.name);
  return hero;
}

function buildTeams(names: string[], seed: string, withHeroes: boolean): { blue: Slot[]; red: Slot[] } {
  const rng = rngFromSeed(`team:${seed}`);
  const order = shuffle(names, rng);
  const blueNames = order.filter((_, i) => i % 2 === 0);
  const redNames = order.filter((_, i) => i % 2 === 1);
  const used = new Set<string>();
  const toSlots = (players: string[]): Slot[] => {
    const lanes = shuffle(
      TEAM_LANES.map((_, i) => i),
      rng
    );
    return players.map((player, i) => {
      const laneIndex = i < lanes.length ? lanes[i] : i;
      return {
        player,
        lane: laneIndex < TEAM_LANES.length ? TEAM_LANES[laneIndex].label : 'Tự do',
        hero: withHeroes ? pickHero(used, laneIndex, rng) : null,
      };
    });
  };
  const sortByLane = (slots: Slot[]) =>
    [...slots].sort(
      (a, b) =>
        TEAM_LANES.findIndex(l => l.label === a.lane) - TEAM_LANES.findIndex(l => l.label === b.lane)
    );
  return { blue: sortByLane(toSlots(blueNames)), red: sortByLane(toSlots(redNames)) };
}

export default function TeamSplitPage() {
  const router = useRouter();
  const linkRead = useRef(false);
  const [rawNames, setRawNames] = useState(DEFAULT_NAMES);
  const [withHeroes, setWithHeroes] = useState(true);
  const [seed, setSeed] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [fromLink, setFromLink] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    // Read shared-link params once; later router.replace calls are our own writes.
    if (!router.isReady || linkRead.current) return;
    linkRead.current = true;
    const { n, s, h } = router.query;
    if (typeof n === 'string' && typeof s === 'string') {
      const parsed = parsePlayerNames(n.replace(/\|/g, '\n'));
      if (parsed.length >= 2) {
        setRawNames(parsed.join('\n'));
        setNames(parsed);
        setSeed(s);
        setWithHeroes(h !== '0');
        setFromLink(true);
      }
    }
  }, [router.isReady, router.query]);

  const teams = useMemo(() => (seed && names.length >= 2 ? buildTeams(names, seed, withHeroes) : null), [
    seed,
    names,
    withHeroes,
  ]);

  const parsedNames = parsePlayerNames(rawNames);

  const draw = useCallback(() => {
    if (parsedNames.length < 2) return;
    const nextSeed = newSeed();
    setNames(parsedNames);
    setSeed(nextSeed);
    setFromLink(false);
    setShareMsg('');
    router.replace(
      { pathname: router.pathname, query: { n: parsedNames.join('|'), s: nextSeed, h: withHeroes ? '1' : '0' } },
      undefined,
      { shallow: true, scroll: false }
    );
  }, [parsedNames, withHeroes, router]);

  const share = useCallback(async () => {
    if (!teams) return;
    const line = (slot: Slot) => `• ${slot.player} – ${slot.lane}${slot.hero ? `: ${slot.hero.name}` : ''}`;
    const text = [
      '🎮 Chia team Liên Quân (RandomTuong.vn)',
      '🔵 Đội Xanh',
      ...teams.blue.map(line),
      '🔴 Đội Đỏ',
      ...teams.red.map(line),
    ].join('\n');
    const url = absoluteUrl(
      `/mini-game/chia-team/?n=${encodeURIComponent(names.join('|'))}&s=${seed}&h=${withHeroes ? 1 : 0}`
    );
    const result = await shareOrCopy(text, url);
    setShareMsg(result === 'copied' ? 'Đã copy kết quả + link!' : result === 'shared' ? 'Đã gửi!' : 'Không thể chia sẻ');
  }, [teams, names, seed, withHeroes]);

  return (
    <GamePage
      slug="chia-team"
      title="Chia Team Liên Quân Với Bạn Bè - Random Đội & Tướng | RandomTuong.vn"
      description="Chia team Liên Quân Mobile cho nhóm bạn 2–10 người: nhập tên, tự chia 2 đội công bằng, xếp lane và random tướng không trùng. Gửi link để cả nhóm thấy cùng kết quả."
      keywords="chia team liên quân, chia đội liên quân, random team liên quân, chia đội custom liên quân, random đội bạn bè"
      h1="Chia Team Liên Quân Với Bạn Bè"
      lead="Nhập tên cả hội → chia 2 đội, xếp lane, random tướng. Gửi link cho cả nhóm vào custom."
      howTo={[
        'Nhập tên 2–10 người chơi, mỗi tên một dòng (hoặc cách nhau bằng dấu phẩy).',
        'Bật/tắt tuỳ chọn random tướng cho từng người rồi bấm Chia team.',
        'Bấm Gửi cho cả nhóm để copy kết quả kèm link. Ai mở link cũng thấy đúng đội hình này.',
      ]}
      faqs={[
        {
          question: 'Chia team Liên Quân có công bằng không?',
          answer:
            'Danh sách người chơi được xáo trộn ngẫu nhiên rồi chia luân phiên vào hai đội, mỗi người được gán một lane khác nhau và tướng phù hợp lane, không trùng tướng giữa hai đội.',
        },
        {
          question: 'Bạn bè có xem được kết quả chia team không?',
          answer:
            'Có. Kết quả được mã hoá trong link, bạn bè mở link sẽ thấy đúng đội hình và tướng như bạn mà không cần tài khoản.',
        },
      ]}
    >
      <div className="layout two">
        <div className="panel">
          <label className="mini-title" htmlFor="player-names">
            Người chơi ({parsedNames.length}/10)
          </label>
          <textarea
            id="player-names"
            className="search names-input"
            rows={7}
            value={rawNames}
            onChange={e => setRawNames(e.target.value)}
            placeholder={'Mỗi dòng một tên\nVD: Minh\nTuấn'}
          />
          <label className="toggle">
            <input type="checkbox" checked={withHeroes} onChange={e => setWithHeroes(e.target.checked)} />
            Random tướng cho từng người
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="button" disabled={parsedNames.length < 2} onClick={draw}>
              🎲 {teams ? 'Chia lại' : 'Chia team'}
            </button>
            <button className="btn btn-facebook" type="button" disabled={!teams} onClick={share}>
              📤 Gửi cho cả nhóm
            </button>
          </div>
          {shareMsg && <p className="toast">{shareMsg}</p>}
          {parsedNames.length < 2 && <p className="source-note">Cần ít nhất 2 người chơi.</p>}
        </div>

        <div className="panel">
          {fromLink && <div className="challenge-banner">🔗 Kết quả được bạn bè chia sẻ</div>}
          {!teams ? (
            <div className="empty">Nhập tên rồi bấm Chia team để bốc thăm.</div>
          ) : (
            <div className="team-grid">
              {(['blue', 'red'] as const).map(side => (
                <div key={side} className="team-box">
                  <div className={`team-header ${side}`}>
                    {side === 'blue' ? '🔵 Đội Xanh' : '🔴 Đội Đỏ'} · {teams[side].length}
                  </div>
                  {teams[side].map(slot => (
                    <div key={slot.player} className="team-member reveal-in">
                      {slot.hero ? (
                        <img src={slot.hero.imageUrl} alt={slot.hero.name} className="member-avatar" loading="lazy" />
                      ) : (
                        <div className="member-avatar member-avatar-empty">👤</div>
                      )}
                      <div>
                        <div className="member-name">{slot.player}</div>
                        <div className="member-role">
                          {slot.lane}
                          {slot.hero && (
                            <>
                              {' · '}
                              <Link href={`/tuong/${slugify(slot.hero.name)}/`}>{slot.hero.name}</Link>
                            </>
                          )}
                        </div>
                      </div>
                      {slot.hero && <span className={`chip ${slot.hero.tier.toLowerCase()}`}>T{slot.hero.tier}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GamePage>
  );
}
