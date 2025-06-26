import Layout from "../../layouts/ClientLayout";
import Home from "../../pages/client/Home/Home";
import DetailProduct from "../../pages/client/ProductDetail/DetailProduct";
import Login from "../../pages/client/Login/Login";
import Register from "../../pages/client/Login/Register";

import ShoppingCart from "../../pages/client/Cart/ShoppingCart";

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
        path: "product/:id",
        element: <DetailProduct />,

      },
      {
        path: "shopping-cart",
        element: <ShoppingCart />,
      },
      {
        path: "/login",
        element: (<Login />),
      },
      {
        path: "/register",
        element: (<Register />),
      }
    ],
  },
];

export default clientRoutes;
