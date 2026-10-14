import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HEROES, Hero, ROLE_LABELS, slugify } from '@/data/heroes';
import { newSeed, rngFromSeed, sample, shareOrCopy, shuffle } from '@/lib/random';
import { absoluteUrl } from '@/lib/seo';
import GamePage from '@/components/GamePage';

type Mode = 'skill' | 'ult' | 'image';
type Phase = 'menu' | 'question' | 'reveal' | 'done';

interface Question {
  hero: Hero;
  options: Hero[];
  clue: string;
  clueTitle: string;
}

const MODES: Record<Mode, { label: string; desc: string }> = {
  skill: { label: '📜 Qua kỹ năng', desc: 'Đọc mô tả một chiêu, đoán tướng' },
  ult: { label: '💥 Tên chiêu cuối', desc: 'Chỉ có tên chiêu cuối — khó!' },
  image: { label: '🖼️ Ảnh mờ', desc: 'Ảnh rõ dần theo thời gian' },
};

const QUESTION_COUNT = 10;
const QUESTION_MS = 15000;
const BEST_KEY = 'randomtuong.quiz.best.v1';
const QUIZ_POOL = HEROES.filter(h => h.available !== false && h.skills.length >= 4 && h.imageUrl);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function maskName(text: string, name: string): string {
  return text.replace(new RegExp(escapeRegExp(name), 'gi'), '???');
}

function buildQuestions(seed: string, mode: Mode): Question[] {
  const rng = rngFromSeed(`${seed}:${mode}`);
  const answers = sample(QUIZ_POOL, QUESTION_COUNT, rng);
  return answers.map(hero => {
    const sameRole = QUIZ_POOL.filter(h => h.name !== hero.name && h.role === hero.role);
    const others = QUIZ_POOL.filter(h => h.name !== hero.name && h.role !== hero.role);
    const distractors = [...sample(sameRole, 2, rng), ...sample(others, 3, rng)].slice(0, 3);
    const options = shuffle([hero, ...distractors], rng);
    if (mode === 'ult') {
      return { hero, options, clueTitle: 'Chiêu cuối', clue: hero.skills[3].name };
    }
    const skillIndex = 1 + Math.floor(rng() * 3);
    const skill = hero.skills[skillIndex];
    return {
      hero,
      options,
      clueTitle: `Chiêu ${skillIndex}: ${maskName(skill.name, hero.name)}`,
      clue: maskName(skill.description, hero.name),
    };
  });
}

function loadBest(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(BEST_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function isMode(value: unknown): value is Mode {
  return value === 'skill' || value === 'ult' || value === 'image';
}

export default function GuessHeroPage() {
  const router = useRouter();
  const linkRead = useRef(false);
  const [mode, setMode] = useState<Mode>('skill');
  const [seed, setSeed] = useState('');
  const [challenged, setChallenged] = useState(false);
  const [phase, setPhase] = useState<Phase>('menu');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState<Record<string, number>>({});
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => setBest(loadBest()), []);

  useEffect(() => {
    // Read shared-link params once; later router.replace calls are our own writes.
    if (!router.isReady || linkRead.current) return;
    linkRead.current = true;
    const { s, m } = router.query;
    if (typeof s === 'string' && /^[a-z0-9]{3,12}$/.test(s)) {
      setSeed(s);
      setChallenged(true);
    }
    if (isMode(m)) setMode(m);
  }, [router.isReady, router.query]);

  const questions = useMemo(() => (seed ? buildQuestions(seed, mode) : []), [seed, mode]);
  const question = questions[index];
  const elapsed = Math.max(0, now - startedAt);
  const remaining = Math.max(0, QUESTION_MS - elapsed);

  const answer = useCallback(
    (name: string | null) => {
      if (phase !== 'question' || !question) return;
      setChosen(name);
      setPhase('reveal');
      if (name === question.hero.name) {
        const timeBonus = Math.round((remaining / QUESTION_MS) * 100);
        setScore(prev => prev + 100 + timeBonus + streak * 20);
        setCorrect(prev => prev + 1);
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
    },
    [phase, question, remaining, streak]
  );

  useEffect(() => {
    if (phase !== 'question') return;
    const timer = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'question' && startedAt && remaining === 0) answer(null);
  }, [phase, remaining, startedAt, answer]);

  const start = useCallback(
    (fresh: boolean) => {
      const nextSeed = fresh || !seed ? newSeed() : seed;
      setSeed(nextSeed);
      if (fresh) setChallenged(false);
      router.replace({ pathname: router.pathname, query: { s: nextSeed, m: mode } }, undefined, {
        shallow: true,
        scroll: false,
      });
      setIndex(0);
      setScore(0);
      setCorrect(0);
      setStreak(0);
      setChosen(null);
      setShareMsg('');
      const t = Date.now();
      setStartedAt(t);
      setNow(t);
      setPhase('question');
    },
    [seed, mode, router]
  );

  const next = useCallback(() => {
    if (index + 1 >= questions.length) {
      setPhase('done');
      setBest(prev => {
        const key = mode;
        if ((prev[key] || 0) >= score) return prev;
        const updated = { ...prev, [key]: score };
        try {
          localStorage.setItem(BEST_KEY, JSON.stringify(updated));
        } catch {
          // localStorage disabled
        }
        return updated;
      });
      return;
    }
    setIndex(i => i + 1);
    setChosen(null);
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
    setPhase('question');
  }, [index, questions.length, mode, score]);

  const share = useCallback(async () => {
    const url = absoluteUrl(`/mini-game/doan-tuong/?s=${seed}&m=${mode}`);
    const result = await shareOrCopy(
      `🧠 Mình đoán đúng ${correct}/${QUESTION_COUNT} tướng Liên Quân (${score} điểm, chế độ ${MODES[mode].label}). Bạn chơi cùng bộ câu hỏi xem ai hơn!`,
      url
    );
    setShareMsg(result === 'copied' ? 'Đã copy link thách đấu!' : result === 'shared' ? 'Đã gửi!' : 'Không thể chia sẻ');
  }, [seed, mode, correct, score]);

  const blur = mode === 'image' && phase === 'question' ? Math.round((remaining / QUESTION_MS) * 22) : 0;

  return (
    <GamePage
      slug="doan-tuong"
      title="Đoán Tướng Liên Quân - Quiz Kỹ Năng, Ảnh Mờ | Mini Game RandomTuong.vn"
      description="Mini game đoán tướng Liên Quân Mobile: 10 câu đoán qua mô tả kỹ năng, tên chiêu cuối hoặc ảnh mờ. Tính điểm theo tốc độ, gửi link thách đấu bạn bè cùng bộ câu hỏi."
      keywords="đoán tướng liên quân, quiz liên quân, đố vui liên quân, đoán tướng qua kỹ năng, đoán tướng qua hình, mini game liên quân"
      h1="Đoán Tướng Liên Quân"
      lead="Bạn thuộc bao nhiêu tướng? 10 câu, 15 giây mỗi câu — trả lời càng nhanh càng nhiều điểm."
      howTo={[
        'Chọn chế độ: đoán qua kỹ năng, tên chiêu cuối hoặc ảnh mờ.',
        'Mỗi câu có 15 giây và 4 đáp án. Trả lời nhanh để nhận thêm điểm thưởng, đúng liên tiếp để nhân combo.',
        'Hết 10 câu, bấm Thách bạn bè để gửi link — bạn bè sẽ chơi đúng bộ câu hỏi của bạn.',
      ]}
      faqs={[
        {
          question: 'Mini game đoán tướng Liên Quân tính điểm thế nào?',
          answer:
            'Mỗi câu đúng được 100 điểm, cộng tối đa 100 điểm thưởng tốc độ và 20 điểm cho mỗi câu đúng liên tiếp trước đó.',
        },
        {
          question: 'Làm sao thách đấu bạn bè cùng bộ câu hỏi?',
          answer:
            'Link trên thanh địa chỉ chứa mã bộ câu hỏi. Bấm Thách bạn bè để copy hoặc chia sẻ link qua Zalo, Messenger, Discord.',
        },
      ]}
    >
      <div className="panel game-panel">
        {phase === 'menu' && (
          <div className="quiz-menu">
            {challenged && (
              <div className="challenge-banner">⚔️ Bạn được thách đấu! Chơi cùng bộ câu hỏi với bạn mình.</div>
            )}
            <span className="mini-title">Chọn chế độ</span>
            <div className="mode-grid">
              {(Object.keys(MODES) as Mode[]).map(key => (
                <button
                  key={key}
                  type="button"
                  className={`mode-card${mode === key ? ' active' : ''}`}
                  onClick={() => setMode(key)}
                >
                  <strong>{MODES[key].label}</strong>
                  <span>{MODES[key].desc}</span>
                  <em>Kỷ lục: {best[key] || 0}</em>
                </button>
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={() => start(!challenged)}>
                ▶ {challenged ? 'Nhận thách đấu' : 'Bắt đầu'}
              </button>
              {challenged && (
                <button className="btn btn-plain" type="button" onClick={() => start(true)}>
                  Bộ câu hỏi mới
                </button>
              )}
            </div>
          </div>
        )}

        {(phase === 'question' || phase === 'reveal') && question && (
          <div className="quiz">
            <div className="quiz-hud">
              <span>
                Câu {index + 1}/{questions.length}
              </span>
              <span>🔥 x{streak}</span>
              <strong>{score} điểm</strong>
            </div>
            <div className="timer-bar" aria-hidden="true">
              <i style={{ width: `${phase === 'question' ? (remaining / QUESTION_MS) * 100 : 0}%` }} />
            </div>

            {mode === 'image' ? (
              <div className="quiz-image">
                <img
                  src={question.hero.imageUrl}
                  alt=""
                  style={{ filter: phase === 'question' ? `blur(${blur}px) grayscale(0.4)` : 'none' }}
                />
              </div>
            ) : (
              <div className="quiz-clue">
                <span className="mini-title">{question.clueTitle}</span>
                <p className={mode === 'ult' ? 'clue-big' : ''}>{question.clue}</p>
              </div>
            )}

            <div className="quiz-options">
              {question.options.map(option => {
                const state =
                  phase === 'reveal'
                    ? option.name === question.hero.name
                      ? ' correct'
                      : option.name === chosen
                        ? ' wrong'
                        : ' dim'
                    : '';
                return (
                  <button
                    key={option.name}
                    type="button"
                    className={`quiz-option${state}`}
                    disabled={phase === 'reveal'}
                    onClick={() => answer(option.name)}
                  >
                    {mode !== 'image' && phase === 'reveal' && (
                      <img src={option.imageUrl} alt="" width={32} height={32} />
                    )}
                    {option.name}
                  </button>
                );
              })}
            </div>

            {phase === 'reveal' && (
              <div className="quiz-reveal">
                <p>
                  {chosen === question.hero.name ? '✅ Chính xác!' : chosen ? '❌ Sai rồi!' : '⏰ Hết giờ!'} Đáp án:{' '}
                  <Link href={`/tuong/${slugify(question.hero.name)}/`}>{question.hero.name}</Link> (
                  {ROLE_LABELS[question.hero.role]})
                </p>
                <button className="btn btn-primary" type="button" onClick={next}>
                  {index + 1 >= questions.length ? '🏁 Xem kết quả' : 'Câu tiếp →'}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="quiz-result">
            <div className="result-score">{score}</div>
            <p>
              Đúng <strong>{correct}/{questions.length}</strong> câu ·{' '}
              {correct >= 9
                ? '🏆 Thách đấu thật sự!'
                : correct >= 7
                  ? '💎 Cao thủ Liên Quân'
                  : correct >= 4
                    ? '⚔️ Khá đấy, luyện thêm nhé'
                    : '🌱 Tân thủ — xem thêm trang tướng nhé'}
            </p>
            <p className="source-note">Kỷ lục chế độ này: {best[mode] || score}</p>
            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={share}>
                📤 Thách bạn bè
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => start(true)}>
                ↻ Chơi bộ mới
              </button>
            </div>
            {shareMsg && <p className="toast">{shareMsg}</p>}
            <div className="actions" style={{ marginTop: 0 }}>
              <button className="btn btn-plain" type="button" onClick={() => setPhase('menu')}>
                Đổi chế độ
              </button>
              <Link className="btn btn-plain" href="/tuong/">
                📚 Ôn lại tướng
              </Link>
            </div>
          </div>
        )}
      </div>
    </GamePage>
  );
}
