import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

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
import type { ErrorType } from "../../../types/error/IError";
import type { checkOrderReviewType } from "../../../types/order/IOrder";
import { checkReviewProduct } from "../../../services/client/orderAPI";
import type { IReview } from "../../../types/IReview";
import { useLoading } from "../../../contexts/LoadingContext";
import { fetcheGetRivew } from "../../../services/client/reviewService";

// Interface cho đánh giá


const DetailProduct = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { requireAuth } = useAuth();

  const [dataDetail, setDataDetail] = useState<IProductDetail | null>(null);
  const [variants, setVariants] = useState<IVariantDetail[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const { setLoading } = useLoading();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [checkReview, setCheckRivew] = useState<checkOrderReviewType>()
  const { products: relatedProducts } = useFetchGetDataProduct(
    dataDetail?.category_id || "",
    dataDetail?._id || ""
  );

  useEffect(() => {
    if (!id) return;
    divRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const fetchDataDetailProduct = async () => {
      setLoading(true);
      try {
        const res = await apiServiceProduct.getDetailProduct(id);
        const product = res?.data?.product;
        const variantList = res?.data?.variants;

        if (product) {
          setDataDetail(product);
          setVariants(variantList || []);
          setSelectedImage(product.imageUrls?.[0] || null);

          // Mock data cho reviews (thay thế bằng API thật nếu có)

        } else {
          setDataDetail(null);
          toast.error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDataDetailProduct();
  }, [id, setLoading]);

  const getAllReview = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetcheGetRivew(id)
      setReviews(res)
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [setLoading, id])

  useEffect(() => {
    getAllReview()
  }, [getAllReview])
  const checkReviewUser = useCallback(async () => {
    try {
      const res = await checkReviewProduct(id)
      setCheckRivew(res)
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  }, [id])

  useEffect(() => {

    checkReviewUser()

  }, [checkReviewUser])
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
            chechShowFormReview={checkReview}
          />

          <RelatedProducts products={relatedProducts} />

        </div>
      ) : (

        <div className="container text-center py-10 text-gray-500">
          Không tìm thấy sản phẩm
        </div>

      )}


    </>
  );
};

export default DetailProduct;