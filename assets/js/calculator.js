/**
 * BỘ CÔNG CỤ TÍNH THUẾ & PHÍ SANG TÊN NHÀ ĐẤT BẤT ĐỘNG SẢN
 * Căn cứ pháp lý:
 * - Luật Đất đai mới nhất
 * - Luật Thuế thu nhập cá nhân số 109/2025/QH15 (hiệu lực 01/7/2026) & Nghị định 253/2026/NĐ-CP
 *   (Thuế TNCN chuyển nhượng 2%; thừa kế, quà tặng 10% phần vượt 20 triệu)
 * - Nghị định 10/2022/NĐ-CP & Thông tư 13/2022/TT-BTC (Lệ phí trước bạ 0.5%)
 * - Thông tư 257/2016/TT-BTC & Thông tư 111/2017/TT-BTC (Phí công chứng hợp đồng)
 */

// Hàm chuyển số thành chuỗi có dấu phẩy phân cách hàng nghìn
function formatCurrency(number) {
    if (isNaN(number) || number === null || number === undefined) return '0';
    return Math.round(number).toLocaleString('vi-VN');
}

// Hàm phân tích chuỗi có dấu phẩy thành số nguyên
function parseCurrency(str) {
    if (!str) return 0;
    const cleanStr = str.toString().replace(/[^0-9]/g, '');
    return parseInt(cleanStr, 10) || 0;
}

// Hàm đọc số tiền thành chữ tiếng Việt chuẩn xác
function docSoThanhChu(so) {
    if (so === 0) return 'Không đồng';
    if (!so || isNaN(so)) return '';

    const chuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tienDonVi = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

    // docDayDu = true với các khối không đứng đầu (phải đọc "không trăm", "lẻ")
    function docBlock3(b, docDayDu) {
        let tram = Math.floor(b / 100);
        let chuc = Math.floor((b % 100) / 10);
        let donVi = b % 10;
        let ketQua = '';

        if (tram > 0 || docDayDu) {
            ketQua += chuSo[tram] + ' trăm ';
            tram = Math.max(tram, 1); // để nhánh "lẻ" bên dưới được áp dụng
        }
        if (chuc > 1) {
            ketQua += chuSo[chuc] + ' mươi ';
            if (donVi === 1) ketQua += 'mốt';
            else if (donVi === 5) ketQua += 'lăm';
            else if (donVi > 0) ketQua += chuSo[donVi];
        } else if (chuc === 1) {
            ketQua += 'mười ';
            if (donVi === 5) ketQua += 'lăm';
            else if (donVi > 0) ketQua += chuSo[donVi];
        } else if (chuc === 0 && tram > 0 && donVi > 0) {
            ketQua += 'lẻ ' + chuSo[donVi];
        } else if (chuc === 0 && tram === 0 && donVi > 0) {
            ketQua += chuSo[donVi];
        }
        return ketQua.trim();
    }

    let strSo = Math.round(so).toString();
    let blocks = [];
    while (strSo.length > 0) {
        blocks.unshift(parseInt(strSo.slice(-3), 10));
        strSo = strSo.slice(0, -3);
    }

    let strWords = [];
    for (let i = 0; i < blocks.length; i++) {
        let b = blocks[i];
        let unitIdx = blocks.length - 1 - i;
        if (b > 0) {
            let bText = docBlock3(b, i > 0);
            strWords.push(bText + (tienDonVi[unitIdx] ? ' ' + tienDonVi[unitIdx] : ''));
        }
    }

    let finalWords = strWords.join(' ').replace(/\s+/g, ' ').trim();
    if (!finalWords) return 'Không đồng';
    return finalWords.charAt(0).toUpperCase() + finalWords.slice(1) + ' đồng';
}

/**
 * Tính phí công chứng chuyển nhượng theo Thông tư 257/2016/TT-BTC
 */
function tinhPhiCongChung(giaTri) {
    if (giaTri <= 0) return 0;
    if (giaTri <= 50000000) {
        return 50000;
    } else if (giaTri <= 100000000) {
        return 100000;
    } else if (giaTri <= 1000000000) {
        return Math.round(giaTri * 0.001);
    } else if (giaTri <= 3000000000) {
        return Math.round(1000000 + (giaTri - 1000000000) * 0.0006);
    } else if (giaTri <= 5000000000) {
        return Math.round(2200000 + (giaTri - 3000000000) * 0.0005);
    } else if (giaTri <= 10000000000) {
        return Math.round(3200000 + (giaTri - 5000000000) * 0.0004);
    } else if (giaTri <= 100000000000) {
        // Trên 10 tỷ đến 100 tỷ: 5,2 triệu + 0,03% của phần vượt quá 10 tỷ
        return Math.round(5200000 + (giaTri - 10000000000) * 0.0003);
    } else {
        // Trên 100 tỷ: 32,2 triệu + 0,02% của phần vượt quá 100 tỷ (Tối đa 70 triệu)
        let phi = 32200000 + (giaTri - 100000000000) * 0.0002;
        return Math.min(70000000, Math.round(phi));
    }
}

/**
 * Tính toán chi phí chuyển nhượng mua bán
 */
function tinhChiPhiMuaBan(params) {
    const {
        giaTri,
        isMienThueTNCN = false,
        isMienTruocBa = false,
        loaiCapSo = 'cap_moi', // 'cap_moi' hoặc 'trang_4'
        khuVuc = 'hanoi_hcm',  // 'hanoi_hcm' hoặc 'tinh_khac'
        dichVuCongChung = true
    } = params;

    // 1. Thuế thu nhập cá nhân (2%) - Bên bán
    const thueTNCN = isMienThueTNCN ? 0 : Math.round(giaTri * 0.02);

    // 2. Lệ phí trước bạ (0.5%) - Bên mua
    const lePhiTruocBa = isMienTruocBa ? 0 : Math.round(giaTri * 0.005);

    // 3. Phí công chứng hợp đồng theo TT 257/2016
    const phiCongChungGoc = tinhPhiCongChung(giaTri);
    const phiThuLaoCongChung = dichVuCongChung ? 300000 : 0; // Thù lao soạn thảo, in ấn, photo
    const tongPhiCongChung = phiCongChungGoc + phiThuLaoCongChung;

    // 4. Lệ phí thẩm định hồ sơ (Tùy khu vực)
    // Thường dao động từ 500.000đ đến 2.000.000đ tùy giá trị và tỉnh thành
    let lePhiThamDinh = 0;
    if (khuVuc === 'hanoi_hcm') {
        if (giaTri <= 1000000000) lePhiThamDinh = 500000;
        else if (giaTri <= 5000000000) lePhiThamDinh = 1000000;
        else lePhiThamDinh = 1500000;
    } else {
        lePhiThamDinh = 500000;
    }

    // 5. Lệ phí cấp phôi sổ mới hoặc đăng ký biến động
    const lePhiCapSo = (loaiCapSo === 'cap_moi') ? 100000 : 25000;

    // 6. Phí trích lục bản đồ / địa chính (ước tính)
    const phiTrichLuc = 150000;

    // Tổng hợp chi phí theo luật quy định ai nộp:
    const chiPhiBenBan = thueTNCN; // Theo luật: Bên bán nộp Thuế TNCN
    const chiPhiBenMua = lePhiTruocBa + lePhiThamDinh + lePhiCapSo + phiTrichLuc; // Bên mua nộp trước bạ và phí đăng bộ
    const chiPhiHaiBenThoaThuan = tongPhiCongChung; // Phí công chứng thường chia đôi hoặc do thỏa thuận

    const tongTatCaChiPhi = chiPhiBenBan + chiPhiBenMua + chiPhiHaiBenThoaThuan;

    return {
        giaTri,
        thueTNCN,
        isMienThueTNCN,
        lePhiTruocBa,
        isMienTruocBa,
        phiCongChungGoc,
        phiThuLaoCongChung,
        tongPhiCongChung,
        lePhiThamDinh,
        lePhiCapSo,
        phiTrichLuc,
        chiPhiBenBan,
        chiPhiBenMua,
        chiPhiHaiBenThoaThuan,
        tongTatCaChiPhi
    };
}

/**
 * Tính toán chi phí Tặng cho / Thừa kế
 */
function tinhChiPhiTangCho(params) {
    const {
        giaTri,
        moiQuanHe = 'truc_tiep', // 'truc_tiep' hoặc 'khac'
        loaiCapSo = 'cap_moi',
        khuVuc = 'hanoi_hcm'
    } = params;

    let thueTNCN = 0;
    let lePhiTruocBa = 0;
    let isDuocMien = false;

    if (moiQuanHe === 'truc_tiep') {
        // Quan hệ trực hệ (Bố mẹ - con, vợ - chồng, ông bà - cháu, anh chị em ruột):
        // MIỄN 100% thuế TNCN và MIỄN 100% Lệ phí trước bạ
        thueTNCN = 0;
        lePhiTruocBa = 0;
        isDuocMien = true;
    } else {
        // Quan hệ khác / người ngoài:
        // Thuế TNCN 10% trên phần giá trị vượt quá 20 triệu đồng (Luật Thuế TNCN 2025, từ 01/7/2026)
        const phanVuot = Math.max(0, giaTri - 20000000);
        thueTNCN = Math.round(phanVuot * 0.1);
        // Lệ phí trước bạ 0.5%
        lePhiTruocBa = Math.round(giaTri * 0.005);
        isDuocMien = false;
    }

    const phiCongChungGoc = tinhPhiCongChung(giaTri);
    const tongPhiCongChung = phiCongChungGoc + 300000;
    const lePhiThamDinh = (khuVuc === 'hanoi_hcm') ? 800000 : 500000;
    const lePhiCapSo = (loaiCapSo === 'cap_moi') ? 100000 : 25000;
    const phiTrichLuc = 150000;

    const tongTatCaChiPhi = thueTNCN + lePhiTruocBa + tongPhiCongChung + lePhiThamDinh + lePhiCapSo + phiTrichLuc;

    return {
        giaTri,
        moiQuanHe,
        isDuocMien,
        thueTNCN,
        lePhiTruocBa,
        tongPhiCongChung,
        lePhiThamDinh,
        lePhiCapSo,
        phiTrichLuc,
        tongTatCaChiPhi
    };
}

// Export các hàm để dùng global
window.NhaDatCalc = {
    formatCurrency,
    parseCurrency,
    docSoThanhChu,
    tinhPhiCongChung,
    tinhChiPhiMuaBan,
    tinhChiPhiTangCho
};
