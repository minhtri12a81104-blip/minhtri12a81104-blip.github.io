/** Build CSS: npx tailwindcss@3 -i assets/css/tailwind.src.css -o assets/css/tailwind.css --minify
 *  Chạy lại lệnh này mỗi khi thêm class Tailwind mới vào HTML. */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: { extend: {} },
  plugins: [],
};
