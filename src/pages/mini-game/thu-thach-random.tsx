import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HEROES, Hero, slugify } from '@/data/heroes';
import { newSeed, parsePlayerNames, pickRandom, rngFromSeed, sample, shareOrCopy } from '@/lib/random';
import { absoluteUrl } from '@/lib/seo';
import GamePage from '@/components/GamePage';

interface Challenge {
  text: string;
  hard: boolean;
}

const CHALLENGES: Challenge[] = [
  { text: 'Không được mua giày cả trận', hard: false },
  { text: 'Chỉ được lên đồ phép', hard: false },
  { text: 'Chỉ được lên đồ vật lý', hard: false },
  { text: 'Full đồ thủ, không món công nào', hard: false },
  { text: 'Phải đi rừng dù tướng gì', hard: false },
  { text: 'Phép bổ trợ bắt buộc: Tốc biến → đổi sang Gầm thét', hard: false },
  { text: 'Không dùng phép bổ trợ cả trận', hard: true },
  { text: 'Không được về nhà (biến về) trước phút 10', hard: false },
  { text: 'Mỗi lần chết phải gõ "xin lỗi team" vào chat', hard: false },
  { text: 'Đi cùng đường với xạ thủ suốt trận', hard: false },
  { text: 'Không được dùng chiêu cuối trước phút 5', hard: false },
  { text: 'Chỉ được mua đồ theo thứ tự trong shop từ trên xuống', hard: true },
  { text: 'Không được nhặt mạng — chỉ hỗ trợ', hard: true },
  { text: 'Phải ăn được Tà thần đầu tiên', hard: false },
  { text: 'Chỉ dùng 1 bảng ngọc mặc định', hard: false },
  { text: 'Tắt bản đồ nhỏ (che góc màn hình) 5 phút đầu', hard: true },
  { text: 'Không mua đồ hồi máu/hút máu', hard: false },
  { text: 'Phải có ít nhất 10 hỗ trợ', hard: false },
  { text: 'Bán hết đồ ở phút 15 rồi mua lại build mới', hard: true },
  { text: 'Giao tranh nào cũng phải lao vào đầu tiên', hard: false },
  { text: 'Không được đánh trụ trước phút 8', hard: false },
  { text: 'Chơi bằng 1 tay', hard: true },
  { text: 'Không món đồ nào giá trên 2000 vàng', hard: true },
  { text: 'Bắt buộc dùng biểu cảm sau mỗi pha hạ gục', hard: false },
];

const ACTIVE_HEROES = HEROES.filter(h => h.available !== false);

interface Result {
  player: string;
  hero: Hero;
  challenge: Challenge;
}

function buildResults(players: string[], seed: string, hard: boolean): Result[] {
  const rng = rngFromSeed(`challenge:${seed}`);
  const heroes = sample(ACTIVE_HEROES, players.length, rng);
  const pool = CHALLENGES.filter(c => hard || !c.hard);
  const picked = sample(pool, Math.min(players.length, pool.length), rng);
  return players.map((player, i) => ({
    player,
    hero: heroes[i],
    challenge: picked[i] || pickRandom(pool, rng),
  }));
}

export default function ChallengeWheelPage() {
  const router = useRouter();
  const linkRead = useRef(false);
  const [rawNames, setRawNames] = useState('Tôi');
  const [hard, setHard] = useState(false);
  const [seed, setSeed] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [flash, setFlash] = useState<Hero | null>(null);
  const [shareMsg, setShareMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Read shared-link params once; later router.replace calls are our own writes.
    if (!router.isReady || linkRead.current) return;
    linkRead.current = true;
    const { n, s, x } = router.query;
    if (typeof n === 'string' && typeof s === 'string') {
      const parsed = parsePlayerNames(n.replace(/\|/g, '\n'));
      if (parsed.length) {
        setRawNames(parsed.join('\n'));
        setPlayers(parsed);
        setSeed(s);
        setHard(x === '1');
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const results = useMemo(() => (seed && players.length ? buildResults(players, seed, hard) : []), [
    seed,
    players,
    hard,
  ]);

  const parsedNames = parsePlayerNames(rawNames);

  const spin = useCallback(() => {
    if (spinning || !parsedNames.length) return;
    const nextSeed = newSeed();
    setSpinning(true);
    setShareMsg('');
    let ticks = 0;
    timerRef.current = setInterval(() => {
      setFlash(pickRandom(ACTIVE_HEROES));
      ticks += 1;
      if (ticks >= 16) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setFlash(null);
        setSpinning(false);
        setPlayers(parsedNames);
        setSeed(nextSeed);
        router.replace(
          { pathname: router.pathname, query: { n: parsedNames.join('|'), s: nextSeed, x: hard ? '1' : '0' } },
          undefined,
          { shallow: true, scroll: false }
        );
      }
    }, 90);
  }, [spinning, parsedNames, hard, router]);

  const share = useCallback(async () => {
    if (!results.length) return;
    const text = [
      '🎡 Vòng quay thử thách Liên Quân (RandomTuong.vn)',
      ...results.map(r => `• ${r.player}: ${r.hero.name} — ${r.challenge.text}`),
    ].join('\n');
    const url = absoluteUrl(
      `/mini-game/thu-thach-random/?n=${encodeURIComponent(players.join('|'))}&s=${seed}&x=${hard ? 1 : 0}`
    );
    const result = await shareOrCopy(text, url);
    setShareMsg(result === 'copied' ? 'Đã copy thử thách + link!' : result === 'shared' ? 'Đã gửi!' : 'Không thể chia sẻ');
  }, [results, players, seed, hard]);

  return (
    <GamePage
      slug="thu-thach-random"
      title="Vòng Quay Thử Thách Liên Quân - Random Tướng + Luật Chơi Vui | RandomTuong.vn"
      description="Vòng quay thử thách Liên Quân Mobile: mỗi người nhận một tướng ngẫu nhiên kèm luật chơi oái oăm như không mua giày, chỉ build phép, chơi 1 tay. Gửi link cho bạn bè chơi custom."
      keywords="vòng quay thử thách liên quân, thử thách liên quân, random tướng thử thách, luật chơi custom liên quân, vòng quay tướng liên quân"
      h1="Vòng Quay Thử Thách Liên Quân"
      lead="Random tướng + một thử thách oái oăm cho mỗi người. Ai hoàn thành, người đó là trùm!"
      howTo={[
        'Nhập tên người chơi (1–10 người), mỗi dòng một tên.',
        'Bật Chế độ hành xác nếu muốn thêm các thử thách khó như chơi 1 tay, không phép bổ trợ.',
        'Bấm Quay, rồi gửi kết quả cho cả nhóm để vào trận custom hoặc đấu thường.',
      ]}
      faqs={[
        {
          question: 'Vòng quay thử thách Liên Quân là gì?',
          answer:
            'Là mini game random cho mỗi người chơi một tướng Liên Quân và một luật chơi vui để thử thách kỹ năng, phù hợp đấu custom với bạn bè hoặc làm nội dung stream.',
        },
        {
          question: 'Có thể chơi một mình không?',
          answer: 'Có. Chỉ cần để một tên và bấm Quay, bạn sẽ nhận tướng và thử thách cho trận tiếp theo.',
        },
      ]}
    >
      <div className="layout two">
        <div className="panel">
          <label className="mini-title" htmlFor="challenge-names">
            Người chơi ({parsedNames.length}/10)
          </label>
          <textarea
            id="challenge-names"
            className="search names-input"
            rows={5}
            value={rawNames}
            onChange={e => setRawNames(e.target.value)}
          />
          <label className="toggle">
            <input type="checkbox" checked={hard} onChange={e => setHard(e.target.checked)} />
            🔥 Chế độ hành xác
          </label>
          <div className={`wheel${spinning ? ' spinning' : ''}`} aria-hidden="true">
            {flash ? <img src={flash.imageUrl} alt="" /> : <span>🎡</span>}
          </div>
          <div className="actions">
            <button className="btn btn-primary" type="button" disabled={spinning || !parsedNames.length} onClick={spin}>
              {spinning ? 'Đang quay…' : '🎡 Quay'}
            </button>
            <button className="btn btn-facebook" type="button" disabled={!results.length || spinning} onClick={share}>
              📤 Gửi bạn bè
            </button>
          </div>
          {shareMsg && <p className="toast">{shareMsg}</p>}
        </div>

        <div className="panel">
          {!results.length || spinning ? (
            <div className="empty">{spinning ? 'Vòng quay đang chạy…' : 'Bấm Quay để nhận tướng và thử thách.'}</div>
          ) : (
            <div className="challenge-list">
              {results.map(r => (
                <article key={r.player} className={`challenge-card reveal-in${r.challenge.hard ? ' hard' : ''}`}>
                  <img src={r.hero.imageUrl} alt={r.hero.name} width={64} height={64} />
                  <div>
                    <span className="mini-title">{r.player}</span>
                    <strong>
                      <Link href={`/tuong/${slugify(r.hero.name)}/`}>{r.hero.name}</Link>
                    </strong>
                    <p>
                      {r.challenge.hard ? '🔥 ' : '🎯 '}
                      {r.challenge.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </GamePage>
  );
}
