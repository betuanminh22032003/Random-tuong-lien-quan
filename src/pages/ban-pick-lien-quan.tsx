import KeywordPage from '@/components/KeywordPage';

export default function BanPickLienQuanPage() {
  return (
    <KeywordPage
      slug="ban-pick-lien-quan"
      title="Ban Pick Liên Quân Mobile Ngẫu Nhiên | RandomTuong.vn"
      description="Công cụ ban pick Liên Quân Mobile ngẫu nhiên, mô phỏng lượt cấm/chọn hai đội và tránh trùng tướng đã dùng."
      h1="Ban Pick Liên Quân Mobile"
      lead="Mô phỏng lượt cấm/chọn ngẫu nhiên cho hai đội."
      primaryCta="Dùng ban/pick ngay"
      sections={[
        {
          heading: 'Ban/Pick Liên Quân trên RandomTuong.vn hoạt động thế nào?',
          body:
            'Công cụ chạy theo trình tự 6 lượt cấm và 10 lượt chọn. Mỗi tướng đã bị cấm hoặc đã được chọn sẽ bị loại khỏi pool để các lượt sau không bị trùng.',
        },
        {
          heading: 'Dùng ban/pick để luyện draft',
          body:
            'Bạn có thể dùng tính năng này để tạo draft vui, luyện phản xạ chọn tướng hoặc thử đội hình lạ với bạn bè. Tab Meta trên trang chủ giúp tham khảo nhanh nhóm tướng đang được app xếp tier cao.',
        },
        {
          heading: 'Lưu ý về dữ liệu meta',
          body:
            'Tier, lane và winrate trong app là dữ liệu tham khảo, không phải thống kê chính thức từ Garena. Dữ liệu chính thức trên trang tướng gồm tên, ảnh, vai trò và bộ kỹ năng.',
        },
      ]}
      faqs={[
        {
          question: 'Ban/Pick có tránh trùng tướng không?',
          answer:
            'Có. Tướng đã bị cấm hoặc đã được chọn sẽ không xuất hiện lại trong các lượt ban/pick tiếp theo.',
        },
        {
          question: 'Có thể reset phiên ban/pick không?',
          answer:
            'Có. Trên trang chủ, tab Ban/Pick có nút chơi lại để bắt đầu một phiên draft mới.',
        },
        {
          question: 'Ban/Pick này có giống giải đấu chính thức không?',
          answer:
            'Công cụ mô phỏng trình tự cấm/chọn phổ biến để chơi vui và luyện draft, không thay thế luật giải đấu chính thức.',
        },
      ]}
    />
  );
}
