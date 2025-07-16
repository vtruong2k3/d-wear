import Layout from "../../layouts/ClientLayout";
import Home from "../../pages/client/Home/Home";
import DetailProduct from "../../pages/client/ProductDetail/DetailProduct";
import Login from "../../pages/client/Login/Login";
import Register from "../../pages/client/Login/Register";
import ListProduct from "../../pages/client/Product/ListProduct";

import ShoppingCart from "../../pages/client/Cart/ShoppingCart";
import Checkout from "../../pages/client/Order/Checkout";
import OrdersPage from "../../pages/client/Order/OrdersPage";
import OrderDetailPage from "../../pages/client/Order/OrderDetailPage";
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
        path: "/product",
        element: <ListProduct />,
      },

      {
        path: "product/:id",
        element: <DetailProduct />,
      },

      {
        path: "shopping-cart",
        element: <ShoppingCart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
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
    ],
  },
];

export default clientRoutes;
