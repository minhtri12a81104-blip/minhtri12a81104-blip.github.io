/**
 * Chia sẻ / sao chép / in phiếu kết quả - dùng chung cho các trang tính phí.
 * Luôn có phản hồi cho người dùng, kể cả trong trình duyệt nhúng của Zalo, Facebook
 * (nơi Web Share, Clipboard API hoặc window.print có thể bị chặn).
 */
(function () {
    const ua = navigator.userAgent || '';
    const isMobile = /android|iphone|ipad|ipod|mobile/i.test(ua);
    const isInAppBrowser = /Zalo|FBAN|FBAV|FB_IAB|Instagram|Line\/|TikTok|musical_ly/i.test(ua);

    function showToast() {
        const toast = document.getElementById('copyToast');
        if (!toast) return;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // Sao chép kiểu cũ, chạy được trong nhiều webview không hỗ trợ Clipboard API
    function execCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        return ok;
    }

    function openModal(title, bodyNode, actions) {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'ndModal';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;padding:16px';
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

        const box = document.createElement('div');
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.style.cssText = 'background:#fff;color:#0f172a;border-radius:16px;max-width:440px;width:100%;padding:20px;box-shadow:0 20px 40px rgba(0,0,0,.25);font-size:14px;line-height:1.5';

        const h = document.createElement('p');
        h.textContent = title;
        h.style.cssText = 'font-weight:800;font-size:16px;margin:0 0 10px';
        box.appendChild(h);
        box.appendChild(bodyNode);

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:14px';
        actions.concat([{ label: 'Đóng', onClick: closeModal }]).forEach((a, i, arr) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = a.label;
            const primary = arr.length > 1 && i === 0;
            b.style.cssText = 'padding:10px 16px;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;border:1px solid ' +
                (primary ? '#0284c7;background:#0284c7;color:#fff' : '#cbd5e1;background:#fff;color:#334155');
            b.addEventListener('click', () => a.onClick(b));
            row.appendChild(b);
        });
        box.appendChild(row);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        return box;
    }

    function closeModal() {
        const m = document.getElementById('ndModal');
        if (m) m.remove();
    }

    // Hộp hiển thị nội dung để người dùng tự sao chép khi trình duyệt chặn sao chép tự động
    function showCopyModal(text) {
        const wrap = document.createElement('div');
        const note = document.createElement('p');
        note.textContent = 'Bấm "Sao chép" hoặc giữ vào ô bên dưới để chọn và sao chép nội dung.';
        note.style.cssText = 'margin:0 0 8px;color:#475569';
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.readOnly = true;
        ta.rows = 7;
        ta.style.cssText = 'width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:10px;padding:10px;font-size:16px;resize:none';
        wrap.appendChild(note);
        wrap.appendChild(ta);
        openModal('Sao chép kết quả', wrap, [{
            label: 'Sao chép',
            onClick: (btn) => {
                ta.focus();
                ta.select();
                const done = () => { btn.textContent = 'Đã sao chép ✓'; };
                if (execCopy(text)) return done();
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(done, () => { btn.textContent = 'Hãy giữ vào ô để sao chép'; });
                } else {
                    btn.textContent = 'Hãy giữ vào ô để sao chép';
                }
            },
        }]);
        setTimeout(() => { ta.focus(); ta.select(); }, 50);
    }

    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(showToast, () => {
                if (execCopy(text)) showToast();
                else showCopyModal(text);
            });
        } else if (execCopy(text)) {
            showToast();
        } else {
            showCopyModal(text);
        }
    }

    function share(opts) {
        const text = opts.text;
        if (isMobile && navigator.share) {
            navigator.share({ title: opts.title, text: text }).catch((err) => {
                // Người dùng tự đóng bảng chia sẻ thì không làm gì thêm
                if (err && err.name === 'AbortError') return;
                showCopyModal(text);
            });
            return;
        }
        copy(text);
    }

    // CSS in phiếu nằm ngay trong file này để luôn khớp với code (không phụ thuộc style.css đang được cache)
    const PRINT_CSS = [
        "#printArea{display:none}",
        "@media print{",
        "body.print-receipt>*:not(#printArea){display:none!important}",
        "body.print-receipt #printArea{display:block!important}",
        "#printArea,#printArea *{color:#000!important;-webkit-text-fill-color:#000!important;background:transparent!important;box-shadow:none!important;border-color:#cbd5e1!important}",
        "#printArea .print-container{border:1px solid #cbd5e1!important;border-radius:8px;padding:12pt!important}",
        "#printArea .hidden{display:none!important}",
        "}",
    ].join("");
    const styleEl = document.createElement("style");
    styleEl.id = "ndPrintStyle";
    styleEl.textContent = PRINT_CSS;
    document.head.appendChild(styleEl);

    function removeReceipt() {
        document.body.classList.remove("print-receipt");
        const area = document.getElementById("printArea");
        if (area) area.remove();
    }

    // Dựng phiếu kết quả để in: chỉ phần kết quả, chữ đen trên nền trắng
    function buildReceipt() {
        const card = document.getElementById("resultCard");
        if (!card) return false;
        removeReceipt();

        const area = document.createElement("div");
        area.id = "printArea";
        const lines = [];
        const giaTri = document.getElementById("giaTriInput");
        if (giaTri) lines.push("Giá trị tài sản: " + giaTri.value + " đ");
        const quanHe = document.getElementById("selectQuanHe");
        if (quanHe) lines.push("Mối quan hệ: " + quanHe.options[quanHe.selectedIndex].text.trim());
        const khuVuc = document.getElementById("khuVucSelect");
        if (khuVuc) lines.push("Khu vực: " + khuVuc.options[khuVuc.selectedIndex].text.trim());

        const h = document.createElement("h1");
        h.style.cssText = "font-size:18pt;margin:0 0 4pt";
        h.textContent = "Phiếu dự toán thuế & phí sang tên nhà đất";
        area.appendChild(h);
        const sub = document.createElement("p");
        sub.style.cssText = "margin:0 0 10pt;font-size:10pt";
        sub.textContent = "tinhnhadat.com · Ngày in: " + new Date().toLocaleDateString("vi-VN");
        area.appendChild(sub);
        lines.forEach((l) => {
            const p = document.createElement("p");
            p.style.cssText = "margin:0 0 3pt;font-size:11pt";
            p.textContent = l;
            area.appendChild(p);
        });

        const clone = card.cloneNode(true);
        clone.querySelectorAll(".no-print, button, #copyToast").forEach((el) => el.remove());
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        clone.removeAttribute("id");
        area.appendChild(clone);

        const foot = document.createElement("p");
        foot.style.cssText = "margin-top:12pt;font-size:9pt";
        foot.textContent = "Kết quả mang tính tham khảo. Số tiền thực tế do cơ quan thuế, văn phòng công chứng và văn phòng đăng ký đất đai xác định.";
        area.appendChild(foot);

        document.body.appendChild(area);
        document.body.classList.add("print-receipt");
        return true;
    }

    // Cả khi người dùng bấm Ctrl+P hay In từ menu trình duyệt cũng chỉ in phiếu
    window.addEventListener("beforeprint", () => {
        if (!document.getElementById("printArea")) buildReceipt();
    });
    window.addEventListener("afterprint", removeReceipt);

    function printReceipt() {
        if (isInAppBrowser || typeof window.print !== "function") {
            const p = document.createElement("p");
            p.style.cssText = "margin:0;color:#475569";
            p.textContent = "Trình duyệt trong ứng dụng (Zalo, Facebook...) không hỗ trợ in. Bấm nút ⋯ ở góc màn hình, chọn \"Mở bằng trình duyệt\" (Chrome hoặc Safari) rồi bấm In lại để in hoặc lưu PDF. Bạn cũng có thể dùng nút \"Sao chép kết quả\" để gửi qua Zalo.";
            openModal("Không thể in tại đây", p, []);
            return;
        }
        buildReceipt();
        window.print();
    }

    window.NhaDatShare = { share, copy, printReceipt, showCopyModal };
})();
