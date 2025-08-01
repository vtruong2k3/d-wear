

import { Outlet } from "react-router-dom";
import Header from "../components/Client/Header/Header";
import Foorter from "../components/Client/Footers/Footer";
import '../styles/style.css'
import { LoadingProvider } from '../contexts/LoadingContext';
import GlobalLoading from '../components/Loading/GlobalLoading';
import FashionShopChat from '../components/Client/Chatbot/Chatbot';
import { useDispatch } from "react-redux";
import useAuth from "../hooks/Client/useAuth";
import { useEffect, useRef } from "react";
import { getCartThunk } from "../redux/features/client/thunks/cartThunk";
import type { AppDispatch } from "../redux/store";
const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const calledRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !calledRef.current) {
      calledRef.current = true;
      dispatch(getCartThunk());
    }
  }, [isAuthenticated, dispatch]);




  return (

    <LoadingProvider>
      <GlobalLoading />
      <div className="client-layout">
        <Header />
        <main style={{ background: "#f6f6f6" }}>

          <Outlet />
          <FashionShopChat />
        </main>
        <Foorter />
      </div>
    </LoadingProvider>

  );
};

export default Layout;

