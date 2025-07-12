import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Backdrop, CircularProgress, Grow } from "@mui/material";


import ico_eye from "../../../assets/images/ico_eye.png";
import ico_fire from "../../../assets/images/ico_fire.png";
import ico_checked from "../../../assets/images/ico_checked.png";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_reload from "../../../assets/images/ico_reload.png";
import ico_question from "../../../assets/images/ico_question.png";
import ico_shipping from "../../../assets/images/ico_shipping.png";
import ico_shipping2 from "../../../assets/images/ico_shipping2.png";
import ico_share from "../../../assets/images/ico_share.png";
import ico_check from "../../../assets/images/ico_check.png";
import img_payment from "../../../assets/images/img_payment.avif";

import apiServiceProduct from "../../../services/client/apiServiceProduct";
import useAuth from "../../../hooks/Client/useAuth";

import BoxProduct from "../../../components/Client/BoxProduct/BoxProduct";
import useFetchGetDataProduct from "../../../hooks/Client/useFetchGetDataProduct";
import type { IProductDetail } from "../../../types/IProducts";
import type { IVariantDetail } from "../../../types/IVariants";
import toast from "react-hot-toast";
import '../../../styles/productDetail.css'

import star from "../../../assets/images/ico_star_active.png";
import { formatCurrency } from "../../../utils/Format";

import type { AppDispatch } from "../../../redux/store";
import { addToCartThunk } from "../../../redux/features/client/thunks/cartThunk";
const DetailProduct = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { requireAuth } = useAuth();

  const [dataDetail, setDataDetail] = useState<IProductDetail | null>(null);
  const [variants, setVariants] = useState<IVariantDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<IVariantDetail | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { products } = useFetchGetDataProduct(
    dataDetail?.category_id || "",
    dataDetail?._id || ""
  );

  // Lấy danh sách màu sắc và size duy nhất
  // const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const uniqueSizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

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
          // Tự động chọn variant đầu tiên
          if (variantList && variantList.length > 0) {
            setSelectedVariant(variantList[0]);
            setSelectedColor(variantList[0].color || "");
            setSelectedSize(variantList[0].size || "");
          }
        } else {
          setDataDetail(null);
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        setDataDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataDetailProduct();
  }, [id]);
  useEffect(() => {
    if (dataDetail?.imageUrls?.length) {
      setSelectedImage(dataDetail.imageUrls[0]);
    }
  }, [dataDetail]);

  // Xử lý khi chọn màu sắc
  // const handleColorSelect = (color: string) => {
  //   setSelectedColor(color);
  //   // Tìm variant phù hợp với màu đã chọn
  //   const matchingVariant = variants.find(v =>
  //     v.color === color && (!selectedSize || v.size === selectedSize)
  //   );
  //   if (matchingVariant) {
  //     setSelectedVariant(matchingVariant);
  //   }
  // };
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);

    // Lọc các biến thể có cùng màu
    const matchingColorVariants = variants.filter((v) => v.color === color);

    // Kiểm tra xem size hiện tại có còn trong màu mới không
    const sameSizeVariant = matchingColorVariants.find((v) => v.size === selectedSize);

    if (sameSizeVariant && sameSizeVariant.stock > 0) {
      // Nếu vẫn còn size đó, dùng luôn
      setSelectedSize(sameSizeVariant.size);
      setSelectedVariant(sameSizeVariant);
      setSelectedImage(sameSizeVariant.image?.[0] || null);
      return;
    }

    // Nếu size hiện tại không còn → tìm size đầu tiên còn hàng
    const firstAvailableVariant = matchingColorVariants.find((v) => v.stock > 0);

    if (firstAvailableVariant) {
      setSelectedSize(firstAvailableVariant.size);
      setSelectedVariant(firstAvailableVariant);
      setSelectedImage(firstAvailableVariant.image?.[0] || null);
    } else {
      // Không có size nào còn hàng
      setSelectedSize("");
      setSelectedVariant(null);
    }
  };


  // Xử lý khi chọn size
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Tìm variant phù hợp với size đã chọn
    const matchingVariant = variants.find(v =>
      v.size === size && (!selectedColor || v.color === selectedColor)
    );
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    const maxStock = selectedVariant?.stock || 0;

    if (type === 'increase') {
      setQuantity((prev) => {
        if (prev >= maxStock) {
          toast.error(`Chỉ còn ${maxStock} sản phẩm trong kho`);
          return prev;
        }
        return prev + 1;
      });
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };


  const handleAddToCart = (item: IProductDetail) => {
    if (variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn biến thể sản phẩm");
      return;
    }

    if (selectedVariant && selectedVariant.stock === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (selectedVariant && quantity > selectedVariant.stock) {
      toast.error(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho`);
      return;
    }
    if (!selectedVariant) {
      toast.error("Vui lòng chọn biến thể sản phẩm");
      return;
    }
    requireAuth(() => {
      const finalItem = {

        product_id: item._id,
        quantity,
        variant_id: selectedVariant._id,

      };

      dispatch(addToCartThunk(finalItem))


    });
  };

  return (
    <>
      {dataDetail ? (
        <div className="container" ref={divRef}>
          <ul className="flex gap-2 items-center py-4">
            <li>
              <a className="text-sm" href="/">
                Home /
              </a>
            </li>
            <li>
              <a className="text-sm" href="#none">
                {dataDetail.category_id} /
              </a>
            </li>
            <li>
              <a className="text-sm">{dataDetail.product_name}</a>
            </li>
          </ul>

          <div className="lg:grid grid-cols-5 gap-7 mt-4 ml-15">
            <div className="col-span-3 flex gap-3">
              <ul className="flex flex-col gap-4">
                {dataDetail.imageUrls?.length ? (
                  dataDetail.imageUrls.map((url) => {
                    const fullUrl = url.startsWith("http") ? url : `http://localhost:5000/${url}`;
                    const isSelected = selectedImage === url;
                    return (
                      <li
                        key={url}
                        onClick={() => setSelectedImage(url)}
                        className={`w-[82px] h-[82px] p-[10px] rounded-md border cursor-pointer transition-colors ${isSelected ? "border-black" : "border-gray-300 hover:border-black"
                          }`}
                      >
                        <img
                          src={fullUrl}
                          alt=""
                          className="w-full h-full object-cover rounded"
                        />
                      </li>
                    );
                  })
                ) : (
                  <li className="text-sm text-gray-400">Không có hình ảnh</li>
                )}
              </ul>

              <div className="rounded-xl overflow-hidden w-[600px] h-[750px] flex items-center justify-center bg-gray-100">
                <Grow in={true} timeout={1000}>
                  <img
                    src={
                      selectedImage?.startsWith("http")
                        ? selectedImage
                        : `http://localhost:5000/${selectedImage}`
                    }
                    className="w-full h-full object-cover transition-all duration-300"
                    alt=""
                  />
                </Grow>
              </div>
            </div>


            <div className="col-span-2 mt-6">
              <h2 className="text-xl lg:text-3xl font-semibold">
                {dataDetail.product_name}
              </h2>
              <ul className="flex items-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <li key={i}>
                    <img
                      className="size-[16px]"
                      src={star}
                      alt=""
                    />
                  </li>
                ))}

              </ul>

              <div className="mt-3 flex items-center gap-3">
                <p className="text-2xl font-semibold text-red-600">
                  {formatCurrency(selectedVariant?.price || dataDetail.basePrice)}
                </p>

                <p className="text-lg text-gray-400 line-through opacity-60">
                  {formatCurrency(dataDetail.basePrice)}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-gray">
                <p className="flex items-center gap-2 mt-2">
                  <img className="w-5 animate-flicker" src={ico_eye} alt="" />
                  <span className="text-sm font-medium">
                    35 people are viewing this right now
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-4">
                  <img
                    className="w-5 animate-zoomInOut"
                    src={ico_fire}
                    alt=""
                  />
                  <span className="text-sm font-medium text-red-600">
                    35 sold in last 18 hours
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-6">
                  <img className="w-5" src={ico_checked} alt="" />
                  <span className="text-sm font-medium text-green">
                    {selectedVariant ? (
                      selectedVariant.stock > 0 ? (
                        <>Còn {selectedVariant.stock} sản phẩm</>
                      ) : (
                        <span className="text-red-600">Hết hàng</span>
                      )
                    ) : (
                      "In stock"
                    )}
                  </span>
                </p>

                <div className="flex gap-3 flex-wrap">
                  {[
                    ...new Map(variants.map((v) => [v.color, v])).values()
                  ].map((colorVariant) => {
                    const color = colorVariant.color;
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`relative flex items-center gap-2 p-2 border rounded-md text-xs transition-all ${selectedColor === color
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                          }`}
                      >
                        {colorVariant.image?.[0] && (
                          <div className="w-8 h-8 overflow-hidden border border-gray-200 rounded-md">
                            <img
                              src={
                                colorVariant.image[0].startsWith("http")
                                  ? colorVariant.image[0]
                                  : `http://localhost:5000/${colorVariant.image[0]}`
                              }
                              alt={color}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="font-medium">{color}</span>

                        {selectedColor === color && (
                          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow">
                            <span className="text-white text-[10px] font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>




                {/* Chọn size */}
                {/* // Phần code cải thiện cho việc chọn size */}
                {uniqueSizes.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-3">Kích thước:</p>
                    <div className="flex gap-2 flex-wrap">
                      {uniqueSizes.map((size) => {
                        // Tìm variant tương ứng với size và màu đã chọn
                        const sizeVariant = variants.find(v =>
                          v.size === size &&
                          (!selectedColor || v.color === selectedColor)
                        );

                        // Kiểm tra stock
                        const isOutOfStock = !sizeVariant || sizeVariant.stock === 0;
                        const isSelected = selectedSize === size;

                        return (
                          <button
                            key={size}
                            onClick={() => !isOutOfStock && handleSizeSelect(size)}
                            disabled={isOutOfStock}
                            className={`relative px-4 py-2 border rounded-lg text-sm font-medium transition-all ${isSelected
                              ? "bg-black text-white border-black shadow-md"
                              : isOutOfStock
                                ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed opacity-50"
                                : "bg-white text-black border-gray-300 hover:border-black hover:shadow-sm"
                              }`}
                          >
                            {size}

                            {/* Hiển thị số lượng stock nếu còn hàng */}
                            {sizeVariant && sizeVariant.stock > 0 && (
                              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                {sizeVariant.stock}
                              </span>
                            )}




                          </button>
                        );
                      })}
                    </div>

                    {/* Thông báo khi không có size nào khả dụng */}
                    {selectedColor && uniqueSizes.every(size => {
                      const sizeVariant = variants.find(v =>
                        v.size === size && v.color === selectedColor
                      );
                      return !sizeVariant || sizeVariant.stock === 0;
                    }) && (
                        <p className="text-sm text-red-500 mt-2 italic">
                          Màu {selectedColor} hiện tại đã hết hàng tất cả size
                        </p>
                      )}
                  </div>
                )}


                <div className="mt-6 flex gap-3">
                  {/* Nút tăng giảm số lượng cải tiến */}
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="w-12 h-12 flex items-center justify-center text-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selectedVariant?.stock || 999}
                      value={quantity}
                      onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value) || 1);
                        const maxStock = selectedVariant?.stock || 999;
                        setQuantity(Math.min(value, maxStock));
                      }}
                      className="w-16 h-12 text-center border-x border-gray-300 outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="w-12 h-12 flex items-center justify-center text-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(dataDetail)}
                    className="h-12 bg-black text-white rounded-lg px-6 flex-1 hover:bg-gray-800 transition-colors"
                  >
                    Add To Cart
                  </button>

                  <button className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors">
                    <img className="w-5" src={ico_heart} alt="" />
                  </button>
                </div>


                {/* // Hoặc version với animation mượt mà hơn: */}
                <div className="mt-5">
                  <div className={`text-midGray leading-relaxed transition-all duration-300 ${showFullDescription ? 'max-h-none' : 'max-h-20 overflow-hidden'
                    }`}>
                    <p>{dataDetail.description}</p>
                  </div>

                  {/* Nút xem thêm */}
                  {dataDetail.description && dataDetail.description.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
                    >
                      {showFullDescription ? (
                        <>
                          <span>Thu gọn</span>
                          <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Xem thêm</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <ul className="flex gap-4 mt-6">
                  <li>
                    <button className="flex gap-2 text-sm hover:text-black transition-colors">
                      <img className="w-4" src={ico_reload} alt="" />
                      Compare
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-2 text-sm hover:text-black transition-colors">
                      <img className="w-4" src={ico_question} alt="" />
                      Question
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-2 text-sm hover:text-black transition-colors">
                      <img className="w-4" src={ico_shipping} alt="" />
                      Shipping info
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-2 text-sm hover:text-black transition-colors">
                      <img className="w-4" src={ico_share} alt="" />
                      Share
                    </button>
                  </li>
                </ul>

                <div className="flex mt-6 mb-6 pt-6 pb-6 border-t border-b">
                  <img className="w-9" src={ico_shipping2} alt="" />
                  <p className="ml-4 pl-4 border-l text-sm">
                    Order in the next 22 hours 45 minutes to get it between
                    <br />
                    <span className="font-semibold underline">
                      Tuesday, Oct 22
                    </span>
                    <span className="mx-2">and</span>
                    <span className="font-semibold underline">
                      Saturday, Oct 26
                    </span>
                  </p>
                </div>

                <div className="p-4 border rounded-xl flex gap-3">
                  <img src={ico_check} className="w-6" alt="" />
                  <div className="text-sm">
                    <p>
                      Pickup available at{" "}
                      <span className="font-semibold">Akaze store</span>
                    </p>
                    <p className="text-xs">Usually ready in 24 hours</p>
                    <button className="underline text-xs mt-1 hover:text-black transition-colors">
                      View store information
                    </button>
                  </div>
                </div>

                <div className="text-center mt-6 p-6 bg-[#f6f6f6] rounded-lg">
                  <p className="text-sm tracking-widest">
                    Guaranteed Checkout
                  </p>
                  <img className="mt-3" src={img_payment} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 mb-32">
            <h2 className="text-center text-xl lg:text-3xl font-semibold">
              Sản phẩm liên quan
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {products.length ? (
                products.slice(0, 8).map((item) => (
                  <BoxProduct key={item._id} item={item} />
                ))
              ) : (
                <li className="col-span-full text-center text-gray-400">
                  Không có sản phẩm liên quan
                </li>
              )}
            </ul>
          </div>
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