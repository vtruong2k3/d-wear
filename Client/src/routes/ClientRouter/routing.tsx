import { createBrowserRouter } from "react-router-dom";
import Layout from "../../layouts/ClientLayout";
import Home from "../../pages/client/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      
    ],
  },
]);
export default router;
