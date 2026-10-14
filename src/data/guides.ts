// Original guide articles (Cẩm nang). Inline links use [text](/path) syntax.
import type { Hero } from './heroes';

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
  /** Renders hero chips from data, e.g. easy heroes of one role. */
  heroes?: { role?: Hero['role']; difficulty?: Hero['difficulty']; limit?: number };
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  published: string;
  updated: string;
  keywords: string;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'tuong-de-choi-cho-nguoi-moi',
    title: 'Tướng dễ chơi cho người mới Liên Quân Mobile 2026 (theo từng vai trò)',
    description:
      'Danh sách tướng dễ chơi cho người mới chơi Liên Quân Mobile 2026, chia theo Đấu sĩ, Sát thủ, Pháp sư, Xạ thủ, Đỡ đòn, Trợ thủ kèm cách luyện tập hiệu quả.',
    excerpt: 'Mới chơi nên cầm tướng nào? Gợi ý theo từng vai trò và lộ trình luyện tập 2 tuần.',
    published: '2026-10-14',
    updated: '2026-10-14',
    keywords: 'tướng dễ chơi liên quân, tướng cho người mới liên quân, liên quân cho người mới, tướng dễ leo rank',
    sections: [
      {
        id: 'vi-sao',
        heading: 'Vì sao người mới nên bắt đầu với tướng dễ?',
        paragraphs: [
          'Liên Quân Mobile có hơn trăm tướng, mỗi tướng một bộ chiêu và cách vận hành riêng. Người mới thường mắc lỗi chọn tướng “trông ngầu” nhưng combo phức tạp, dẫn đến thua liên tục và nản. Tướng dễ chơi có chiêu thức trực quan, ít phụ thuộc vào thao tác nhanh, giúp bạn tập trung học những thứ quan trọng hơn: đọc bản đồ, đứng vị trí, biết lúc nào nên đánh và lúc nào nên lùi.',
          'Danh sách dưới đây lấy từ dữ liệu độ khó tham khảo của RandomTuong.vn (mức ★ – dễ). Bấm vào từng tướng để xem bộ kỹ năng đầy đủ.',
        ],
      },
      { id: 'dau-si', heading: 'Đấu sĩ dễ chơi', heroes: { role: 'Warrior', difficulty: 1, limit: 8 }, paragraphs: ['Đấu sĩ chịu đòn tốt, sát thương ổn định nên rất “dễ thở” khi mới tập đường Caesar hoặc đi rừng. Hãy tập giữ lính, đánh đổi máu có lợi và chỉ lao vào giao tranh khi đồng đội đã ở gần.'] },
      { id: 'sat-thu', heading: 'Sát thủ dễ chơi', heroes: { role: 'Assassin', difficulty: 1, limit: 8 }, paragraphs: ['Sát thủ đòi hỏi chọn thời điểm vào trận chuẩn. Với người mới, ưu tiên tướng có chiêu tiếp cận đơn giản và tập dọn rừng thật nhanh trước khi nghĩ đến việc đi gank.'] },
      { id: 'phap-su', heading: 'Pháp sư dễ chơi', heroes: { role: 'Mage', difficulty: 1, limit: 8 }, paragraphs: ['Pháp sư dễ dùng thường có chiêu diện rộng, ném trúng không quá khó. Tập dọn lính nhanh rồi di chuyển hỗ trợ hai đường bên cạnh.'] },
      { id: 'xa-thu', heading: 'Xạ thủ dễ chơi', heroes: { role: 'Marksman', difficulty: 1, limit: 8 }, paragraphs: ['Xạ thủ là vị trí cần farm và đứng vị trí an toàn. Mục tiêu đầu tiên: ăn lính đều tay và không chết vô ích ở đầu trận.'] },
      { id: 'do-don', heading: 'Đỡ đòn dễ chơi', heroes: { role: 'Tank', difficulty: 1, limit: 8 }, paragraphs: ['Đỡ đòn tha thứ cho sai lầm nhiều nhất vì lượng máu lớn. Đây là lựa chọn tuyệt vời để học cách mở giao tranh và bảo vệ đồng đội.'] },
      { id: 'tro-thu', heading: 'Trợ thủ dễ chơi', heroes: { role: 'Support', difficulty: 1, limit: 8 }, paragraphs: ['Trợ thủ giúp bạn quan sát cả trận đấu từ góc nhìn rộng nhất — cách nhanh nhất để hiểu game vận hành thế nào.'] },
      {
        id: 'lo-trinh',
        heading: 'Lộ trình luyện tập 2 tuần cho người mới',
        ordered: true,
        list: [
          'Tuần 1: chọn 1 vai trò chính và 2 tướng dễ của vai trò đó, chơi chế độ đấu thường để quen bản đồ.',
          'Mỗi trận tự đặt 1 mục tiêu nhỏ: ít chết hơn trận trước, hoặc ăn lính nhiều hơn.',
          'Tuần 2: thêm 1 vai trò phụ (thường là Đỡ đòn hoặc Trợ thủ vì đội hay thiếu) để linh hoạt khi xếp hạng.',
          'Xem lại trận thua: bạn chết vì đứng sai chỗ, đuổi quá sâu hay bị bắt lẻ?',
          'Khi đã quen, thử [Vòng quay thử thách](/mini-game/thu-thach-random/) để ép bản thân chơi tướng mới.',
        ],
      },
      {
        id: 'random',
        heading: 'Mẹo: dùng random để khám phá tướng hợp tay',
        paragraphs: [
          'Không biết bắt đầu từ đâu? Vào [trang Random](/?role=all), chọn độ khó ★ Dễ và vai trò bạn thích, bấm Random vài lần rồi chơi thử tướng được chọn trong chế độ luyện tập. Sau khoảng 10 tướng bạn sẽ biết mình hợp phong cách nào.',
        ],
      },
    ],
  },
  {
    slug: 'vi-tri-trong-lien-quan',
    title: '5 vị trí trong Liên Quân Mobile: nhiệm vụ của Caesar, Rừng, Mid, Rồng và Trợ thủ',
    description:
      'Giải thích 5 vị trí trong Liên Quân Mobile: đường Caesar, đi rừng, đường giữa, đường Rồng (xạ thủ) và trợ thủ — nhiệm vụ, tướng phù hợp và lỗi thường gặp.',
    excerpt: 'Mỗi vị trí làm gì trong trận? Hiểu đúng vai trò để không “cướp lane” và thắng nhiều hơn.',
    published: '2026-10-14',
    updated: '2026-10-14',
    keywords: 'vị trí trong liên quân, các đường trong liên quân, đường caesar, đường rồng, đi rừng liên quân',
    sections: [
      {
        id: 'tong-quan',
        heading: 'Tổng quan bản đồ',
        paragraphs: [
          'Một đội Liên Quân có 5 người, thường chia thành 5 vị trí: đường Caesar (đường trên), đi rừng, đường giữa, đường Rồng (xạ thủ) và trợ thủ. Việc chia vị trí giúp cả đội nhận đủ vàng, kinh nghiệm và có mặt ở đúng nơi khi giao tranh nổ ra.',
          'Ở chế độ xếp hạng, hãy thống nhất vị trí ngay từ lúc chọn tướng. Hai người cùng đi một đường là cách nhanh nhất để thua cả trận.',
        ],
      },
      {
        id: 'caesar',
        heading: 'Đường Caesar (đường trên)',
        paragraphs: [
          'Thường do Đấu sĩ hoặc Đỡ đòn đảm nhận. Nhiệm vụ: giữ đường, đánh đổi máu có lợi, đẩy lẻ khi đội đang an toàn và có mặt khi đội tranh Caesar. Vị trí này cần sự kiên nhẫn vì thường phải đối đầu 1 đấu 1 khá lâu.',
        ],
        heroes: { role: 'Warrior', limit: 6 },
      },
      {
        id: 'rung',
        heading: 'Đi rừng',
        paragraphs: [
          'Người đi rừng dọn quái, lấy bùa và tạo lợi thế cho các đường bằng những pha gank. Bạn là người quyết định nhịp trận: khi nào tranh mục tiêu lớn, khi nào hỗ trợ đường nào. Nên mang phép bổ trợ Trừng trị để dọn quái nhanh và giành mục tiêu.',
          'Lỗi thường gặp: dọn rừng chậm, gank khi đường đó không có lợi thế, hoặc bỏ mặc đồng đội khi đối thủ xâm lấn rừng.',
        ],
        heroes: { role: 'Assassin', limit: 6 },
      },
      {
        id: 'mid',
        heading: 'Đường giữa',
        paragraphs: [
          'Thường là Pháp sư. Đường giữa ngắn nhất nên bạn dọn lính nhanh rồi di chuyển hỗ trợ hai bên. Pháp sư tốt là người xuất hiện đúng lúc ở mọi giao tranh, không phải người đứng farm một chỗ cả trận.',
        ],
        heroes: { role: 'Mage', limit: 6 },
      },
      {
        id: 'rong',
        heading: 'Đường Rồng (xạ thủ)',
        paragraphs: [
          'Xạ thủ là nguồn sát thương chính về cuối trận. Ưu tiên số 1 là ăn lính đều và sống sót. Trong giao tranh, đứng sau tuyến đầu và đánh mục tiêu gần nhất có thể với tới an toàn, đừng cố lao vào tìm pháp sư địch.',
        ],
        heroes: { role: 'Marksman', limit: 6 },
      },
      {
        id: 'tro-thu',
        heading: 'Trợ thủ',
        paragraphs: [
          'Trợ thủ (Đỡ đòn hoặc tướng hồi máu, khống chế) bảo kê xạ thủ đầu trận, sau đó di chuyển khắp bản đồ để mở tầm nhìn qua bụi cỏ, hỗ trợ rừng và mở giao tranh. Vị trí này ít vàng nhưng ảnh hưởng cực lớn đến kết quả trận đấu.',
        ],
        heroes: { role: 'Support', limit: 6 },
      },
      {
        id: 'chia-vi-tri',
        heading: 'Chia vị trí nhanh khi chơi với bạn bè',
        paragraphs: [
          'Cả nhóm cãi nhau ai đi rừng? Dùng [Chia team với bạn bè](/mini-game/chia-team/): nhập tên, công cụ tự chia đội, gán vị trí và random tướng phù hợp vị trí cho từng người.',
        ],
      },
    ],
  },
  {
    slug: 'cach-ban-pick-lien-quan',
    title: 'Cách ban/pick Liên Quân hiệu quả: cấm ai, chọn gì, khi nào counter',
    description:
      'Hướng dẫn ban/pick Liên Quân Mobile: nguyên tắc cấm tướng, thứ tự chọn, cách cân bằng đội hình sát thương vật lý/phép, tuyến đầu và khống chế, mẹo counter pick.',
    excerpt: 'Nguyên tắc cấm tướng, thứ tự chọn và cách dựng đội hình cân bằng trước khi vào trận.',
    published: '2026-10-14',
    updated: '2026-10-14',
    keywords: 'ban pick liên quân, cách ban pick liên quân, cấm tướng liên quân, đội hình liên quân, counter pick',
    sections: [
      {
        id: 'ban',
        heading: 'Nguyên tắc cấm tướng',
        list: [
          'Cấm tướng đang quá mạnh trong phiên bản (xem [tier list](/tier-list-lien-quan/) để tham khảo).',
          'Cấm tướng khắc chế trực tiếp tướng tủ của đội bạn.',
          'Cấm tướng mà đối thủ nổi tiếng chơi giỏi, nếu bạn biết đối thủ (giải đấu, đấu custom).',
          'Đừng phí lượt cấm vào tướng chỉ khó chịu với riêng bạn nhưng ít ảnh hưởng đến cả trận.',
        ],
      },
      {
        id: 'thu-tu',
        heading: 'Thứ tự chọn tướng hợp lý',
        paragraphs: [
          'Lượt chọn đầu nên dành cho tướng mạnh và linh hoạt, khó bị khắc chế, hoặc tướng có thể đi nhiều vị trí để giấu bài. Những lượt cuối là cơ hội counter pick: chọn tướng khắc chế trực tiếp đối thủ cùng đường đã lộ diện.',
          'Vị trí dễ bị khắc chế (thường là đường Caesar và đường giữa) nên chọn muộn nếu có thể. Trợ thủ và đỡ đòn ít bị counter nên có thể chọn sớm.',
        ],
      },
      {
        id: 'doi-hinh',
        heading: 'Checklist đội hình cân bằng',
        list: [
          'Có ít nhất 1 tuyến đầu đủ trâu để đỡ đòn và mở giao tranh.',
          'Sát thương cân bằng giữa vật lý và phép để đối thủ không thể chỉ lên một loại giáp.',
          'Có khống chế (choáng, hất tung, làm chậm) để bắt mục tiêu hoặc ngăn đối phương lao vào.',
          'Có nguồn sát thương cuối trận (thường là xạ thủ) nếu trận đấu kéo dài.',
          'Có khả năng dọn lính/đẩy trụ để tận dụng lợi thế khi thắng giao tranh.',
        ],
      },
      {
        id: 'luyen-tap',
        heading: 'Luyện ban/pick không cần vào trận',
        paragraphs: [
          'Bạn có thể chạy thử trình tự 6 lượt cấm và 10 lượt chọn bằng [Ban/Pick ngẫu nhiên](/?tab=banpick), sau đó tự hỏi: đội nào có đội hình tốt hơn, thiếu gì, nếu được chọn lại sẽ đổi tướng nào? Đây là bài tập rất tốt để rèn tư duy đội hình.',
        ],
      },
    ],
  },
  {
    slug: 'meo-leo-rank-lien-quan',
    title: '12 mẹo leo rank Liên Quân Mobile cho người chơi đơn',
    description:
      '12 mẹo leo rank Liên Quân Mobile thực tế cho người chơi đơn: chọn tướng tủ, quản lý tâm lý, đọc bản đồ, ưu tiên mục tiêu và tránh những lỗi khiến bạn thua.',
    excerpt: 'Tâm lý, tướng tủ, đọc bản đồ và mục tiêu — những thói quen nhỏ giúp bạn thắng đều hơn.',
    published: '2026-10-14',
    updated: '2026-10-14',
    keywords: 'mẹo leo rank liên quân, cách leo rank liên quân, leo rank liên quân một mình, kinh nghiệm leo rank',
    sections: [
      {
        id: 'tuong',
        heading: 'Chuẩn bị trước khi vào trận',
        ordered: true,
        list: [
          'Có 2–3 tướng tủ cho vị trí chính và 1–2 tướng cho vị trí phụ. Đừng tập tướng mới trong rank.',
          'Luôn có một tướng đỡ đòn hoặc trợ thủ dùng được — đội thường thiếu vị trí này nhất.',
          'Chơi khi tỉnh táo. Thua 2 trận liên tiếp thì nghỉ một lúc thay vì cố gỡ.',
        ],
      },
      {
        id: 'trong-tran',
        heading: 'Trong trận đấu',
        ordered: true,
        list: [
          'Liếc bản đồ nhỏ sau mỗi đợt lính. Đường bên cạnh biến mất đối thủ? Lùi về an toàn.',
          'Ăn lính là nguồn vàng ổn định nhất — đừng bỏ đợt lính để đuổi theo một mạng không chắc.',
          'Không đuổi quá sâu vào trụ hay rừng địch khi không thấy hết đối thủ.',
          'Sau khi thắng giao tranh, chuyển lợi thế thành mục tiêu: trụ, Caesar, Rồng — đừng chỉ đứng hồi máu.',
          'Theo đồng đội vào giao tranh tổng; một người đẩy lẻ khi cả đội đang đánh 4 đấu 5 thường dẫn tới thua.',
          'Khi đang thua, phòng thủ dưới trụ và chờ đối thủ mắc lỗi, đừng giao tranh khi thiếu người.',
        ],
      },
      {
        id: 'tam-ly',
        heading: 'Tâm lý — kỹ năng bị đánh giá thấp nhất',
        ordered: true,
        list: [
          'Tắt chat hoặc chỉ dùng tín hiệu nhanh khi trận đấu căng thẳng.',
          'Không đổ lỗi; một câu khích lệ đơn giản giúp đội phối hợp tốt hơn rất nhiều.',
          'Đánh giá sau trận bằng câu hỏi “mình có thể làm gì tốt hơn?” thay vì “đồng đội tệ quá”.',
        ],
      },
      {
        id: 'giai-tri',
        heading: 'Giải trí để không “burn out”',
        paragraphs: [
          'Leo rank liên tục rất dễ mệt. Thỉnh thoảng hãy rủ bạn bè đánh custom với [luật chơi vui](/huong-dan/luat-choi-custom-voi-ban-be/) hoặc thử sức với [Đoán tướng](/mini-game/doan-tuong/) để đổi gió.',
        ],
      },
    ],
  },
  {
    slug: 'luat-choi-custom-voi-ban-be',
    title: '10 luật chơi custom Liên Quân cực vui với bạn bè',
    description:
      'Gợi ý 10 luật chơi custom Liên Quân Mobile vui nhộn cho nhóm bạn: toàn tướng ngẫu nhiên, 1v1 đường giữa, thử thách build đồ, giải đấu nội bộ và cách chia đội công bằng.',
    excerpt: 'Chán rank? Thử 10 thể thức custom từ 1v1 đường giữa đến giải đấu nội bộ cho cả hội.',
    published: '2026-10-14',
    updated: '2026-10-14',
    keywords: 'custom liên quân, luật chơi custom liên quân, chơi liên quân với bạn bè, phòng tùy chỉnh liên quân',
    sections: [
      {
        id: 'chuan-bi',
        heading: 'Chuẩn bị phòng custom',
        paragraphs: [
          'Tạo phòng tùy chỉnh trong Liên Quân, mời bạn bè vào và chốt luật trước khi bắt đầu. Để chia đội nhanh và không ai kêu “team kia mạnh hơn”, dùng [Chia team với bạn bè](/mini-game/chia-team/) rồi gửi link kết quả vào nhóm chat.',
        ],
      },
      {
        id: 'luat',
        heading: '10 thể thức nên thử',
        ordered: true,
        list: [
          'Toàn tướng ngẫu nhiên: mỗi người [random tướng](/) và bắt buộc chơi tướng đó.',
          '1v1 đường giữa: ai hạ trụ đầu tiên hoặc hạ đối thủ 2 lần trước là thắng.',
          'Vòng quay thử thách: mỗi người nhận tướng + luật oái oăm từ [Vòng quay thử thách](/mini-game/thu-thach-random/).',
          'Một vai trò: cả đội chỉ được chọn Xạ thủ (hoặc toàn Pháp sư, toàn Đỡ đòn).',
          'Không phép bổ trợ: tắt hết phép bổ trợ để thử kỹ năng thuần.',
          'Giải đấu nội bộ: 4 người đấu loại trực tiếp 1v1, người thắng được chọn tướng trước ở trận 5v5.',
          'Đổi vị trí: ai đi rừng bình thường phải đi trợ thủ và ngược lại.',
          'Tướng của người thua: đội thua trận trước được cấm 3 tướng của đội thắng ở trận sau.',
          'Ban/Pick ngẫu nhiên: chạy [Ban/Pick](/?tab=banpick) trên web và chơi đúng đội hình được bốc.',
          'Kèo đoán tướng: trước trận cả nhóm chơi [Đoán tướng](/mini-game/doan-tuong/) cùng bộ câu hỏi, người điểm cao nhất được chọn đội.',
        ],
      },
      {
        id: 'luu-y',
        heading: 'Lưu ý để cuộc chơi luôn vui',
        list: [
          'Chốt luật rõ ràng trước trận, ai vi phạm chịu phạt nhẹ nhàng (chọn tướng sau, làm trợ thủ trận tới…).',
          'Xoay vòng thể thức để người giỏi và người mới đều có cơ hội thắng.',
          'Ghi lại kết quả các trận để cuối buổi có “nhà vô địch”.',
        ],
      },
    ],
  },
  {
    slug: 'cach-dung-random-tuong',
    title: 'Cách dùng RandomTuong.vn: random tướng, chia đội 5v5, ban/pick và chia sẻ kết quả',
    description:
      'Hướng dẫn sử dụng RandomTuong.vn: random tướng Liên Quân theo vai trò và độ khó, random đội 5v5, mô phỏng ban/pick, mini game và cách gửi link kết quả cho bạn bè.',
    excerpt: 'Hướng dẫn từng công cụ trên RandomTuong.vn và cách gửi kết quả cho cả nhóm.',
    published: '2026-10-14',
    updated: '2026-10-14',
    keywords: 'cách random tướng liên quân, hướng dẫn random tướng, random tướng liên quân như thế nào, random đội 5v5',
    sections: [
      {
        id: 'random',
        heading: 'Random tướng theo bộ lọc',
        ordered: true,
        list: [
          'Mở [trang chủ](/), tab 🎲 Random.',
          'Chọn vai trò (Đấu sĩ, Sát thủ, Pháp sư, Xạ thủ, Đỡ đòn, Trợ thủ hoặc Đi rừng) và độ khó.',
          'Bấm Random tướng. Không ưng? Bấm Random tiếp để quay tướng khác (không trùng tướng vừa ra).',
          'Bấm Xem chi tiết để đọc bộ kỹ năng, hoặc Chia sẻ để khoe kết quả.',
        ],
      },
      {
        id: '5v5',
        heading: 'Random đội 5v5',
        paragraphs: [
          'Tab 👥 5v5 tạo hai đội, mỗi đội đủ 5 vị trí: đường trên, đi rừng, đường giữa, xạ thủ, trợ thủ, không trùng tướng giữa hai đội. Muốn gán đội cho từng người bạn cụ thể, dùng [Chia team với bạn bè](/mini-game/chia-team/).',
        ],
      },
      {
        id: 'banpick',
        heading: 'Mô phỏng ban/pick',
        paragraphs: [
          'Tab 🛡️ Ban/Pick chạy trình tự 6 lượt cấm rồi 10 lượt chọn xen kẽ giữa hai đội. Mỗi lần bấm, công cụ bốc ngẫu nhiên một tướng chưa bị cấm hoặc chọn. Đọc thêm [cách ban/pick hiệu quả](/huong-dan/cach-ban-pick-lien-quan/).',
        ],
      },
      {
        id: 'chia-se',
        heading: 'Gửi link để bạn bè thấy cùng kết quả',
        paragraphs: [
          'Các mini game Đoán tướng, Chia team, Vòng quay thử thách và Đấu bài tướng đều lưu kết quả trong đường link. Khi bạn bấm nút chia sẻ, bạn bè mở link sẽ nhận đúng bộ câu hỏi, đúng đội hình hoặc đúng bộ bài như bạn — không cần tài khoản.',
        ],
      },
      {
        id: 'app',
        heading: 'Thêm vào màn hình chính như một app',
        paragraphs: [
          'Trên điện thoại, mở RandomTuong.vn bằng trình duyệt và chọn “Thêm vào màn hình chính”. Lần sau bạn mở trang nhanh như một ứng dụng, kèm lối tắt tới Đoán tướng và Chia team.',
        ],
      },
    ],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find(guide => guide.slug === slug);
}
