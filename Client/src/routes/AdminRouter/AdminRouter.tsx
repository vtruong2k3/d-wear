

import AdminLayout from '../../layouts/AdminLayout'
import Categories from '../../components/Admin/Categories/Categories';
import Dashboard from '../../pages/admin/Dashboard'
import Products from '../../components/Admin/Products/Products';
import LoginAdmin from '../../pages/admin/auth/LoginAdmin'
import ProductEdit from '../../components/Admin/Products/ProductEdit';
import ProductAdd from '../../components/Admin/Products/ProductAdd';
import Orders from '../../components/Admin/Oders/Oders';
import Orderdetail from '../../components/Admin/Oders/OrderDetail';
const adminRouter = [
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "products", element: <Products /> },
            { path: "products/edit/:id", element: <ProductEdit /> },
            { path: "products/add", element: <ProductAdd /> },
            { path: "categories", element: <Categories /> },
            { path: "orders", element: <Orders /> },
            { path: "orders/detail/:id", element: <Orderdetail /> },
        ],
    },
    { path: "/admin/login", element: <LoginAdmin /> }
]


export default adminRouter