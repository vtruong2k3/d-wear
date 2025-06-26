

import AdminLayout from '../../layouts/AdminLayout'
import Categories from '../../pages/admin/PageAdmin/Categories/Categories';
import Dashboard from '../../pages/admin/PageAdmin/Dashboard/Dashboard'
import Products from '../../pages/admin/PageAdmin/Products/Products';
import LoginAdmin from '../../pages/admin/auth/LoginAdmin'
import ProductEdit from '../../pages/admin/PageAdmin/Products/ProductEdit';
import ProductAdd from '../../pages/admin/PageAdmin/Products/ProductAdd';
import Orders from '../../pages/admin/PageAdmin/Oders/Oders';
import Orderdetail from '../../pages/admin/PageAdmin/Oders/OrderDetail';
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