import React, { useEffect, useState } from 'react';

interface Props {
    imageUrls: string[];
    productName: string;
    selectedImage: string | null;
    onSelectImage: (url: string) => void;
}

const ProductImageGallery: React.FC<Props> = ({ imageUrls, productName, selectedImage, onSelectImage }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, [selectedImage]);

    return (
        <div className="col-span-12 lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 lg:sticky lg:top-24 h-max">
            {/* Thumbnails (Horizontal on mobile, Vertical on Desktop) */}
            <ul className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {imageUrls?.length ? (
                    imageUrls.map((url) => {
                        const fullUrl = url.startsWith("http") ? url : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${url}`;
                        const isSelected = selectedImage === url;
                        return (
                            <li
                                key={url}
                                onClick={() => onSelectImage(url)}
                                className={`flex-shrink-0 w-[70px] h-[70px] lg:w-[82px] lg:h-[82px] p-1 rounded-lg border-2 cursor-pointer transition-all duration-300 ${isSelected ? "border-black shadow-md" : "border-transparent hover:border-gray-300"}`}
                            >
                                <img
                                    src={fullUrl}
                                    alt={`${productName} thumbnail`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </li>
                        );
                    })
                ) : (
                    <li className="text-sm text-gray-400">Không có hình ảnh</li>
                )}
            </ul>

            {/* Main Image */}
            <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50 aspect-[4/5] lg:aspect-auto lg:h-[85vh] relative group cursor-crosshair">
                {selectedImage && (
                    <img
                        src={
                            selectedImage.startsWith("http")
                                ? selectedImage
                                : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${selectedImage}`
                        }
                        className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} group-hover:scale-125`}
                        alt={productName}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductImageGallery;