import  { lazy } from 'react';

const Layout = lazy(() => import("../../layouts/ClientLayout"));
const Home = lazy(() => import("../../pages/client/Home/Home"));
const DetailProduct = lazy(() => import("../../pages/client/ProductDetail/DetailProduct"));
const Login = lazy(() => import("../../pages/client/Login/Login"));
const Register = lazy(() => import("../../pages/client/Login/Register"));
const ListProduct = lazy(() => import("../../pages/client/Product/ListProduct"));
const Profile = lazy(() => import("../../pages/client/Profile/Profile"));
const ShoppingCart = lazy(() => import("../../pages/client/Cart/ShoppingCart"));
const Checkout = lazy(() => import("../../pages/client/Order/Checkout"));
const PaymentResult = lazy(() => import("../../pages/client/Order/PaymentResult"));
const OrdersPage = lazy(() => import("../../pages/client/Order/OrdersPage"));
const OrderDetailPage = lazy(() => import("../../pages/client/Order/OrderDetailPage"));
const AddressManagement = lazy(() => import("../../pages/client/Address/AddressManagerModal"));
const AboutPage = lazy(() => import("../../pages/client/About/About"));
const ContactPage = lazy(() => import("../../pages/client/Contact/Contact"));
const BlogtPage = lazy(() => import("../../pages/client/Blog/Blog"));
const ForgotPassword = lazy(() => import("../../pages/client/Login/ForgotPassword"));

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
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
    ],
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
];

export default clientRoutes;
