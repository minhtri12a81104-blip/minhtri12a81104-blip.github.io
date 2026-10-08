# Project Context: tinhnhadat.com

## Overview
Web application for calculating real estate transfer taxes, registration fees, and notary fees in Vietnam (Luật Đất Đai 2024/2026, Nghị định 10/2022/NĐ-CP, Thông tư 257/2016/TT-BTC).

- Live Domain: https://tinhnhadat.com
- GitHub Repo: https://github.com/minhtri12a81104-blip/minhtri12a81104-blip.github.io.git (Branch: main)
- Host: Vercel (auto-deploy on push to `main`; config in `vercel.json`). DNS at Spaceship: `@` A `216.198.79.1`, `www` CNAME → Vercel, www redirects to apex. Canonical host is `https://tinhnhadat.com` (no www). GitHub Pages no longer used.
- Contact emails `@tinhnhadat.com` have no MX record (cannot receive mail); contact form was removed.
- Config: `vercel.json` for Vercel deployment and caching.

## Tech Stack
- Frontend: Vanilla HTML5, Tailwind CSS v3 (prebuilt static file `assets/css/tailwind.css`, NOT the CDN), Custom CSS (`assets/css/style.css`, loaded BEFORE tailwind.css to match old CDN cascade), Plain JavaScript (ES6+).
- Calculation Engine: `assets/js/calculator.js` exposing `window.NhaDatCalc`.
- Assets: SVG vectors (`assets/images/logo.svg`, `favicon.svg`).
- Cache busting: every local CSS/JS link carries `?v=YYYYMMDDx` (e.g. `?v=20261008e`) because `/assets/*` is cached 1h by `vercel.json`. Whenever a file in `assets/` changes, bump this version in ALL `.html` pages, otherwise returning visitors keep the stale file.
- No build step for deploy (static files). After adding NEW Tailwind classes to HTML/JS, regenerate CSS and commit it: `npx tailwindcss@3 -i assets/css/tailwind.src.css -o assets/css/tailwind.css --minify` (config: `tailwind.config.js`).
- Tax law basis (verified 10/2026): Luật Thuế TNCN 109/2025/QH15 (hiệu lực 01/7/2026) + NĐ 253/2026/NĐ-CP: chuyển nhượng 2%; thừa kế/quà tặng 10% phần vượt 20 triệu (trước đây 10 triệu). Lệ phí trước bạ 0,5% (NĐ 10/2022, sửa đổi NĐ 175/2025, 51/2025). Phí công chứng TT 257/2016 + TT 111/2017.

## Key Files & Pages
- `index.html`: Main calculator for buying/selling real estate (Thuế TNCN 2%, Lệ phí trước bạ 0.5%, Phí công chứng bậc thang, Lệ phí cấp sổ). Optional "Tính theo bảng giá đất UBND" panel (diện tích × đơn giá × hệ số + giá nhà): tax/fees use max(contract price, state price). "Bên nào chịu thuế, phí" select (`theo_luat` = công chứng chia đôi, `ben_mua`, `ben_ban`) drives `chiPhiBenBan/chiPhiBenMua`, `benBanThucNhan`, `benMuaTongChi` from `tinhChiPhiMuaBan`.
- `tang-cho-thua-ke.html`: Calculator for gifting & inheritance (Tặng cho / thừa kế). Automatically evaluates 100% tax exemption for direct relatives.
- `assets/js/calculator.js`: Tax & fee calculations, currency parsing/formatting, number-to-words converter in Vietnamese.
- `assets/css/style.css`: Modern FinTech styling, custom scrollbars, print stylesheet, and Mobile UX touch optimization.
- Static Pages: `gioi-thieu.html`, `lien-he.html`, `chinh-sach-bao-mat.html`, `dieu-khoan-su-dung.html`.
- SEO guide pages (each targets one keyword cluster, has a mini calculator, Article/FAQ/Breadcrumb JSON-LD, and links to the others): `le-phi-truoc-ba-nha-dat.html`, `phi-cong-chung-mua-ban-nha-dat.html`, `thue-tncn-ban-nha-dat.html`, `thu-tuc-sang-ten-so-do.html`, `sang-ten-so-do-cho-con.html`. Linked from the "Hướng dẫn chi tiết" block and footer of `index.html` / `tang-cho-thua-ke.html`, and listed in `sitemap.xml`. When adding a page, also add it to sitemap and these link lists.

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
- Share / copy / print live in `assets/js/share.js` (`NhaDatShare.share`, `.printReceipt`): mobile uses `navigator.share`; clipboard falls back to execCommand then a manual-copy modal (Zalo/Facebook webviews). `printReceipt` prints only `#resultCard` in black-on-white via `body.print-receipt` + `#printArea` (print CSS is injected by share.js itself; Ctrl+P also prints the receipt via `beforeprint`); in-app browsers get a "open in Chrome/Safari" notice.
- Font-size >= 16px on inputs to prevent iOS Safari auto-zoom.
