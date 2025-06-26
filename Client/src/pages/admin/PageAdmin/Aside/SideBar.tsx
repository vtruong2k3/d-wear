// components/Sidebar.tsx
import React from "react";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Percent,
  Archive,
  Settings,
} from "lucide-react";
import SidebarItem from "./SideItem";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Customers",
      path: "/admin/customers",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      path: "/admin/products",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Orders",
      path: "/admin/orders",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Categories",
      path: "/admin/categories",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "Discount",
      path: "/admin/discount",
    },
    {
      icon: <Archive className="w-5 h-5" />,
      label: "Inventory",
      path: "/admin/inventory",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/admin/settings",
    },
  ];
  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    // Kiểm tra nếu path hiện tại bắt đầu với menu path
    return location.pathname.startsWith(path);
  };
  return (
    <aside className="bg-white border-r border-gray-200 w-64 h-screen shadow-md">
      <nav className="pt-6 px-4 space-y-1">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
            onClick={() => handleItemClick(item.path)}
          />
        ))}
      </nav>
    </aside>

  );
};

export default Sidebar;
