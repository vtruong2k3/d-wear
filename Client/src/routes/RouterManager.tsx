import React, { Suspense, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../configs/AxiosConfig";
import { fetchUserProfile as fetchClientProfile } from "../redux/features/client/thunks/authUserThunk";
import { fetchUserProfile as fetchAdminProfile } from "../redux/features/admin/thunks/authAdminThunk";
import clientRoutes from "./ClientRouter/routing";
import adminRoutes from "./AdminRouter/AdminRouter";

export default function RoutesManager() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
        if (res.data.token) {
           setAccessToken(res.data.token);
           // Tải thông tin user (Client + Admin) sau khi đã có token trong Memory
           await Promise.all([
             dispatch(fetchClientProfile() as any),
             dispatch(fetchAdminProfile() as any)
           ]);
        }
      } catch (err) {
        // Nếu không có cookie hoặc cookie hết hạn, bỏ qua, user sẽ bị coi là chưa đăng nhập
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, [dispatch]);

  const element = useRoutes([...clientRoutes, ...adminRoutes]);
  
  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen w-full"><Spin size="large" /></div>;
  }
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen w-full"><Spin size="large" /></div>}>
      {element}
    </Suspense>
  );
}
