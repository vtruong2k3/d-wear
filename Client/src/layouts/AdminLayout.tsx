import { Outlet } from "react-router-dom";

export default function adminLayout() {
    return (
        <div className="admin-layout">
            <header>Admin Header</header>
            <aside>Sidebar</aside>
            <main>
                <Outlet />
            </main>
            <footer>Admin Footer</footer>
        </div>
    );
}