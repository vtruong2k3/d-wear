import React, { lazy } from 'react';

const AdminLayout = lazy(() => import("../../layouts/AdminLayout"));
const Categories = lazy(() => import("../../pages/admin/PageAdmin/Categories/CategoriesList"));
const Dashboard = lazy(() => import("../../pages/admin/PageAdmin/Dashboard/Dashboards"));
const Products = lazy(() => import("../../pages/admin/PageAdmin/Products/Products"));
const LoginAdmin = lazy(() => import("../../pages/admin/auth/LoginAdmin"));
const ProductEdit = lazy(() => import("../../pages/admin/PageAdmin/Products/ProductEdit"));
const ProductAdd = lazy(() => import("../../pages/admin/PageAdmin/Products/ProductAdd"));
const QuickAddProduct = lazy(() => import("../../pages/admin/PageAdmin/Products/QuickAddProduct"));
const Orders = lazy(() => import("../../pages/admin/PageAdmin/Orders/Orders"));
const Orderdetail = lazy(() => import("../../pages/admin/PageAdmin/Orders/OrderDetail"));
const Brand = lazy(() => import("../../pages/admin/PageAdmin/Brand/Brand"));
const Voucher = lazy(() => import("../../pages/admin/PageAdmin/Voucher/Voucher"));
const Variants = lazy(() => import("../../pages/admin/PageAdmin/Variants/Variants"));
const Sizes = lazy(() => import("../../pages/admin/PageAdmin/Size/Size"));
const Color = lazy(() => import("../../pages/admin/PageAdmin/Color/Color"));
const UsersList = lazy(() => import("../../pages/admin/PageAdmin/Users/UsersList"));
const Messenger = lazy(() => import("../../pages/admin/PageAdmin/Messenger/Messenger"));
const Review = lazy(() => import("../../pages/admin/PageAdmin/Reivew/Review"));
const ProductDetailAdmin = lazy(() => import("../../pages/admin/PageAdmin/Products/ProductDetalAdmin"));
const AddUser = lazy(() => import("../../pages/admin/PageAdmin/Users/AddUser"));
const UpdateUser = lazy(() => import("../../pages/admin/PageAdmin/Users/UpdateUser"));

const adminRouter = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "products/edit/:id", element: <ProductEdit /> },
      { path: "products/add", element: <ProductAdd /> },
      { path: "products/quick-add", element: <QuickAddProduct /> },
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
