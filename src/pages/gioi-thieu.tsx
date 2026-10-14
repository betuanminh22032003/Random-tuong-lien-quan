import Link from 'next/link';
import { HEROES } from '@/data/heroes';
import { MINI_GAMES } from '@/data/site';
import InfoPage from '@/components/InfoPage';

export default function AboutPage() {
  return (
    <InfoPage
      path="/gioi-thieu/"
      title="Giới thiệu RandomTuong.vn - Công cụ & Mini Game Liên Quân Mobile"
      description="RandomTuong.vn là dự án cá nhân, phi chính thức, cung cấp công cụ random tướng, chia đội, ban/pick và mini game Liên Quân Mobile miễn phí cho game thủ Việt Nam."
      h1="Giới thiệu RandomTuong.vn"
      lead="Dự án cá nhân, làm bởi một người chơi Liên Quân, dành cho cộng đồng game thủ Việt."
    >
      <h2>RandomTuong.vn là gì?</h2>
      <p>
        RandomTuong.vn bắt đầu từ một nhu cầu rất đời thường: mỗi lần rủ bạn bè đánh custom, cả nhóm mất cả
        chục phút cãi nhau ai chơi tướng gì, ai đi đường nào. Trang web gom các công cụ giúp giải quyết chuyện
        đó trong vài giây — random tướng, chia đội 5v5, mô phỏng ban/pick — và thêm các{' '}
        <Link href="/mini-game/">mini game</Link> để cả hội có thêm trò vui ngoài trận đấu.
      </p>

      <h2>Bạn có thể làm gì ở đây?</h2>
      <ul>
        <li>
          <Link href="/">Random tướng</Link> theo vai trò và độ khó, random đội 5v5, chạy thử trình tự ban/pick.
        </li>
        <li>
          Tra cứu <Link href="/tuong/">{HEROES.length} tướng</Link> với ảnh, vai trò và bộ kỹ năng, xem{' '}
          <Link href="/tier-list-lien-quan/">tier list</Link> tham khảo.
        </li>
        <li>
          Chơi {MINI_GAMES.length} mini game: {MINI_GAMES.map(g => g.name).join(', ')}.
        </li>
        <li>
          Đọc <Link href="/huong-dan/">cẩm nang</Link> với các bài hướng dẫn cho người mới và mẹo chơi cùng bạn bè.
        </li>
      </ul>

      <h2>Dữ liệu lấy từ đâu?</h2>
      <p>
        Tên tướng, ảnh, vai trò chính thức và mô tả kỹ năng được tổng hợp từ trang thông tin tướng công khai của
        Garena Liên Quân Mobile. Các chỉ số tier, độ khó, lane gợi ý và winrate là dữ liệu tham khảo do
        RandomTuong.vn tự đánh giá để công cụ random và ban/pick hoạt động — không phải số liệu chính thức của nhà
        phát hành.
      </p>

      <h2>Tuyên bố miễn trừ</h2>
      <p>
        RandomTuong.vn là trang web của người hâm mộ, không thuộc về, không được tài trợ hay xác nhận bởi Garena,
        Tencent Games hoặc TiMi Studio. Liên Quân Mobile và các tài sản liên quan thuộc về chủ sở hữu tương ứng.
      </p>

      <h2>Góp ý</h2>
      <p>
        Thấy sai sót, thiếu tướng mới hay có ý tưởng mini game? Hãy ghé trang <Link href="/lien-he/">Liên hệ</Link>.
      </p>
    </InfoPage>
  );
}
