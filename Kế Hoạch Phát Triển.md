# 🎮 Kế Hoạch Phát Triển — RandomTuong.vn
**Mục tiêu:** Live trong 3–5 ngày | Chi phí: $0 (hoàn toàn miễn phí)

---

## 📋 TỔNG QUAN SẢN PHẨM

| Hạng mục | Chi tiết |
|---|---|
| Loại sản phẩm | Static Web App (Next.js 14 SSG) |
| Ngôn ngữ | Tiếng Việt |
| Target user | Game thủ Liên Quân Mobile VN |
| Mô hình kiếm tiền | Google AdSense |
| Stack kỹ thuật | **Next.js 14** + TypeScript + Pages Router + Static Export (`output: 'export'`) |
| Hosting | Netlify (Free tier) |
| Domain | Netlify subdomain miễn phí (.netlify.app) → sau nâng lên domain riêng |

---

## 🗓️ LỘ TRÌNH 5 NGÀY

### **Ngày 1 — Chuẩn bị & Setup (2–3 giờ)**

#### Việc cần làm:
- [ ] Tạo tài khoản **GitHub** (github.com) — miễn phí
- [ ] Tạo tài khoản **Netlify** (netlify.com) — miễn phí
- [ ] Tạo repo GitHub tên `random-tuong-lien-quan`
- [ ] Upload file `index.html` lên repo
- [ ] Connect Netlify với GitHub repo → Auto deploy

#### Kết quả ngày 1:
✅ Website live tại `random-tuong-lien-quan.netlify.app`

#### Hướng dẫn deploy Netlify (5 bước):
```
1. Đăng nhập netlify.com → "Add new site"
2. Chọn "Import from Git" → kết nối GitHub
3. Chọn repo → Build settings để trống (static site)
4. Nhấn "Deploy site"
5. Đổi site name thành "randomtuong" trong Settings
```

---

### **Ngày 2 — Hoàn thiện nội dung & data (3–4 giờ) (crawl data thật)**

#### Việc cần làm:
- [x] **Bổ sung danh sách tướng** — hiện tại có ~60 tướng, cần thêm đủ ~100+ tướng mới nhất. 
- [x] **Cập nhật bảng Meta** — tra cứu meta mùa hiện tại (Reddit/YouTube LQ)
- [x] **Thêm thông tin tướng**: winrate %, vai trò phụ, độ khó (1-3 sao)
- [x] **Thêm filter Độ khó** bên cạnh filter Role
- [ ] **Kiểm tra mobile UX** trên điện thoại thật

#### File cấu trúc data nên tách riêng:
```javascript
// heroes-data.js (tách riêng để dễ update)
const HEROES = [
  {
    name: "Florentino",
    role: "Warrior",
    emoji: "🌹",
    difficulty: 2,        // 1=Dễ, 2=Trung bình, 3=Khó
    winrate: 53.2,        // %
    tier: "S"
  },
  // ...
];
```

---

### **Ngày 3 — SEO & Google Analytics (2–3 giờ)**

#### SEO On-page (đã có cơ bản, cần bổ sung):
- [x] Thêm **Schema markup** (WebApplication type)
- [x] Tạo file **sitemap.xml**
- [x] Tạo file **robots.txt**
- [x] Thêm **Open Graph image** (1200x630px) để share đẹp trên Facebook/Zalo
- [ ] Đăng ký **Google Search Console** → submit sitemap

#### Tạo sitemap.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://randomtuong.netlify.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

#### Tạo robots.txt:
```
User-agent: *
Allow: /
Sitemap: https://randomtuong.netlify.app/sitemap.xml
```

#### Google Analytics 4 (GA4) — miễn phí:
```
1. analytics.google.com → Tạo property
2. Lấy Measurement ID (G-XXXXXXXXXX)
3. Thêm script vào <head> của index.html
```

---

### **Ngày 4 — Google AdSense (1–2 giờ setup, 2–4 tuần duyệt)**

#### Yêu cầu để được duyệt AdSense:
- ✅ Website có nội dung gốc, hữu ích
- ✅ Có Privacy Policy page
- ✅ Không vi phạm bản quyền
- ⚠️ Cần có lưu lượng truy cập cơ bản

#### Các bước:
- [x] Tạo trang **Privacy Policy** (dùng generator miễn phí: privacypolicygenerator.info)
- [x] Thêm link Privacy Policy vào footer
- [ ] Đăng ký **Google AdSense** (adsense.google.com)
- [ ] Dán code AdSense vào `<head>`
- [ ] Thay placeholder quảng cáo bằng code AdSense thật

#### Vị trí quảng cáo trong code hiện tại:
```
📍 Top banner (728x90)     → .ad-top
📍 Mid banner (320x100)    → .ad-mid  
📍 Footer area             → footer
```

> ⏳ **Lưu ý:** AdSense cần 2–4 tuần để Google review. Trong thời gian chờ, tập trung SEO và traffic.

---

### **Ngày 5 — Test, Fix & Chia sẻ (2–3 giờ)**

#### Checklist trước khi "launch":
- [ ] Test trên **iPhone Safari** và **Android Chrome**
- [ ] Test tốc độ tại **PageSpeed Insights** (pagespeed.web.dev) — mục tiêu >90 điểm
- [ ] Kiểm tra **không có lỗi console** (F12 → Console)
- [x] Thêm **favicon** (icon tab trình duyệt)
- [x] Thêm **manifest.json** để có thể Add to Home Screen

#### Kênh chia sẻ để có traffic đầu tiên (miễn phí):
```
📱 Facebook Groups Liên Quân VN (tìm "Liên Quân Mobile Vietnam")
💬 Reddit r/lienquan
🎮 Discord server Liên Quân
📺 Comment YouTube video Liên Quân
🐦 TikTok — quay video dùng tool + link bio
```

---

## 🏗️ KIẾN TRÚC FILE PROJECT (V2 — Next.js 14)

```
random-tuong-lien-quan/
├── src/
│   ├── data/
│   │   └── heroes.ts          ← 126 tướng + interface + slugify()
│   ├── pages/
│   │   ├── _app.tsx           ← Theme toggle (dark/light)
│   │   ├── _document.tsx      ← HTML shell
│   │   ├── index.tsx          ← Main tool (Random/5v5/BanPick/Meta)
│   │   ├── privacy-policy.tsx ← Privacy page
│   │   └── tuong/
│   │       └── [slug].tsx     ← 126 trang SSG tướng (SEO)
│   └── styles/
│       └── globals.css        ← CSS gốc + dark/light theme vars
├── public/                    ← Static assets
│   ├── favicon.ico / favicon.svg / icon-*.png / og-image.png
│   ├── manifest.json / robots.txt / sitemap.xml
├── next.config.js             ← output: 'export', trailingSlash: true
├── tsconfig.json
├── package.json               ← Next.js 14.2.5 + React 18 + TypeScript
├── netlify.toml               ← build: npm run build, publish: out
├── index.html                 ← File gốc (giữ lại để tham khảo)
└── heroes-data.js             ← File gốc (giữ lại để tham khảo)
```

---

## 💰 CHI PHÍ THỰC TẾ

| Dịch vụ | Chi phí | Giới hạn Free |
|---|---|---|
| GitHub | $0 | Unlimited public repos |
| Netlify | $0 | 100GB bandwidth/tháng, 300 build minutes |
| Google Analytics | $0 | Unlimited |
| Google AdSense | $0 | (kiếm tiền từ quảng cáo) |
| Google Search Console | $0 | Unlimited |
| Domain (.netlify.app) | $0 | Miễn phí mãi |

**Tổng chi phí: $0/tháng** ✅

> 💡 **Khi có thu nhập AdSense**, mua domain `.vn` (~200k–300k/năm) để SEO tốt hơn: `randomtuong.vn`

---

## 🚀 CÁC TÍNH NĂNG NÊN THÊM SAU (V2)

| Tính năng | Độ ưu tiên | Thời gian | Trạng thái |
|---|---|---|---|
| Lưu lịch sử random (localStorage) | Cao | 2 giờ | ✅ Hoàn thành |
| Nút "Random lại" (loại trừ tướng vừa ra) | Cao | 1 giờ | ✅ Hoàn thành |
| Filter theo Độ khó (1-3 sao) | Trung bình | 1 giờ | ✅ Hoàn thành |
| Dark/Light mode toggle | Thấp | 1 giờ | ✅ Hoàn thành |
| Chia sẻ kết quả lên Facebook | Trung bình | 2 giờ | ✅ Hoàn thành |
| Trang chi tiết tướng (SEO) 126+ trang SSG | Cao | 1 ngày | ✅ Hoàn thành |
| Tìm kiếm tướng theo tên | Trung bình | 1 giờ | ✅ Hoàn thành |
| **Migrate sang Next.js 14 + TypeScript** | Cao | - | ✅ Hoàn thành |
| So sánh 2 tướng | Thấp | 3 giờ | Chưa làm |

---

## 📊 KPI THEO DÕI (30 ngày đầu)

| Chỉ số | Mục tiêu |
|---|---|
| Lượt truy cập/ngày | 50–200 |
| Thời gian trên trang | >1 phút |
| Bounce rate | <70% |
| Indexed pages (Google) | 1–3 trang |
| AdSense approval | Trong 4 tuần |

---

## ⚡ TÓM TẮT HÀNH ĐỘNG NGAY

```
Ngày 1: GitHub → Netlify → LIVE  (ưu tiên nhất)
Ngày 2: Thêm data tướng đầy đủ
Ngày 3: SEO + Google Analytics
Ngày 4: Đăng ký AdSense + Privacy Policy
Ngày 5: Test + Chia sẻ cộng đồng game
```

**Stack học được qua dự án này:**
`Git/GitHub` → `CI/CD cơ bản (Netlify)` → `SEO kỹ thuật` → `Web Analytics` → `Ad monetization`

---

*Tài liệu này được tạo để hỗ trợ phát triển RandomTuong.vn — cập nhật khi có thay đổi*
