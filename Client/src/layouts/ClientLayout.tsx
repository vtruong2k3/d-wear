
import { Outlet } from "react-router-dom";
import Header from "../components/Client/Header/Header";
import Foorter from "../components/Client/Footers/Footer";
import '../styles/style.css'
import { LoadingProvider } from '../contexts/LoadingContext';
import GlobalLoading from '../components/Loading/GlobalLoading';
const Layout = () => {
  return (

    <LoadingProvider>
      <GlobalLoading />
      <div className="client-layout">
        <Header />
        <main style={{ background: "#f6f6f6" }}>
          <Outlet />
        </main>
        <Foorter />
      </div>
    </LoadingProvider>

  );
};

export default Layout;
