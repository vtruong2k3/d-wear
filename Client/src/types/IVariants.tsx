import type { UploadFile } from "antd";

// Nếu dùng MongoDB thì chỉ cần dùng _id:
export interface IVariants {
    id: string | number; // gán từ _id
    _id: string;
    product_id: { _id: string; product_name: string } | null;
    size: string;
    color: string;
    stock: number;
    price: number;
    image: string[]; // ✅ đúng key ảnh
}

export interface VariantForm {
    _id?: string;
    size: string;
    color: string;
    price: number | undefined;
    stock: number;
    image: UploadFile[];
}
export type VariantFormValues = Omit<IVariants, 'id' | 'imageVariant'>;
export interface IProductOption {
    _id: string;
    product_name: string;
    label?: string; // nếu dùng với Select
    value?: string;
}
export interface UploadFileWithRaw extends UploadFile {
    rawFileName?: string;
}