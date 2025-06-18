
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'

const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        { path: "dashboard", element: <Dashboard /> }
    ],
}

export default adminRoutes;