import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UserOutlined,
  OrderedListOutlined,
  FileTextOutlined,
  SafetyOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const AsideAdmin = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      key: "categories",
      icon: <AppstoreOutlined />,
      label: "Quản lí Danh mục",
      path: "/admin/categories",
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Quản lí Sản phẩm",
      path: "/admin/products",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
      path: "/admin/users",
    },
    {
      key: "orders",
      icon: <OrderedListOutlined />,
      label: "Quản lý đơn hàng",
      path: "/admin/orders",
    },
    {
      key: "posts",
      icon: <FileTextOutlined />,
      label: "Quản lý bài viết / tin tức",
      path: "/admin/posts",
    },
    {
      key: "roles",
      icon: <SafetyOutlined />,
      label: "Quản lý quyền & vai trò",
      path: "/admin/roles",
    },
    {
      key: "variants",
      icon: <BarcodeOutlined />,
      label: "Quản lý biến thể",
      path: "/admin/variants",
    },
  ];

  const handleClick = (e: { key: string }) => {
    const item = menuItems.find((item) => item.key === e.key);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <Sider className="bg-white shadow-md">
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={menuItems}
        onClick={handleClick}
      />
    </Sider>
  );
};

export default AsideAdmin;
