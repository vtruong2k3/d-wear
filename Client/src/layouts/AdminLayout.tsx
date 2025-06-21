import { Outlet } from "react-router-dom";
import AdminHeader from "../pages/admin/PageAdmin/Header/HeaderAdmin";
import AsideAdmin from "../pages/admin/PageAdmin/Aside/AsideAdmin";
import AdminFooter from "../pages/admin/PageAdmin/Footer/FooterAdmin";

export default function adminLayout() {
    return (
        <div className="admin-layout">
            <header><AdminHeader/></header>
            <div className="flex px-4 py-2 gap-4 bg-gray-50">
                <aside><AsideAdmin/></aside>
            <main className="p-4 bg-white rounded-xl shadow flex-1">
                <Outlet />
            </main>
            </div>
            <footer><AdminFooter/></footer>
        </div>
    );
}