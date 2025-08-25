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
import Sizes from "../../pages/admin/PageAdmin/Size/Size";
import Color from "../../pages/admin/PageAdmin/Color/Color";
import UsersList from "../../pages/admin/PageAdmin/Users/UsersList";
import Messenger from "../../pages/admin/PageAdmin/Messenger/Messenger";
import Review from "../../pages/admin/PageAdmin/Reivew/Review";
import ProductDetailAdmin from "../../pages/admin/PageAdmin/Products/ProductDetalAdmin"
import AddUser from '../../pages/admin/PageAdmin/Users/AddUser';
import UpdateUser from '../../pages/admin/PageAdmin/Users/UpdateUser';
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
      { path: "orders/:id", element: <Orderdetail /> },
      { path: "brands", element: <Brand /> },
      { path: "voucher", element: <Voucher /> },
      { path: "size", element: <Sizes /> },
      { path: "color", element: <Color /> },
      { path: "users", element: <UsersList /> },
      { path: "messenger", element: <Messenger /> },
      { path: "review", element: <Review /> },
      { path: "users/add", element: <AddUser /> },
      { path: "users/edit/:id", element: <UpdateUser /> },

      { path: "products/:id", element: <ProductDetailAdmin /> },
    ],
  },
  { path: "/admin/login", element: <LoginAdmin /> },
];

export default adminRouter;
