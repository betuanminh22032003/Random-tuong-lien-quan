import KeywordPage from '@/components/KeywordPage';

export default function RandomTuongLienQuanPage() {
  return (
    <KeywordPage
      slug="random-tuong-lien-quan"
      title="Random Tướng Liên Quân Mobile Miễn Phí | RandomTuong.vn"
      description="Random tướng Liên Quân Mobile miễn phí, lọc theo vai trò, độ khó và xem nhanh trang chi tiết tướng từ dữ liệu Garena."
      h1="Random Tướng Liên Quân Mobile"
      lead="Quay tướng ngẫu nhiên nhanh, có lọc vai trò và độ khó."
      primaryCta="Random tướng ngay"
      sections={[
        {
          heading: 'Khi nào nên dùng random tướng?',
          body:
            'Công cụ phù hợp khi bạn chơi vui với bạn bè, muốn thử tướng mới hoặc cần một lựa chọn nhanh trước trận. Bộ lọc vai trò giúp giới hạn pool theo đấu sĩ, sát thủ, pháp sư, xạ thủ, đỡ đòn, trợ thủ hoặc đi rừng.',
        },
        {
          heading: 'Dữ liệu tướng lấy từ đâu?',
          body:
            'RandomTuong.vn dùng danh sách tướng, ảnh, vai trò chính thức và kỹ năng được crawl từ trang tướng của Garena. Các chỉ số tier, lane, độ khó và winrate là metadata tham khảo của app để hỗ trợ random và ban/pick.',
        },
        {
          heading: 'Mẹo random công bằng hơn',
          body:
            'Nếu cả nhóm chơi theo luật tự đặt, hãy chốt trước vai trò hoặc độ khó rồi mới bấm random. Với người mới, nên lọc độ khó dễ hoặc vừa để kết quả dễ chơi hơn.',
        },
      ]}
      faqs={[
        {
          question: 'Random tướng Liên Quân trên RandomTuong.vn có miễn phí không?',
          answer:
            'Có. Bạn có thể random tướng, random đội 5v5, ban/pick và xem trang chi tiết tướng miễn phí, không cần đăng ký.',
        },
        {
          question: 'Có thể lọc tướng trước khi random không?',
          answer:
            'Có. Trang chủ hỗ trợ lọc theo vai trò, lane phụ và độ khó để kết quả random sát nhu cầu hơn.',
        },
        {
          question: 'Kết quả random có bị lặp không?',
          answer:
            'Bạn có thể bấm Random tiếp để quay lại. App cũng lưu lịch sử gần đây trong trình duyệt để bạn dễ xem lại những tướng vừa random.',
        },
      ]}
    />
  );
}
