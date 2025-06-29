// Nếu dùng MongoDB thì chỉ cần dùng _id:
export interface IVariants {
    id: string | number; // gán từ _id
    _id?: string;
    product_id: string;
    size: string;
    color: string;
    stock: number;
    price: number;
    image: string[]; // ✅ đúng key ảnh
}


export type VariantFormValues = Omit<IVariants, 'id' | 'imageVariant'>;
export interface IProductOption {
    _id: string;
    product_name: string;
    label?: string; // nếu dùng với Select
    value?: string;
}