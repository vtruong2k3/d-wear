import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminHeader from "../components/Admin/Header/Headers";
import AsideAdmin from "../components/Admin/SideBar/SideBar";
import { LoadingProvider } from "../contexts/LoadingContext";
import GlobalLoading from "../components/Loading/GlobalLoading";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const { token, user } = useSelector((state: RootState) => state.authAdminSlice)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      toast.error("Vui lòng đăng nhập với tài khoản admin");
    }
  }, [token, user]);
  if (!token || user?.role !== "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <LoadingProvider>
      <GlobalLoading />
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar cố định bên trái */}
        <aside
          className={`shrink-0 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
            }`}
        >
          <AsideAdmin collapsed={collapsed} onCollapse={toggleCollapsed} />
        </aside>

        {/* Phần bên phải chứa header và main */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header cố định trên cùng */}
          <header className="shrink-0 shadow-sm ">
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
    </LoadingProvider>
  );
}
