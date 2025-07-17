import React, { useEffect, useState, memo } from "react";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_reload from "../../../assets/images/ico_reload.png";
import ico_search from "../../../assets/images/ico_search.png";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Grow } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../../redux/features/client/cartSlice";
// import { toast } from "react-toastify";
// import useAuth from "../../../hooks/Client/useAuth";
import { formatCurrency } from "../../../utils/Format";
import type { IProducts } from "../../../types/IProducts";

interface BoxProductProps {
  item: IProducts;
}

const BoxProduct: React.FC<BoxProductProps> = memo(({ item }) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { requireAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   requireAuth(() => {
  //     dispatch(
  //       addToCart({
  //         id: item._id,
  //         title: item.product_name,
  //         price: item.basePrice,
  //         thumbnail: item.imageUrls?.[0] || "",
  //         quantity: 1,
  //       })
  //     );
  //     toast.success(`Thêm thành công ${item.product_name}`);
  //   });
  // };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`Action: ${action} for product: ${item.product_name}`);
    // Implement specific actions here
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, Math.random() * 500 + 300); // Random delay between 300-800ms

    return () => clearTimeout(timer);
  }, [item]);

  const getImageSrc = () => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      const imageUrl = item.imageUrls[0];
      return imageUrl.startsWith("http")
        ? imageUrl
        : `http://localhost:5000/${imageUrl.replace(/\\/g, "/")}`;
    }
    return "/default.png";
  };

  const actionButtons = [
    { icon: ico_heart, action: "favorite", label: "Yêu thích" },
    { icon: ico_reload, action: "compare", label: "So sánh" },
    { icon: ico_search, action: "quickview", label: "Xem nhanh" },
  ];

  return isLoading ? (
    <Grow in={true} timeout={800}>
      <li className="mt-6 md:mt-0 text-center group relative cursor-pointer  transition-all duration-300 ease-out transform hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-xl bg-white">
          {/* Action buttons */}
          <ul className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            {actionButtons.map((btn, index) => (
              <li
                key={index}
                className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <button
                  type="button"
                  className="shadow-lg p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200"
                  onClick={(e) => handleActionClick(e, btn.action)}
                  title={btn.label}
                >
                  <img src={btn.icon} className="size-3.5" alt={btn.label} />
                </button>
              </li>
            ))}
          </ul>

          {/* Badges */}
          {/* <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {item.isNew && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">
                New
              </span>
            )}
            {item.salePercentage && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                -{item.salePercentage}%
              </span>
            )}
          </div> */}

          {/* Product image */}
          <div
            className="h-[280px] md:h-[320px] lg:h-[385px] overflow-hidden bg-gray-50 relative"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
              </div>
            )}

            {!imageError ? (
              <img
                className={`block size-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                src={getImageSrc()}
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
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">Không có hình ảnh</p>
                </div>
              </div>
            )}
          </div>

          {/* Product info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => navigate(`/product/${item._id}`)}
              className="w-full bg-white text-black py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* Product details */}
        <div className="pt-4 pb-2">
          {/* Product name */}
          <div className="line-clamp-2">
            <h3 className="text-sm md:text-base font-sans text-gray-800 hover:text-red-600 transition-colors duration-200">
              {item.product_name}
            </h3>
          </div>

          {/* Price section */}
          <div className="flex items-center justify-center mb-3">
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(item.basePrice)}
            </span>
          </div>
        </div>
      </li>
    </Grow>
  ) : (
    <li className="mt-6 md:mt-0 text-center group relative">
      <div className="rounded-xl overflow-hidden bg-gray-100 h-[280px] md:h-[320px] lg:h-[385px] flex items-center justify-center">
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} animation="wave" />
      </div>
      <div className="pt-4 pb-2">
        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="60%" />
      </div>
    </li>
  );
});

BoxProduct.displayName = 'BoxProduct';

export default BoxProduct;