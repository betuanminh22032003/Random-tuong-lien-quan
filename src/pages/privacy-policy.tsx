import Head from 'next/head';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | RandomTuong.vn</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Chính sách quyền riêng tư của RandomTuong.vn." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={absoluteUrl('/privacy-policy/')} />
      </Head>

      <header className="site-header">
        <h1 style={{ fontSize: '28px', textTransform: 'none' }}>Privacy Policy</h1>
        <p>RandomTuong.vn · Cập nhật 03/06/2026</p>
      </header>

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
            Bạn có thể đọc thêm tại{' '}
            <a href="https://policies.google.com/privacy" rel="noopener noreferrer">
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

      <footer>
        <strong style={{ color: 'var(--gold)' }}>RandomTuong.vn</strong>
        <br />
        <Link href="/">Trang chủ</Link> · <a href="/sitemap.xml">Sitemap</a>
        <br />
        <span>© 2026 RandomTuong.vn</span>
      </footer>
    </>
  );
}
