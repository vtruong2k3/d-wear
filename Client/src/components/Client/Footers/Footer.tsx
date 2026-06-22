import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  D-WEAR
                </h2>
                <div className="accent-bar mt-3" />
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Thời trang hiện đại, phong cách trẻ trung dành cho giới trẻ.
                Chúng tôi mang đến những sản phẩm chất lượng cao với giá cả
                phải chăng.
              </p>
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* About Us */}
            <div>
              <h3 className="font-semibold text-white text-base mb-5">
                Về Chúng Tôi
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Cửa Hàng Của Chúng Tôi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Liên Hệ
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Nhà Thiết Kế
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Hoạt Động Cộng Đồng
                  </a>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Tin Tức
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-white text-base mb-5">
                Dịch Vụ Khách Hàng
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Câu Hỏi Thường Gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Tìm Cửa Hàng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Đổi Trả Hàng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Thông Tin Vận Chuyển
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    Bán Sỉ
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-white text-base mb-5">
                Nhận Thông Báo
              </h3>
              <p className="text-white/70 text-sm mb-5">
                Đăng ký để nhận thông báo về sản phẩm mới và chương trình
                khuyến mãi hấp dẫn.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                />
                <button className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                  Đăng Ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2025 D-WEAR. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <a
                href="#"
                className="text-white/50 hover:text-amber-400 transition-colors"
              >
                Chính Sách Bảo Mật
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-amber-400 transition-colors"
              >
                Điều Khoản Sử Dụng
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-amber-400 transition-colors"
              >
                Chính Sách Cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;