import type { Hero } from './heroes';

export interface NavLink {
  href: string;
  icon: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', icon: '🎲', label: 'Random' },
  { href: '/mini-game/', icon: '🎮', label: 'Mini game' },
  { href: '/tuong/', icon: '📚', label: 'Tướng' },
  { href: '/tier-list-lien-quan/', icon: '📊', label: 'Tier list' },
  { href: '/huong-dan/', icon: '📖', label: 'Cẩm nang' },
];

export interface MiniGame {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  players: string;
  description: string;
}

export const MINI_GAMES: MiniGame[] = [
  {
    slug: 'doan-tuong',
    name: 'Đoán tướng Liên Quân',
    emoji: '🧠',
    tagline: 'Đoán tướng qua kỹ năng hoặc ảnh mờ',
    players: '1 người · thách đấu bạn bè',
    description:
      'Quiz 10 câu đoán tướng Liên Quân qua mô tả kỹ năng, tên chiêu cuối hoặc ảnh bị làm mờ. Gửi link để bạn bè chơi đúng bộ câu hỏi của bạn và so điểm.',
  },
  {
    slug: 'chia-team',
    name: 'Chia team với bạn bè',
    emoji: '🤝',
    tagline: 'Nhập tên cả nhóm, chia 2 đội + random tướng',
    players: '2–10 người',
    description:
      'Nhập tên nhóm bạn, công cụ chia hai đội công bằng, xếp lane và random tướng không trùng cho từng người. Gửi link để cả nhóm xem cùng một kết quả.',
  },
  {
    slug: 'thu-thach-random',
    name: 'Vòng quay thử thách',
    emoji: '🎡',
    tagline: 'Random tướng + luật chơi "hành xác"',
    players: '1–10 người',
    description:
      'Mỗi người nhận một tướng ngẫu nhiên kèm một thử thách vui như không mua giày, chỉ build phép, phải đi rừng… Hợp để chơi custom với bạn bè.',
  },
  {
    slug: 'dau-bai-tuong',
    name: 'Đấu bài tướng',
    emoji: '🃏',
    tagline: 'Rút bài tướng, so chỉ số, hạ máy',
    players: '1 người vs máy · thách đấu bạn bè',
    description:
      'Game thẻ bài chiến thuật với các tướng Liên Quân: chọn lá bài và chỉ số Công, Thủ, Tốc hoặc Phép để hạ máy qua 5 hiệp. Gửi link để bạn bè chơi cùng bộ bài và so điểm.',
  },
];

export interface RolePage {
  role: Hero['role'];
  slug: string;
  label: string;
  emoji: string;
  intro: string;
  tips: string;
}

export const ROLE_PAGES: RolePage[] = [
  {
    role: 'Warrior',
    slug: 'dau-si',
    label: 'Đấu sĩ',
    emoji: '⚔️',
    intro:
      'Đấu sĩ là nhóm tướng vừa gây sát thương vừa chống chịu tốt, thường đi đường trên (Caesar) hoặc đi rừng. Đây là vị trí gánh giao tranh tổng và đẩy lẻ.',
    tips: 'Ưu tiên lên đồ cân bằng công thủ, nắm thời điểm lao vào giao tranh sau khi trợ thủ mở combat.',
  },
  {
    role: 'Assassin',
    slug: 'sat-thu',
    label: 'Sát thủ',
    emoji: '🗡️',
    intro:
      'Sát thủ có khả năng cơ động và dồn sát thương cực mạnh, chuyên đi rừng để bắt lẻ xạ thủ và pháp sư đối phương.',
    tips: 'Kiểm soát rừng, núp bụi chờ thời cơ và vào sau khi đối thủ dùng chiêu khống chế để hạ mục tiêu nhanh nhất.',
  },
  {
    role: 'Mage',
    slug: 'phap-su',
    label: 'Pháp sư',
    emoji: '🔮',
    intro:
      'Pháp sư gây sát thương phép diện rộng hoặc dồn đơn mục tiêu, thường đi đường giữa và hỗ trợ hai bên đường bằng khả năng dọn lính nhanh.',
    tips: 'Giữ khoảng cách an toàn, ném chiêu theo hướng đi của địch và luôn hỗ trợ đường rồng/tà thần.',
  },
  {
    role: 'Marksman',
    slug: 'xa-thu',
    label: 'Xạ thủ',
    emoji: '🏹',
    intro:
      'Xạ thủ là nguồn sát thương vật lý liên tục chủ lực ở cuối trận, đi đường rồng (AD) cùng trợ thủ.',
    tips: 'Farm đủ tiền, đứng sau tuyến đầu và đánh mục tiêu gần nhất an toàn thay vì lao lên trước.',
  },
  {
    role: 'Tank',
    slug: 'do-don',
    label: 'Đỡ đòn',
    emoji: '🛡️',
    intro:
      'Tướng đỡ đòn có lượng máu và giáp lớn, nhiều hiệu ứng khống chế, đứng tuyến đầu bảo kê đồng đội và mở giao tranh.',
    tips: 'Lên đồ phòng thủ theo đội hình địch, đi trước mở combat và hấp thụ sát thương cho xạ thủ, pháp sư.',
  },
  {
    role: 'Support',
    slug: 'tro-thu',
    label: 'Trợ thủ',
    emoji: '💊',
    intro:
      'Trợ thủ hồi máu, tạo lá chắn hoặc khống chế để hỗ trợ đồng đội, thường đi cùng xạ thủ đường rồng và roam khắp bản đồ.',
    tips: 'Dò bụi cỏ mở tầm nhìn, theo sát xạ thủ đầu trận rồi roam hỗ trợ đường giữa và rừng khi có cơ hội.',
  },
];

export function rolePageFor(role: string): RolePage | undefined {
  return ROLE_PAGES.find(page => page.role === role);
}

export const TIER_LABELS: Record<Hero['tier'], string> = {
  S: '🔥 S - Ưu tiên ban/pick',
  A: '⭐ A - Mạnh để leo rank',
  B: '✅ B - Ổn định',
  C: '⬇️ C - Tình huống',
};

export interface LaneDef {
  key: string;
  label: string;
  match: (h: Hero) => boolean;
}

export const TEAM_LANES: LaneDef[] = [
  { key: 'Top', label: 'Đường trên', match: (h: Hero) => h.lane === 'Top' || h.role === 'Warrior' || h.role === 'Tank' },
  { key: 'Jungle', label: 'Đi rừng', match: (h: Hero) => h.lane === 'Jungle' || h.secondaryRole === 'Jungle' || h.role === 'Assassin' },
  { key: 'Mid', label: 'Đường giữa', match: (h: Hero) => h.lane === 'Mid' || h.role === 'Mage' },
  { key: 'AD', label: 'Xạ thủ', match: (h: Hero) => h.lane === 'AD' || h.role === 'Marksman' },
  { key: 'Support', label: 'Trợ thủ', match: (h: Hero) => h.lane === 'Support' || h.role === 'Support' || h.role === 'Tank' },
];
