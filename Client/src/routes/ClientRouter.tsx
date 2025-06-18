import ClientLayout from "../layouts/ClientLayout";
import Home from "../pages/client/Home";

const clientRouter = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [{ path: "home", element: <Home /> }],
  },
];
export default clientRouter;
