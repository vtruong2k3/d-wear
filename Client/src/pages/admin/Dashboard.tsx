// components/Dashboard.tsx
import React from "react";
import { BarChart3, ShoppingCart, TrendingUp, Package } from "lucide-react";
import StatCard from "../../components/Admin/Dashboard/StatCard";
import RevenueChart from "../../components/Admin/Dashboard/RevenueChart";
import OrderStatusChart from "../../components/Admin/Dashboard/OrderStatusChart";

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "1,995",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: <BarChart3 />,
      bgColor: "bg-gray-700",
    },
    {
      title: "Daily Visits",
      value: "2,001",
      change: "+8.2% from yesterday",
      changeType: "positive" as const,
      icon: <ShoppingCart />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Income",
      value: "$2,632",
      change: "+15.3% from last week",
      changeType: "positive" as const,
      icon: <TrendingUp />,
      bgColor: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "1,711",
      change: "+7.8% from last month",
      changeType: "positive" as const,
      icon: <Package />,
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="flex">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div className="lg:col-span-1">
              <OrderStatusChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
