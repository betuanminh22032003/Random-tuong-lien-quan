import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import InfoPage from '@/components/InfoPage';

export default function ContactPage() {
  return (
    <InfoPage
      path="/lien-he/"
      title="Liên hệ RandomTuong.vn - Góp ý, báo lỗi, hợp tác"
      description="Liên hệ RandomTuong.vn để góp ý tính năng, báo lỗi dữ liệu tướng Liên Quân Mobile hoặc trao đổi hợp tác."
      h1="Liên hệ"
      lead="Góp ý, báo lỗi hay đề xuất hợp tác — mọi tin nhắn đều được đọc."
    >
      <h2>Kênh liên hệ</h2>
      <ul>
        {APP_CONFIG.contactEmail && (
          <li>
            Email: <a href={`mailto:${APP_CONFIG.contactEmail}`}>{APP_CONFIG.contactEmail}</a>
          </li>
        )}
        <li>
          Báo lỗi / góp ý công khai:{' '}
          <a href={APP_CONFIG.feedbackUrl} target="_blank" rel="noopener noreferrer">
            mục Issues trên GitHub
          </a>
        </li>
      </ul>

      <h2>Bạn có thể gửi gì?</h2>
      <ul>
        <li>Tướng mới chưa có trên trang, ảnh lỗi hoặc mô tả kỹ năng chưa cập nhật.</li>
        <li>Ý kiến về tier list, độ khó hoặc lane gợi ý của từng tướng.</li>
        <li>Ý tưởng mini game, luật chơi custom hoặc thử thách mới cho Vòng quay thử thách.</li>
        <li>Đề xuất hợp tác nội dung, giải đấu cộng đồng hoặc quảng cáo.</li>
      </ul>

      <p>
        Trước khi gửi, bạn có thể xem nhanh <Link href="/gioi-thieu/">trang Giới thiệu</Link> và{' '}
        <Link href="/privacy-policy/">Chính sách bảo mật</Link>.
      </p>
    </InfoPage>
  );
}
