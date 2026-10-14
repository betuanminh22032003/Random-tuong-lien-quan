// Monetization & contact settings. Leave a value empty to keep that feature off:
// with no adsenseClient, ad slots render nothing (no placeholder boxes).
export const APP_CONFIG = {
  gaMeasurementId: '', // GA4: G-XXXXXXXXXX
  adsenseClient: '', // AdSense: ca-pub-XXXXXXXXXXXXXXXX (also generates /ads.txt on build)
  // Mã đơn vị quảng cáo (số) tạo trong AdSense → Quảng cáo → Theo đơn vị. Để trống = chỉ dùng Auto ads.
  adSlots: { top: '', mid: '' } as Record<'top' | 'mid', string>,
  contactEmail: '', // Email hiển thị ở trang Liên hệ
  feedbackUrl: 'https://github.com/betuanminh22032003/Random-tuong-lien-quan/issues',
};
