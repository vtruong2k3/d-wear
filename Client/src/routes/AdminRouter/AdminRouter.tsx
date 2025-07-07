import AdminLayout from "../../layouts/AdminLayout";
import Categories from "../../pages/admin/PageAdmin/Categories/CategoriesList";
import Dashboard from "../../pages/admin/PageAdmin/Dashboard/Dashboards";
import Products from "../../pages/admin/PageAdmin/Products/Products";
import LoginAdmin from "../../pages/admin/auth/LoginAdmin";
import ProductEdit from "../../pages/admin/PageAdmin/Products/ProductEdit";
import ProductAdd from "../../pages/admin/PageAdmin/Products/ProductAdd";
import Orders from "../../pages/admin/PageAdmin/Orders/Orders";
import Orderdetail from "../../pages/admin/PageAdmin/Orders/OrderDetail";
import Brand from "../../pages/admin/PageAdmin/Brand/Brand";
import Voucher from "../../pages/admin/PageAdmin/Voucher/Voucher";
import Variants from "../../pages/admin/PageAdmin/Variants/Variants";

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
      { path: "variants", element: <Variants /> },

      { path: "orders", element: <Orders /> },
      { path: "orders/detail/:id", element: <Orderdetail /> },
      { path: "brands", element: <Brand /> },
      { path: "voucher", element: <Voucher /> },
    ],
  },
  { path: "/admin/login", element: <LoginAdmin /> },
];

export default adminRouter;
