import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AdminHeader from "../components/Admin/Header/Headers";
import AsideAdmin from "../components/Admin/SideBar/SideBar";
import GlobalLoading from "../components/Loading/GlobalLoading";
import { LoadingProvider } from "../contexts/LoadingContext";

import { fetchUserProfile } from "../redux/features/admin/thunks/authAdminThunk";
import type { AppDispatch, RootState } from "../redux/store";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { token, user, isInitialized } = useSelector(
    (state: RootState) => state.authAdminSlice
  );

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // ❌ Chưa xác thực → Hiển thị loading
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Đang xác thực...
      </div>
    );
  }

  // ❌ Đã xác thực nhưng không có quyền admin
  const isInvalid = !token || user?.role !== "admin";

  if (isInvalid) {
    toast.error("Vui lòng đăng nhập với tài khoản admin");
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Đã xác thực & là admin
  return (
    <LoadingProvider>
      <GlobalLoading />
      <div className="h-screen flex overflow-hidden">
        <aside
          className={`shrink-0 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
        >
          <AsideAdmin collapsed={collapsed} onCollapse={toggleCollapsed} />
        </aside>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="shrink-0 shadow-sm">
            <AdminHeader collapsed={collapsed} onCollapse={toggleCollapsed} />
          </header>

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
