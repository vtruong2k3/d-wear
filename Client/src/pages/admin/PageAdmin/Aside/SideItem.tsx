// components/SidebarItem.tsx
import React from "react";
import type { SidebarItemProps } from "../../../../types/IProducts";

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
        isActive
          ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600"
          : "text-gray-600"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default SidebarItem;
