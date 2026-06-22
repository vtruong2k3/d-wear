import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Spin } from "antd";

import AdminHeader from "../components/Admin/Header/Headers";
import AsideAdmin from "../components/Admin/SideBar/SideBar";
import GlobalLoading from "../components/Loading/GlobalLoading";
import { LoadingProvider } from "../contexts/LoadingContext";

import { fetchUserProfile } from "../redux/features/admin/thunks/authAdminThunk";
import type { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/features/admin/adminSlice";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { token, user, isInitialized } = useSelector(
    (state: RootState) => state.authAdminSlice
  );

  // Fetch user info on load
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  // Handle invalid authentication properly via side-effect
  useEffect(() => {
    if (isInitialized) {
      const isInvalid = !token || (user && user.role !== "admin");
      if (isInvalid) {
        // Chỉ hiện thông báo nếu họ đã từng cố gắng đăng nhập hoặc bị timeout
        if (token || user) {
          toast.error("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập.");
        }
        dispatch(logout());
      }
    }
  }, [isInitialized, token, user, dispatch]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Nếu không có token từ đầu, đá ra màn hình login ngay lập tức
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Chưa xác thực xong user → Hiển thị loading spinner
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 font-medium">Đang xác thực quyền Admin...</p>
        </div>
      </div>
    );
  }

  // Đã xác thực nhưng không có quyền admin (Trường hợp bảo vệ thêm)
  const isInvalid = user && user.role !== "admin";
  if (isInvalid) {
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
