import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";

// import ico_eye from "../../../assets/images/ico_eye.png";
// import ico_fire from "../../../assets/images/ico_fire.png";
import ico_checked from "../../../assets/images/ico_checked.png";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_reload from "../../../assets/images/ico_reload.png";
import ico_question from "../../../assets/images/ico_question.png";
import ico_shipping from "../../../assets/images/ico_shipping.png";
import ico_shipping2 from "../../../assets/images/ico_shipping2.png";
import ico_share from "../../../assets/images/ico_share.png";
import ico_check from "../../../assets/images/ico_check.png";
import img_payment from "../../../assets/images/img_payment.avif";
import star from "../../../assets/images/ico_star_active.png";

import { formatCurrency } from "../../../utils/Format";
import type { IProductDetail } from "../../../types/IProducts";
import type { IVariantDetail } from "../../../types/IVariants";

interface Props {
    product: IProductDetail;
    variants: IVariantDetail[];
    averageRating: string;
    reviewCount: number;
    onAddToCart: (variantId: string, quantity: number) => void;
    onSelectImage: (url: string | null) => void;
}

const ProductInfo: React.FC<Props> = ({ product, variants, averageRating, reviewCount, onAddToCart, onSelectImage }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<IVariantDetail | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        if (variants && variants.length > 0) {
            const firstVariant = variants[0];
            setSelectedVariant(firstVariant);
            setSelectedColor(firstVariant.color || "");
            setSelectedSize(firstVariant.size || "");
        }
    }, [variants]);

    const uniqueSizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        const matchingColorVariants = variants.filter((v) => v.color === color);
        const sameSizeVariant = matchingColorVariants.find((v) => v.size === selectedSize);

        let newVariant: IVariantDetail | null = null;
        if (sameSizeVariant && sameSizeVariant.stock > 0) {
            newVariant = sameSizeVariant;
        } else {
            newVariant = matchingColorVariants.find((v) => v.stock > 0) || null;
        }

        if (newVariant) {
            setSelectedVariant(newVariant);
            setSelectedSize(newVariant.size);
            onSelectImage(newVariant.image?.[0] || product.imageUrls[0] || null);
        } else {
            setSelectedVariant(null);
            setSelectedSize("");
            onSelectImage(product.imageUrls[0] || null);
        }
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        const matchingVariant = variants.find(v => v.size === size && v.color === selectedColor);
        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            onSelectImage(matchingVariant.image?.[0] || product.imageUrls[0] || null); // ✅ Thêm dòng này
        } else {
            onSelectImage(product.imageUrls[0] || null); // ❗️Thêm dòng fallback nếu không tìm thấy
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

    const handleAddToCartClick = () => {
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
        onAddToCart(selectedVariant._id, quantity);
    };

    return (
        <div className="col-span-12 lg:col-span-5">
            {/* --- GROUP 1: Title & Price & Rating --- */}
            <div className="mb-6">
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                    {product.product_name}
                </h2>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-gray-900">{averageRating}</span>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    className="w-4 h-4"
                                    src={star}
                                    alt="star"
                                    style={{
                                        opacity: i < Math.floor(parseFloat(averageRating)) ? 1 : 0.3
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900">
                        {reviewCount} Đánh giá
                    </span>
                </div>

                <div className="flex items-end gap-3">
                    <p className="text-3xl font-black text-red-600">
                        {formatCurrency(selectedVariant?.price || product.basePrice)}
                    </p>
                    <p className="text-lg text-gray-400 line-through font-semibold mb-0.5">
                        {formatCurrency(product.basePrice)}
                    </p>
                </div>
            </div>

            {/* --- GROUP 2: Variants & Stock --- */}
            <div className="pt-6 border-t border-gray-100">
                {/* <p className="flex items-center gap-2 mt-2">
                    <img className="w-5 animate-flicker" src={ico_eye} alt="" />
                    <span className="text-sm font-medium">35 people are viewing this right now</span>
                </p>
                <p className="flex items-center gap-2 mt-4">
                    <img className="w-5 animate-zoomInOut" src={ico_fire} alt="" />
                    <span className="text-sm font-medium text-red-600">35 sold in last 18 hours</span>
                </p> */}
                <p className="flex items-center gap-2 mb-6">
                    <img className="w-5" src={ico_checked} alt="" />
                    <span className="text-sm font-medium text-green-600">
                        {selectedVariant ? (
                            selectedVariant.stock > 0 ? (
                                <>Còn {selectedVariant.stock} sản phẩm</>
                            ) : (
                                <span className="text-red-600">Hết hàng</span>
                            )
                        ) : (
                            "Còn hàng"
                        )}
                    </span>
                </p>

                <div className="mt-6">
                    <p className="text-sm font-medium mb-3">Màu sắc:</p>
                    <div className="flex gap-3 flex-wrap">
                        {[...new Map(variants.map((v) => [v.color, v])).values()].map((colorVariant) => {
                            const color = colorVariant.color;
                            return (
                                <button
                                    key={color}
                                    onClick={() => handleColorSelect(color)}
                                    className={`relative flex items-center gap-2 p-1 border rounded-lg text-sm font-medium transition-all ${selectedColor === color
                                        ? "border-black border-[2px] bg-white text-black"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                                        }`}
                                >
                                    {colorVariant.image?.[0] && (
                                        <div className="w-8 h-8 overflow-hidden rounded-md">
                                            <img
                                                src={
                                                    colorVariant.image[0].startsWith("http")
                                                        ? colorVariant.image[0]
                                                        : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${colorVariant.image[0]}`
                                                }
                                                alt={color}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <span className="font-medium px-1">{color}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {uniqueSizes.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm font-medium mb-3">Kích thước:</p>
                        <div className="flex gap-2 flex-wrap">
                            {uniqueSizes.map((size) => {
                                const sizeVariant = variants.find(v =>
                                    v.size === size &&
                                    (!selectedColor || v.color === selectedColor)
                                );
                                const isOutOfStock = !sizeVariant || sizeVariant.stock === 0;
                                const isSelected = selectedSize === size;

                                return (
                                    <button
                                        key={size}
                                        onClick={() => !isOutOfStock && handleSizeSelect(size)}
                                        disabled={isOutOfStock}
                                        className={`relative min-w-[3.5rem] px-5 py-2.5 flex items-center justify-center border rounded-lg text-sm font-semibold transition-all ${isSelected
                                            ? "bg-black text-white border-black"
                                            : isOutOfStock
                                                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed line-through"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>

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

                {/* --- GROUP 3: Call to Action (Grid) --- */}
                <div className="mt-10 mb-8 grid grid-cols-12 gap-3 items-center">
                    {/* Quantity Selector */}
                    <div className="col-span-12 xl:col-span-4 flex items-center justify-between border border-gray-300 rounded-xl px-2 h-14 bg-white">
                        <button
                            onClick={() => handleQuantityChange('decrease')}
                            className="w-10 h-10 flex items-center justify-center text-2xl font-light hover:bg-gray-100 rounded-lg transition-colors"
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
                            className="w-full h-full text-center text-lg font-medium outline-none bg-transparent"
                        />
                        <button
                            onClick={() => handleQuantityChange('increase')}
                            className="w-10 h-10 flex items-center justify-center text-2xl font-light hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            +
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCartClick}
                        className="col-span-9 xl:col-span-6 h-14 bg-black text-white rounded-xl text-lg font-bold flex items-center justify-center hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-black/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Thêm vào giỏ hàng
                    </button>

                    {/* Wishlist Button */}
                    <button className="col-span-3 xl:col-span-2 h-14 bg-white border border-gray-300 rounded-xl flex items-center justify-center hover:border-black hover:bg-gray-50 transition-all">
                        <img className="w-6 opacity-60 hover:opacity-100" src={ico_heart} alt="wishlist" />
                    </button>
                </div>

                {/* --- GROUP 4: Description & Policy --- */}
                <div className="pt-8 border-t border-gray-100">
                    <div className={`text-midGray leading-relaxed transition-all duration-300 ${showFullDescription ? 'max-h-none' : 'max-h-20 overflow-hidden'}`}>
                        <p>{product.description}</p>
                    </div>

                    {product.description && product.description.length > 150 && (
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
                            <img className="w-4" src={ico_reload} alt="" /> Compare
                        </button>
                    </li>
                    <li>
                        <button className="flex gap-2 text-sm hover:text-black transition-colors">
                            <img className="w-4" src={ico_question} alt="" /> Question
                        </button>
                    </li>
                    <li>
                        <button className="flex gap-2 text-sm hover:text-black transition-colors">
                            <img className="w-4" src={ico_shipping} alt="" /> Shipping info
                        </button>
                    </li>
                    <li>
                        <button className="flex gap-2 text-sm hover:text-black transition-colors">
                            <img className="w-4" src={ico_share} alt="" /> Share
                        </button>
                    </li>
                </ul>

                <div className="flex mt-6 mb-6 pt-6 pb-6 !border-t !border-b">
                    <img className="w-9" src={ico_shipping2} alt="" />
                    <p className="ml-4 pl-4 !border-l text-sm">
                        Order in the next 22 hours 45 minutes to get it between
                        <br />
                        <span className="font-semibold underline">Tuesday, Oct 22</span>
                        <span className="mx-2">and</span>
                        <span className="font-semibold underline">Saturday, Oct 26</span>
                    </p>
                </div>

                <div className="p-4 !border rounded-xl flex gap-3">
                    <img src={ico_check} className="w-6" alt="" />
                    <div className="text-sm">
                        <p>Pickup available at <span className="font-semibold">Akaze store</span></p>
                        <p className="text-xs">Usually ready in 24 hours</p>
                        <button className="underline text-xs mt-1 hover:text-black transition-colors">
                            View store information
                        </button>
                    </div>
                </div>

                <div className="text-center mt-10 p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Thanh toán an toàn</p>
                    <img className="mt-3" src={img_payment} alt="" />
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;