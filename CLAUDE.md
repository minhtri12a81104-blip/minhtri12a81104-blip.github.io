# Project Context: tinhnhadat.com

## Overview
Web application for calculating real estate transfer taxes, registration fees, and notary fees in Vietnam (Luật Đất Đai 2024/2026, Nghị định 10/2022/NĐ-CP, Thông tư 257/2016/TT-BTC).

- Live Domain: https://tinhnhadat.com
- GitHub Repo: https://github.com/minhtri12a81104-blip/minhtri12a81104-blip.github.io.git (Branch: main)
- Host: GitHub Pages with custom domain and Fastly CDN.

## Tech Stack
- Frontend: Vanilla HTML5, Tailwind CSS (CDN), Custom CSS (`assets/css/style.css`), Plain JavaScript (ES6+).
- Calculation Engine: `assets/js/calculator.js` exposing `window.NhaDatCalc`.
- Assets: SVG vectors (`assets/images/logo.svg`, `favicon.svg`).
- No build step required (Static HTML/CSS/JS).

## Key Files & Pages
- `index.html`: Main calculator for buying/selling real estate (Thuế TNCN 2%, Lệ phí trước bạ 0.5%, Phí công chứng bậc thang, Lệ phí cấp sổ).
- `tang-cho-thua-ke.html`: Calculator for gifting & inheritance (Tặng cho / thừa kế). Automatically evaluates 100% tax exemption for direct relatives.
- `assets/js/calculator.js`: Tax & fee calculations, currency parsing/formatting, number-to-words converter in Vietnamese.
- `assets/css/style.css`: Modern FinTech styling, custom scrollbars, print stylesheet, and Mobile UX touch optimization.
- Static Pages: `gioi-thieu.html`, `lien-he.html`, `chinh-sach-bao-mat.html`, `dieu-khoan-su-dung.html`.

## Monetization Rules (Strict Constraints)
- **DO NOT** add Google AdSense (User explicitly declined AdSense).
- **Monetag Active Tags**:
  - Push Notification: Zone `11965876` (script right after `<head>`, worker file `sw.js` at root).
  - In-Page Push Banner: Zone `11965357` (before `</body>`).
  - Verification meta: `<meta name="monetag" content="6f32866cf2fe2a20a234009ae66d9ea8">`.
- **Affiliate FinTech**:
  - Card 1 (MB Bank): Referral link `https://mbbank.onelink.me/QPF5?pid=SF%20Email%20Warmup&c=SF_Email_WarmUP_AppInstall&af_force_deeplink=true&af_dp=mbbank%3A%2F%2F&referral_code=6T8XQDA6RJSI8DWEM9OKL`.
  - Card 2 (VPBank): Accesstrade loan link `https://shorten.asia/kRQJVNfk`.
  - Card 3: Interactive loan payment calculator (`calculateQuickLoan`).

## Mobile UX Features
- `inputmode="numeric"` and `pattern="[0-9,.]*"` for instant mobile number keypad.
- Mobile sticky bottom result bar (`#mobileStickyBar` with `#stickyTotalMobile`).
- Mobile hamburger navigation drawer (`#mobileNavMenu` toggled by `toggleMobileNav()`).
- Native mobile sharing via `navigator.share` (fallback to clipboard toast).
- Font-size >= 16px on inputs to prevent iOS Safari auto-zoom.
