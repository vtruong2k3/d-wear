// components/BotProductCard.tsx
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho product để code an toàn hơn
interface Product {
    _id: string;
    name: string;
    image: string;
    gender: 'male' | 'female' | 'unisex';
    basePrice: number;
}

const BotProductCard = ({ product }: { product: Product }) => {
    const navigate = useNavigate();

    // Kiểm tra nếu không có product thì không render gì cả để tránh lỗi
    if (!product) {
        return null;
    }

    return (
        <div className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition">
            <img
                // SỬA 1: Dùng đúng thuộc tính 'image' mà backend trả về
                src={product.image}
                alt={product.name}
                className="h-24 w-full object-cover rounded-md"
                // Thêm ảnh dự phòng nếu link ảnh bị lỗi
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=L%E1%BB%97i+T%E1%BA%A3i';
                }}
            />
            {/* SỬA 2: Dùng đúng thuộc tính 'name' mà backend đã đổi tên */}
            <div className="mt-1 font-medium text-sm truncate" title={product.name}>{product.name}</div>
            <div className="text-xs text-gray-500 uppercase">{product.gender}</div>
            <div className="text-blue-500 font-semibold text-sm">
                {product.basePrice.toLocaleString()}₫
            </div>
            <Button
                size="small"
                type="link"
                className="text-blue-600 px-0 mt-1"
                onClick={() => navigate(`/product/${product._id}`)}
            >
                Xem chi tiết
            </Button>
        </div>
    );
};

export default BotProductCard;
