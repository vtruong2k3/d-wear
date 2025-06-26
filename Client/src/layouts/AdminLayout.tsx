import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/Admin/Header/Header";
import AsideAdmin from "../components/Admin/SideBar/SideBar";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Sidebar cố định bên trái */}
            <aside className={`shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
                <AsideAdmin collapsed={collapsed} onCollapse={toggleCollapsed} />
            </aside>

            {/* Phần bên phải chứa header và main */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header cố định trên cùng */}
                <header className="shrink-0 bg-white shadow-sm border-b">
                    <AdminHeader collapsed={collapsed} onCollapse={toggleCollapsed} />
                </header>

                {/* Main content có thể cuộn */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="bg-white rounded-xl shadow p-6 min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}