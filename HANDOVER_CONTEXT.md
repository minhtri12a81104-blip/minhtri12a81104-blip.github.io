# 🏡 TÀI LIỆU BÀN GIAO DỰ ÁN TINHNHADAT.COM (ANTIGRAVITY HANDOVER)

> **Mục đích:** Tài liệu tóm tắt toàn bộ tiến trình, kiến trúc mã nguồn và cấu hình tiếp thị của dự án `tinhnhadat.com` để mở tiếp trên máy tính khác với trợ lý Antigravity.

---

## 1. THÔNG TIN DỰ ÁN & REPOSITORY
- **Website chính thức (Live):** [https://tinhnhadat.com](https://tinhnhadat.com/)
- **GitHub Repository:** `https://github.com/minhtri12a81104-blip/minhtri12a81104-blip.github.io.git`
- **Nhánh chính:** `main`
- **Nền tảng lưu trữ:** GitHub Pages (kèm Custom Domain `tinhnhadat.com` và SSL Cloudflare/Fastly).

---

## 2. CÁC TRANG & CHỨC NĂNG ĐÃ HOÀN THIỆN
1. **`index.html`** (Trang chủ - Tính thuế mua bán sang tên):
   - Tính tự động Thuế TNCN (2%), Lệ phí trước bạ (0.5%), Phí công chứng bậc thang lũy tiến (Thông tư 257/2016/TT-BTC), Lệ phí thẩm định địa chính và cấp sổ mới/trang 4.
   - Phân định rõ ràng nghĩa vụ tài chính của **Bên Bán nộp gì** và **Bên Mua nộp gì**.
   - Nút chọn nhanh giá trị (500Tr, 1 Tỷ, 2 Tỷ, 3 Tỷ, 5 Tỷ, 10 Tỷ).
2. **`tang-cho-thua-ke.html`** (Trang tính thuế tặng cho / thừa kế):
   - Tự động nhận diện quan hệ ruột thịt trực hệ (bố mẹ - con, vợ - chồng, ông bà - cháu, anh chị em ruột): **MIỄN 100%** thuế TNCN và lệ phí trước bạ.
   - Quan hệ họ hàng/ngoài diện trực hệ: Tính Thuế TNCN 10% (phần vượt 10 triệu) + Lệ phí trước bạ 0.5%.
3. **Các trang phụ trợ & pháp lý đầy đủ:**
   - `gioi-thieu.html`: Giới thiệu dự án phi lợi nhuận hướng tới cộng đồng.
   - `lien-he.html`: Biểu mẫu góp ý và thông tin hỗ trợ.
   - `chinh-sach-bao-mat.html`: Chính sách quyền riêng tư (Privacy Policy).
   - `dieu-khoan-su-dung.html`: Điều khoản dịch vụ & Miễn trừ trách nhiệm (Terms of Service).
4. **Bộ nhận diện thương hiệu & SEO:**
   - Vector Logo: `assets/images/logo.svg`
   - Favicon: `favicon.svg`
   - Schema JSON-LD Google chuẩn SEO: WebApplication, HowTo 4 bước sang tên, FAQPage hiển thị đánh giá 4.9 sao và câu hỏi thường gặp trên Google Tìm kiếm.

---

## 3. TỐI ƯU HÓA ĐẶC BIỆT CHO ĐIỆN THOẠI (MOBILE UX)
- **Bàn phím số tự động:** Ô nhập giá trị có `inputmode="numeric" pattern="[0-9,.]*"` tự bật bàn phím số to rõ ràng trên iPhone và Android.
- **Thanh kết quả cố định đáy màn hình (`Sticky Mobile Bar`):** Khi người dùng đổi giá tiền hoặc bấm nút chọn nhanh, thanh dưới đáy điện thoại nhảy số tức thì, có nút `[Xem Chi Tiết]` cuộn mượt và nút `[Chia sẻ]`.
- **Menu điều hướng Hamburger:** Nút `[ ☰ ]` trên thanh tiêu đề điện thoại giúp mở danh mục tra cứu nhanh.
- **Chia sẻ Zalo/App bằng 1 chạm (`Web Share API`):** Tự động mở bảng chia sẻ gốc của điện thoại để gửi kết quả qua Zalo, Messenger, SMS...
- **Chống phóng to màn hình trên iPhone:** Cỡ chữ tối thiểu 16px, loại bỏ hiện tượng giật màn hình của iOS Safari.
- **Vùng chạm ngón cái công thái học:** Kích thước nút bấm tối thiểu 40px, bố cục 3 cột cân đối.

---

## 4. HỆ THỐNG QUẢNG CÁO & KIẾM TIỀN (MONETIZATION)
> **Lưu ý quan trọng:** Dự án **KHÔNG** sử dụng Google AdSense theo yêu cầu của chủ sở hữu.

1. **Mạng quảng cáo Monetag (Tự động nhận tiền theo CPM/Click):**
   - **Zone 11965876** (Push Notifications): Đặt thẻ script ngay sau `<head>`, kèm file cấu hình Service Worker `sw.js` tại thư mục gốc.
   - **Zone 11965357** (In-Page Push Banner): Đặt trước thẻ đóng `</body>`.
   - Mã xác minh Monetag meta tag: `<meta name="monetag" content="6f32866cf2fe2a20a234009ae66d9ea8">`.
2. **Tiếp thị liên kết Tài chính & Ngân hàng (Native FinTech Affiliate):**
   - **Thẻ 1 - MB Bank:** Gắn link giới thiệu cá nhân có mã `6T8XQDA6RJSI8DWEM9OKL` (Hoa hồng 30k-50k/lượt cài app và mở tài khoản mới).
   - **Thẻ 2 - VPBank Online:** Gắn link chiến dịch Accesstrade `https://shorten.asia/kRQJVNfk` (Hoa hồng 2.5% / hợp đồng vay vốn giải ngân).
   - **Thẻ 3 - Tiện ích tính trả góp:** Công cụ tính gốc + lãi hàng tháng tương tác trực tiếp cho các gói vay 500Tr / 1 Tỷ / 2 Tỷ.
   - Cả hộp banner nhỏ dưới bảng tính và khu vực 3 thẻ lớn đều đã gắn link tiếp thị thật.

---

## 5. HƯỚNG DẪN KHI VỀ MÁY NHÀ MỞ DỰ ÁN
1. Mở Terminal / PowerShell trên máy tính ở nhà:
   ```bash
   git clone https://github.com/minhtri12a81104-blip/minhtri12a81104-blip.github.io.git tinh-nhadat
   cd tinh-nhadat
   ```
2. Mở Antigravity trong thư mục này và dán **PROMPT BÀN GIAO** ở mục 6 bên dưới.

---

## 6. PROMPT BÀN GIAO DÙNG ĐỂ GỬI CHO ANTIGRAVITY TRÊN MÁY NHÀ

```text
Chào Antigravity, tôi vừa kéo repository dự án https://tinhnhadat.com/ từ GitHub về máy nhà.
Bạn hãy đọc file HANDOVER_CONTEXT.md trong thư mục dự án để nắm toàn bộ bối cảnh dự án nhé:
- Đây là website tính thuế trước bạ, thuế TNCN, phí công chứng và sang tên sổ đỏ nhà đất (index.html và tang-cho-thua-ke.html).
- Đã tối ưu SEO Google Top 1, Schema JSON-LD, tối ưu giao diện điện thoại (mobile UX bàn phím số, sticky bar đáy màn hình, web share).
- Hệ thống kiếm tiền: Monetag (Zone 11965876 Push và Zone 11965357 In-Page), Affiliate MBBank (mã 6T8XQDA6RJSI8DWEM9OKL) và VPBank qua Accesstrade (https://shorten.asia/kRQJVNfk). Tuyệt đối không dùng Google AdSense.
Bây giờ, hãy kiểm tra toàn bộ mã nguồn và báo cáo trạng thái hiện tại để chúng ta tiếp tục phát triển nhé!
```
