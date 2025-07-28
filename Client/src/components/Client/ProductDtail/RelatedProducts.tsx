import React from 'react';
import BoxProduct from '../BoxProduct/BoxProduct';
import type { IProducts } from '../../../types/IProducts'; // Hoặc type phù hợp cho BoxProduct

interface Props {
    products: IProducts[];
}

const RelatedProducts: React.FC<Props> = ({ products }) => {
    return (
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
    );
};

export default RelatedProducts;