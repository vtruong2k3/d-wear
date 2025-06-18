import ClientLayout from "../layouts/ClientLayout";
import Home from "../pages/client/Home";
import Login from "../pages/client/Login";

const clientLayout = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { path: "home", element: <Home /> },
    { path: "login", element: <Login /> },
  ],
};

export default clientLayout;
