import KeywordPage from '@/components/KeywordPage';

export default function RandomDoiLienQuanPage() {
  return (
    <KeywordPage
      slug="random-doi-lien-quan"
      title="Random Đội Liên Quân 5v5 Miễn Phí | RandomTuong.vn"
      description="Random đội Liên Quân 5v5 miễn phí, tự chia hai đội theo lane cơ bản: top, rừng, mid, xạ thủ và trợ thủ."
      h1="Random Đội Liên Quân 5v5"
      lead="Tạo hai đội hình ngẫu nhiên theo 5 lane cơ bản."
      primaryCta="Random đội 5v5"
      sections={[
        {
          heading: 'Random đội 5v5 dùng để làm gì?',
          body:
            'Tính năng random đội giúp nhóm bạn bốc nhanh hai đội hình Liên Quân khi chơi custom hoặc chơi vui. Mỗi đội được ghép theo các vị trí quen thuộc gồm đường trên, đi rừng, đường giữa, xạ thủ và trợ thủ.',
        },
        {
          heading: 'Cách chia đội cân bằng hơn',
          body:
            'Công cụ ưu tiên tướng hợp lane, sau đó mới lấy từ pool còn lại nếu thiếu lựa chọn. Vì đây là random vui, bạn vẫn nên cho phép đổi tướng nếu người chơi chưa sở hữu hoặc chưa quen tướng đó.',
        },
        {
          heading: 'Kết hợp với trang chi tiết tướng',
          body:
            'Sau khi random đội, bạn có thể mở trang chi tiết từng tướng để xem vai trò chính thức và bộ kỹ năng từ nguồn Garena trước khi vào trận.',
        },
      ]}
      faqs={[
        {
          question: 'Random đội Liên Quân có chia đủ 10 tướng không?',
          answer:
            'Có. Tính năng 5v5 tạo hai đội, mỗi đội 5 tướng theo các lane cơ bản nếu pool tướng còn đủ lựa chọn.',
        },
        {
          question: 'Random đội có cân bằng tuyệt đối không?',
          answer:
            'Không. Đây là công cụ random vui có ưu tiên lane, không phải hệ thống xếp hạng sức mạnh chính thức.',
        },
        {
          question: 'Có thể random lại đội khác không?',
          answer:
            'Có. Bạn chỉ cần bấm Random đội 5v5 lại để tạo hai đội hình mới.',
        },
      ]}
    />
  );
}
