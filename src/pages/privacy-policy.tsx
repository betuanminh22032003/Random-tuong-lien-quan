import Link from 'next/link';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy | RandomTuong.vn"
        description="Chính sách quyền riêng tư của RandomTuong.vn: dữ liệu lưu trên trình duyệt, analytics và quảng cáo."
        path="/privacy-policy/"
      />

      <SiteLayout breadcrumbs={[{ name: 'Privacy Policy', path: '/privacy-policy/' }]}>
      <section className="hero-banner">
        <h1>Privacy Policy</h1>
        <p>RandomTuong.vn · Cập nhật 14/10/2026</p>
      </section>


      <div className="privacy-container">
        <div className="privacy-panel">
          <p>
            RandomTuong.vn là công cụ web tĩnh miễn phí dành cho game thủ Liên Quân Mobile. Trang
            này mô tả cách website xử lý dữ liệu khi bạn truy cập và sử dụng công cụ.
          </p>

          <h2>Thông tin chúng tôi thu thập</h2>
          <p>
            Website không yêu cầu đăng ký tài khoản và không thu thập thông tin cá nhân trực tiếp
            như tên, email, số điện thoại hoặc địa chỉ.
          </p>
          <p>
            Công cụ có thể lưu lịch sử random gần đây trong trình duyệt của bạn bằng localStorage.
            Dữ liệu này chỉ nằm trên thiết bị của bạn và có thể được xóa bằng cách xóa dữ liệu
            trình duyệt.
          </p>

          <h2>Analytics và quảng cáo</h2>
          <p>
            Khi Google Analytics hoặc Google AdSense được cấu hình, các dịch vụ của Google có thể
            dùng cookie hoặc công nghệ tương tự để đo lường lượt truy cập, chống gian lận quảng cáo
            và cá nhân hóa/không cá nhân hóa quảng cáo theo chính sách của Google.
          </p>
          <p>
            Các nhà cung cấp bên thứ ba, bao gồm Google, sử dụng cookie để phân phát quảng cáo dựa
            trên những lần truy cập trước đây của bạn vào website này hoặc các website khác. Cookie
            quảng cáo cho phép Google và đối tác hiển thị quảng cáo phù hợp với bạn.
          </p>
          <p>
            Bạn có thể tắt quảng cáo được cá nhân hóa tại{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Cài đặt quảng cáo của Google
            </a>{' '}
            hoặc tại{' '}
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            . Xem cách Google sử dụng dữ liệu tại{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              policies.google.com/technologies/partner-sites
            </a>{' '}
            và{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google Privacy Policy
            </a>
            .
          </p>

          <h2>Liên kết bên ngoài</h2>
          <p>
            Website có thể chứa liên kết tới nguồn dữ liệu, sitemap hoặc nền tảng bên thứ ba.
            Chúng tôi không chịu trách nhiệm cho nội dung và chính sách quyền riêng tư của các
            website bên ngoài.
          </p>

          <h2>Bản quyền và quan hệ với nhà phát hành</h2>
          <p>
            RandomTuong.vn là công cụ cộng đồng độc lập, không thuộc về Garena, VNG hoặc Tencent.
            Tên tướng và nội dung liên quan đến Liên Quân Mobile thuộc chủ sở hữu tương ứng.
          </p>

          <h2>Thay đổi chính sách</h2>
          <p>
            Chính sách này có thể được cập nhật khi website bổ sung tính năng mới, analytics hoặc
            quảng cáo. Ngày cập nhật mới nhất sẽ được hiển thị ở đầu trang.
          </p>

          <p>
            <Link href="/">← Về trang chủ</Link>
          </p>
        </div>
      </div>

      </SiteLayout>
    </>
  );
}
