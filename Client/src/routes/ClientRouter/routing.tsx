import Layout from "../../layouts/ClientLayout";
import Home from "../../pages/client/Home/Home";
import DetailProduct from "../../pages/client/ProductDetail/DetailProduct";

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
    ],
  },
];

export default clientRoutes;
