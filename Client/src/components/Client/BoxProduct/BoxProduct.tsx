import React, { useEffect, useState, memo } from "react";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  EyeOutlined,
  SwapOutlined,
  StarFilled
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Tooltip } from "antd";
import { Grow } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { formatCurrency } from "../../../utils/Format";
import type { IProducts } from "../../../types/IProducts";

interface BoxProductProps {
  item: IProducts;
}

const BoxProduct: React.FC<BoxProductProps> = memo(({ item }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    switch (action) {
      case 'wishlist':
        setIsWishlisted(!isWishlisted);
        break;
      case 'compare':
        console.log(`Compare: ${item.product_name}`);
        break;
      case 'quickview':
        console.log(`Quick view: ${item.product_name}`);
        break;
      case 'addToCart':
        console.log(`Add to cart: ${item.product_name}`);
        break;
      default:
        break;
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(`Adding ${item.product_name} to cart`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, Math.random() * 500 + 300);

    return () => clearTimeout(timer);
  }, [item]);

  const getImageSrc = (index: number = 0) => {
    if (item.imageUrls && item.imageUrls.length > index) {
      const imageUrl = item.imageUrls[index];
      return imageUrl.startsWith("http")
        ? imageUrl
        : `http://localhost:5000/${imageUrl.replace(/\\/g, "/")}`;
    }
    return "/default.png";
  };

  const handleImageHover = () => {
    if (item.imageUrls && item.imageUrls.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
  };

  // Mock data for demo
  const mockRating = 4.5;
  const mockReviews = 156;
  const salePrice = item.variants?.[0]?.price || item.basePrice;
  const originalPrice = item.basePrice; // hoặc item.basePrice cũng được

  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  return isLoading ? (
    <Grow in={true} timeout={800}>
      <div className="group cursor-pointer h-full">
        <Card
          hoverable
          className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white"
          cover={
            <div className="relative z-1 overflow-hidden">
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{discountPercent}%
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <div className="absolute top-3 right-3 z-10">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={isWishlisted ?
                    <HeartFilled className="text-red-500" /> :
                    <HeartOutlined className="text-gray-400 hover:text-red-500" />
                  }
                  className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={(e) => handleActionClick(e, 'wishlist')}
                />
              </div>

              {/* Quick Action Buttons */}
              <div className="absolute top-12 right-3 z-10 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <Tooltip title="Xem nhanh">
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={<EyeOutlined />}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm text-gray-600 hover:text-blue-500"
                    onClick={(e) => handleActionClick(e, 'quickview')}
                  />
                </Tooltip>
                <Tooltip title="So sánh">
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={<SwapOutlined />}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm text-gray-600 hover:text-green-500"
                    onClick={(e) => handleActionClick(e, 'compare')}
                  />
                </Tooltip>
              </div>

              {/* Product Image */}
              <div
                className="relative h-100 bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
                onMouseEnter={handleImageHover}
                onMouseLeave={handleImageLeave}
              >
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                  </div>
                )}

                {!imageError ? (
                  <img
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105  ${imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    src={getImageSrc(currentImageIndex)}
                    alt={item.product_name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      setImageLoaded(true);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👔</div>
                      <p className="text-sm">Không có hình ảnh</p>
                    </div>
                  </div>
                )}

                {/* Quick Add to Cart - Bottom Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link to={`/product/${item._id}`}>
                    <Button
                      type="primary"
                      block
                      icon={<ShoppingCartOutlined />}
                      className="!bg-white text-black !border-0 hover:!bg-black font-medium rounded-lg h-10"
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          }
          bodyStyle={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between space-y-3">
            {/* Category */}
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium !mb-0">
              {item.category_id.category_name}
            </div>

            {/* Product Name */}
            <div
              className="cursor-pointer flex-1"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 !mb-0"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.4',
                  height: '2.8em' // 2 lines * 1.4 line-height
                }}>
                {item.product_name}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarFilled
                    key={star}
                    className={`text-xs ${star <= Math.floor(mockRating)
                      ? 'text-yellow-500'
                      : 'text-gray-200'
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({mockReviews})</span>
            </div>

            {/* Price */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(item.variants?.[0]?.price || item.basePrice)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              {discountPercent > 0 && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  Tiết kiệm {formatCurrency(item.basePrice - salePrice)}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Grow>
  ) : (
    <div className="group cursor-pointer h-full">
      <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm bg-white">
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
        </div>
        <div className="p-4 flex-1 flex flex-col space-y-3">
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
          <div className="mt-auto">
            <Skeleton variant="text" width="50%" height={24} />
            <Skeleton variant="text" width="30%" height={16} />
          </div>
        </div>
      </Card>
    </div>
  );
});

BoxProduct.displayName = 'BoxProduct';

export default BoxProduct;