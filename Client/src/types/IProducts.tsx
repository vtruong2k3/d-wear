export interface IProduct {
  id: number;
  product_name: string;
  basePrice: number;
  brand_id: string;
  description: string;
  category_id?: string;
  gender: string,
  material: string,
  productImage: [];
}
// types/interfaces.ts
export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  bgColor: string;
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: ()=>void;
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