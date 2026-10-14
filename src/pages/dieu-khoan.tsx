import Link from 'next/link';
import InfoPage from '@/components/InfoPage';

export default function TermsPage() {
  return (
    <InfoPage
      path="/dieu-khoan/"
      title="Điều khoản sử dụng | RandomTuong.vn"
      description="Điều khoản sử dụng website RandomTuong.vn: phạm vi dịch vụ, quyền sở hữu, dữ liệu tham khảo và giới hạn trách nhiệm."
      h1="Điều khoản sử dụng"
      lead="Cập nhật 14/10/2026"
    >
      <h2>1. Chấp nhận điều khoản</h2>
      <p>
        Khi truy cập và sử dụng RandomTuong.vn, bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng
        ngừng sử dụng website.
      </p>

      <h2>2. Dịch vụ</h2>
      <p>
        RandomTuong.vn cung cấp miễn phí các công cụ random tướng, chia đội, mô phỏng ban/pick, tra cứu tướng và mini
        game liên quan đến Liên Quân Mobile. Website không yêu cầu tài khoản và có thể thay đổi, tạm dừng hoặc ngừng
        bất kỳ tính năng nào mà không cần báo trước.
      </p>

      <h2>3. Dữ liệu tham khảo</h2>
      <p>
        Tier, độ khó, lane gợi ý, winrate và chỉ số trong mini game là dữ liệu tham khảo hoặc dùng cho mục đích giải
        trí, không phải số liệu chính thức. Bạn tự chịu trách nhiệm khi sử dụng chúng cho việc chọn tướng hay thi đấu.
      </p>

      <h2>4. Quyền sở hữu</h2>
      <p>
        Liên Quân Mobile, tên tướng, hình ảnh và mô tả kỹ năng thuộc quyền sở hữu của Garena/Tencent Games và được sử
        dụng với mục đích thông tin, phi thương mại cho cộng đồng. Giao diện, mã nguồn và nội dung bài viết do
        RandomTuong.vn tự xây dựng.
      </p>

      <h2>5. Hành vi không được phép</h2>
      <ul>
        <li>Can thiệp, tấn công hoặc làm quá tải website.</li>
        <li>Sao chép toàn bộ nội dung để tái xuất bản như sản phẩm của mình.</li>
        <li>Dùng tên người chơi xúc phạm, phản cảm khi chia sẻ kết quả mini game.</li>
      </ul>

      <h2>6. Quảng cáo và liên kết ngoài</h2>
      <p>
        Website có thể hiển thị quảng cáo từ bên thứ ba (như Google AdSense) và liên kết tới website khác.
        RandomTuong.vn không chịu trách nhiệm về nội dung của các bên này. Xem thêm{' '}
        <Link href="/privacy-policy/">Chính sách bảo mật</Link>.
      </p>

      <h2>7. Giới hạn trách nhiệm</h2>
      <p>
        Website được cung cấp “nguyên trạng”. RandomTuong.vn không đảm bảo dịch vụ luôn chính xác hoặc không gián
        đoạn và không chịu trách nhiệm cho thiệt hại phát sinh từ việc sử dụng website.
      </p>

      <h2>8. Liên hệ</h2>
      <p>
        Mọi thắc mắc về điều khoản, vui lòng xem trang <Link href="/lien-he/">Liên hệ</Link>.
      </p>
    </InfoPage>
  );
}
