import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminHeader from "../components/Admin/Header/Headers";
import AsideAdmin from "../components/Admin/SideBar/SideBar";
import { LoadingProvider } from '../contexts/LoadingContext';
import GlobalLoading from '../components/Loading/GlobalLoading';
import { toast } from "react-toastify";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem('token');
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };



  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }
  return (
    <LoadingProvider>
      <GlobalLoading />
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar cố định bên trái */}
        <aside className={`shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
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