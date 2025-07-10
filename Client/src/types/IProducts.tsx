// get products
export interface IProduct {
  id: string;
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  brand?: string;
}
// add  product
export interface IProducts {
  _id: string;
  product_name: string;
  description: string;
  basePrice: number;
  brand_id: string;
  imageUrls: string[];
  category_id: string;
  gender: string;
  material: string;
  variants?: Variant[];
}
export interface IProductDetail {
  _id: string;
  product_name: string;
  description: string;
  basePrice: number;
  imageUrls: string[];
  category_id: string;
  brand_id: string;
  gender: string;
  material: string;
  createdAt: string;
  updatedAt: string;
}


interface Variant {
  color: string;
  size: string;
  stock: number;
  price?: number;
  image: string[];
}
export interface CurrentImage {
  uid: string;
  name: string;
  url: string;
}
//brand
export interface Brand {
  _id: string;
  brand_name: string;
}
//catagory
export interface Category {
  _id: string;
  category_name: string;
}
// types/interfaces.ts
export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  bgColor: string;
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;

  onClick?: () => void;
}

export interface RevenueDataPoint {
  month: string;
  online: number;
  store: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}
