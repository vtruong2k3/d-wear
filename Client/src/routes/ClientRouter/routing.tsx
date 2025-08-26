import Layout from "../../layouts/ClientLayout";
import Home from "../../pages/client/Home/Home";
import DetailProduct from "../../pages/client/ProductDetail/DetailProduct";
import Login from "../../pages/client/Login/Login";
import Register from "../../pages/client/Login/Register";
import ListProduct from "../../pages/client/Product/ListProduct";
import Profile from "../../pages/client/Profile/Profile";
import ShoppingCart from "../../pages/client/Cart/ShoppingCart";
import Checkout from "../../pages/client/Order/Checkout";
import PaymentResult from "../../pages/client/Order/PaymentResult";
import OrdersPage from "../../pages/client/Order/OrdersPage";
import OrderDetailPage from "../../pages/client/Order/OrderDetailPage";
import AddressManagement from "../../pages/client/Address/AddressManagerModal";
import AboutPage from "../../pages/client/About/About";
import ContactPage from "../../pages/client/Contact/Contact";
import BlogtPage from "../../pages/client/Blog/Blog";
import ForgotPassword from "../../pages/client/Login/ForgotPassword";
const clientRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/blog",
        element: <BlogtPage />,
      },
      {
        path: "/product",
        element: <ListProduct />,
      },

      {
        path: "product/:id",
        element: <DetailProduct />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "shopping-cart",
        element: <ShoppingCart />,
      },
      {
        path: "address",
        element: <AddressManagement />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "payment",
        element: <PaymentResult />,
      },
      {
        path: "orders", // ✅ Danh sách đơn hàng
        element: <OrdersPage />,
      },
      {
        path: "orders/:id", // ✅ Chi tiết đơn hàng
        element: <OrderDetailPage />,
      },
      {
        path: "/login",

        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
];

export default clientRoutes;
