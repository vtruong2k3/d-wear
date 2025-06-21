import Layout from "../../layouts/ClientLayout";
import Home from "../../pages/client/Home/Home";
import DetailProduct from "../../pages/client/ProductDetail/DetailProduct";

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
      }
    ],
  },
]

export default clientRoutes;