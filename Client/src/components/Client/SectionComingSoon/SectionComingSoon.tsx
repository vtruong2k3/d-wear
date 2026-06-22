import { Link } from "react-router-dom";

const SectionComingSoon = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background Image (Mock) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=2000&auto=format&fit=crop"
          alt="Coming Soon Background"
          className="w-full h-full object-cover filter grayscale blur-[2px]"
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 font-semibold text-sm tracking-widest uppercase mb-6 backdrop-blur-sm">
          Bộ sưu tập mới
        </span>
        
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
            THE FALLOUT
          </span>
          COLLECTION
        </h2>
        
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
          Bí ẩn, táo bạo và đậm chất đường phố. Bộ sưu tập lớn nhất năm của D-WEAR sẽ chính thức ra mắt vào cuối tháng này.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Nhập email để nhận thông báo..."
            className="w-full h-14 px-6 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-md transition-all"
          />
          <button className="w-full sm:w-auto h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-amber-500/30 whitespace-nowrap">
            Đăng Ký Ngay
          </button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 text-white/50">
          <div className="text-center">
            <p className="text-3xl font-black text-white">14</p>
            <p className="text-xs uppercase tracking-widest mt-1">Ngày</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div className="text-center">
            <p className="text-3xl font-black text-white">LTD</p>
            <p className="text-xs uppercase tracking-widest mt-1">Phiên bản</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div className="text-center">
            <p className="text-3xl font-black text-white">VIP</p>
            <p className="text-xs uppercase tracking-widest mt-1">Ưu đãi</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionComingSoon;
