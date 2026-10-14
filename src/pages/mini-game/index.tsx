import Link from 'next/link';
import { MINI_GAMES } from '@/data/site';
import { absoluteUrl } from '@/lib/seo';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

const PATH = '/mini-game/';
const BREADCRUMBS = [{ name: 'Mini game', path: PATH }];

const FAQS = [
  {
    question: 'Mini game Liên Quân trên RandomTuong.vn có miễn phí không?',
    answer: 'Có. Tất cả mini game đều miễn phí, chạy ngay trên trình duyệt điện thoại hoặc máy tính, không cần đăng ký.',
  },
  {
    question: 'Làm sao chơi cùng bạn bè?',
    answer:
      'Mỗi game có nút Gửi link. Bạn bè mở link sẽ nhận đúng bộ câu hỏi (Đoán tướng) hoặc đúng kết quả chia đội/thử thách giống bạn để so điểm và vào custom cùng nhau.',
  },
  {
    question: 'Có cần cài app không?',
    answer: 'Không. RandomTuong.vn là web app, bạn có thể thêm vào màn hình chính điện thoại để mở nhanh như app.',
  },
];

export default function MiniGameHub() {
  return (
    <>
      <Seo
        title="Mini Game Liên Quân Mobile - Đoán Tướng, Chia Team, Thử Thách | RandomTuong.vn"
        description="Tổng hợp mini game Liên Quân Mobile chơi cùng bạn bè: đoán tướng qua kỹ năng và ảnh mờ, chia team random tướng, vòng quay thử thách, đấu bài tướng. Miễn phí, gửi link thách đấu."
        path={PATH}
        keywords="mini game liên quân, đoán tướng liên quân, quiz liên quân, chia team liên quân, vòng quay thử thách liên quân, game liên quân chơi với bạn"
        breadcrumbs={BREADCRUMBS}
        faqs={FAQS}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Mini game Liên Quân Mobile',
            itemListElement: MINI_GAMES.map((game, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: game.name,
              url: absoluteUrl(`/mini-game/${game.slug}/`),
            })),
          },
        ]}
      />

      <SiteLayout breadcrumbs={BREADCRUMBS}>
        <section className="hero-banner">
          <p className="eyebrow">Chơi ngay · không cần đăng ký</p>
          <h1>Mini Game Liên Quân Mobile</h1>
          <p>Rủ cả hội vào chơi: đoán tướng, chia team, vòng quay thử thách và đấu bài tướng.</p>
        </section>

        <main className="shell">
          <div className="game-grid large">
            {MINI_GAMES.map(game => (
              <Link key={game.slug} href={`/mini-game/${game.slug}/`} className="game-card">
                <span className="game-emoji" aria-hidden="true">
                  {game.emoji}
                </span>
                <strong>{game.name}</strong>
                <span>{game.description}</span>
                <em>{game.players}</em>
                <b className="game-cta">Chơi ngay →</b>
              </Link>
            ))}
          </div>

          <section className="faq-list" style={{ marginTop: 18 }}>
            <h2>Câu hỏi thường gặp</h2>
            {FAQS.map(item => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </section>
        </main>
      </SiteLayout>
    </>
  );
}
