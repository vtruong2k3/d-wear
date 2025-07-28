import React from 'react';
import { Grow } from "@mui/material";

interface Props {
    imageUrls: string[];
    productName: string;
    selectedImage: string | null;
    onSelectImage: (url: string) => void;
}

const ProductImageGallery: React.FC<Props> = ({ imageUrls, productName, selectedImage, onSelectImage }) => {
    return (
        <div className="col-span-3 flex gap-3">
            <ul className="flex flex-col gap-4">
                {imageUrls?.length ? (
                    imageUrls.map((url) => {
                        const fullUrl = url.startsWith("http") ? url : `http://localhost:5000/${url}`;
                        const isSelected = selectedImage === url;
                        return (
                            <li
                                key={url}
                                onClick={() => onSelectImage(url)}
                                className={`w-[82px] h-[82px] p-[10px] rounded-md !border cursor-pointer transition-colors ${isSelected ? "!border-black" : "!border-gray-300 hover:border-black"}`}
                            >
                                <img
                                    src={fullUrl}
                                    alt={`${productName} thumbnail`}
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
                {selectedImage && (
                    <Grow in={true} timeout={1000}>
                        <img
                            src={
                                selectedImage.startsWith("http")
                                    ? selectedImage
                                    : `http://localhost:5000/${selectedImage}`
                            }
                            className="w-full h-full object-cover transition-all duration-300"
                            alt={productName}
                        />
                    </Grow>
                )}
            </div>
        </div>
    );
};

export default ProductImageGallery;