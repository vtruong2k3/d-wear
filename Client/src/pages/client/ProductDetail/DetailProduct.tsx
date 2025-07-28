import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

import apiServiceProduct from "../../../services/client/apiServiceProduct";
import useAuth from "../../../hooks/Client/useAuth";
import useFetchGetDataProduct from "../../../hooks/Client/useFetchGetDataProduct";
import { addToCartThunk } from "../../../redux/features/client/thunks/cartThunk";
import type { AppDispatch } from "../../../redux/store";
import type { IProductDetail } from "../../../types/IProducts";
import type { IVariantDetail } from "../../../types/IVariants";
import '../../../styles/productDetail.css'

// Import các component con
import ProductImageGallery from "../../../components/Client/ProductDtail/ProductImageGallery";
import ProductInfo from "../../../components/Client/ProductDtail/ProductInfo";
import ProductReviews from "../../../components/Client/ProductDtail/ProductReviews";
import RelatedProducts from "../../../components/Client/ProductDtail/RelatedProducts";

// Interface cho đánh giá
interface IReview {
  _id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
  verified_purchase: boolean;
}

const DetailProduct = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { requireAuth } = useAuth();

  const [dataDetail, setDataDetail] = useState<IProductDetail | null>(null);
  const [variants, setVariants] = useState<IVariantDetail[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { products: relatedProducts } = useFetchGetDataProduct(
    dataDetail?.category_id || "",
    dataDetail?._id || ""
  );

  useEffect(() => {
    if (!id) return;
    divRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const fetchDataDetailProduct = async () => {
      setIsLoading(true);
      try {
        const res = await apiServiceProduct.getDetailProduct(id);
        const product = res?.data?.product;
        const variantList = res?.data?.variants;

        if (product) {
          setDataDetail(product);
          setVariants(variantList || []);
          setSelectedImage(product.imageUrls?.[0] || null);

          // Mock data cho reviews (thay thế bằng API thật nếu có)
          setReviews([
            {
              _id: "1",
              user_name: "Nguyễn Văn A",
              user_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
              rating: 5,
              comment: "Sản phẩm rất tuyệt vời! Chất lượng vượt mong đợi, giao hàng nhanh chóng. Tôi sẽ mua lại lần sau.",
              images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop"
              ],
              created_at: "2024-01-15T10:30:00Z",
              verified_purchase: true
            },
            {
              _id: "2",
              user_name: "Trần Thị B",
              user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
              rating: 4,
              comment: "Sản phẩm tốt, đóng gói cẩn thận. Chỉ có điều giao hàng hơi chậm một chút so với dự kiến.",
              images: [
                "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop"
              ],
              created_at: "2024-01-10T14:20:00Z",
              verified_purchase: true
            },
            {
              _id: "3",
              user_name: "Lê Văn C",
              user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
              rating: 5,
              comment: "Chất lượng xuất sắc! Đúng như mô tả, giá cả hợp lý. Rất hài lòng với lần mua hàng này.",
              created_at: "2024-01-08T09:15:00Z",
              verified_purchase: true
            },
            {
              _id: "4",
              user_name: "Phạm Thị D",
              user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
              rating: 3,
              comment: "Sản phẩm ổn, nhưng không phải quá xuất sắc như mong đợi. Có thể cải thiện thêm về chất lượng.",
              images: [
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop"
              ],
              created_at: "2024-01-05T16:45:00Z",
              verified_purchase: false
            },
            {
              _id: "5",
              user_name: "Hoàng Văn E",
              user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
              rating: 5,
              comment: "Tuyệt vời! Sản phẩm chất lượng cao, dịch vụ khách hàng tốt. Sẽ giới thiệu cho bạn bè.",
              created_at: "2024-01-03T11:30:00Z",
              verified_purchase: true
            }
            // ... thêm các review khác
          ]);
        } else {
          setDataDetail(null);
          toast.error("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        setDataDetail(null);
        toast.error("Có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataDetailProduct();
  }, [id]);

  const handleAddToCart = (variantId: string, quantity: number) => {
    requireAuth(() => {
      if (!dataDetail) return;
      const cartItem = {
        product_id: dataDetail._id,
        quantity,
        variant_id: variantId,
      };
      dispatch(addToCartThunk(cartItem));
    });
  };

  const averageRating = (() => {
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  })();

  return (
    <>
      {dataDetail ? (
        <div className="container" ref={divRef}>
          <ul className="flex gap-2 items-center py-4">
            <li><a className="text-sm" href="/">Home /</a></li>
            <li><a className="text-sm" href="#none">{dataDetail.category_id} /</a></li>
            <li><a className="text-sm">{dataDetail.product_name}</a></li>
          </ul>

          <div className="lg:grid grid-cols-5 gap-7 mt-4 ml-15">
            <ProductImageGallery
              imageUrls={dataDetail.imageUrls}
              productName={dataDetail.product_name}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />
            <ProductInfo
              product={dataDetail}
              variants={variants}
              averageRating={averageRating}
              reviewCount={reviews.length}
              onAddToCart={handleAddToCart}
              onSelectImage={setSelectedImage}
            />
          </div>

          <ProductReviews
            initialReviews={reviews}
            productId={dataDetail._id}
          />

          <RelatedProducts products={relatedProducts} />

        </div>
      ) : (
        !isLoading && (
          <div className="container text-center py-10 text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        )
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default DetailProduct;