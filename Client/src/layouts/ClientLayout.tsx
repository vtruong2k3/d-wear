// import { Outlet } from "react-router-dom";

// export default function adminLayout() {
//     return (
//         <div className="admin-layout">
//             <header>Admin Header</header>
//             <aside>Sidebar</aside>
//             <main>
//                 <Outlet />
//             </main>
//             <footer>Admin Footer</footer>
//         </div>
//     );
// }
import { Outlet } from "react-router-dom";
import Header from "../components/Client/Header/Header";
import Foorter from "../components/Client/Footers/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ background: "#f6f6f6" }}>
        <Outlet />
      </main>
      <Foorter />
    </>
  );
};

export default Layout;
