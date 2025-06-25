import { Outlet } from "react-router-dom";
import AdminHeader from "../pages/admin/PageAdmin/Header/HeaderAdmin";
import AsideAdmin from "../pages/admin/PageAdmin/Aside/SideBar";

export default function AdminLayout() {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header cố định trên cùng */}
            <header className="shrink-0">
                <AdminHeader />
            </header>

            {/* Phần dưới chia làm sidebar và main */}
            <div className="flex flex-1 overflow-hidden bg-gray-50 px-4 py-2 gap-4">
                {/* Sidebar không cuộn */}
                <aside className="shrink-0">
                    <AsideAdmin />
                </aside>

                {/* Main có thể cuộn khi nội dung dài */}
                <main className="flex-1 overflow-y-auto p-4 bg-white rounded-xl shadow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
