import React from "react";

const items = [
  { icon: "⚡", text: "Giao hàng siêu tốc 24H" },
  { icon: "🛡️", text: "Đổi trả miễn phí 30 ngày" },
  { icon: "💯", text: "Cam kết hàng chính hãng" },
  { icon: "🎁", text: "Quà tặng từ đơn 500K" },
  { icon: "🔒", text: "Thanh toán bảo mật tuyệt đối" },
  { icon: "🚀", text: "Hàng mới về mỗi tuần" },
];

// Nhân đôi để loop mượt
const marqueeItems = [...items, ...items];

const SectionService: React.FC = () => {
  return (
    <div className="bg-[#111] border-y border-gray-800 overflow-hidden py-3">
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        {marqueeItems.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-8 text-sm font-medium text-gray-300"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.text}</span>
            <span className="ml-8 text-gray-700">|</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default SectionService;
