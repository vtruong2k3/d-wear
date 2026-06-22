import * as React from "react";
import { Avatar, Dropdown, type MenuProps } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { doLogout } from "../../../redux/features/client/authenSlice";
import { type AppDispatch, type RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { MapPin, ShoppingBagIcon } from "lucide-react";
import { fetchUserProfile } from "../../../redux/features/client/thunks/authUserThunk";

export default function AccountMenu() {
  const { user, isLogin } = useSelector((state: RootState) => state.authenSlice);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const avatarSrc = React.useMemo(() => {
    const avatar = user?.avatar;
    if (!avatar) return undefined;

    if (avatar instanceof File) {
      return URL.createObjectURL(avatar);
    }

    if (typeof avatar === "string") {
      if (avatar.startsWith("http")) {
        return avatar;
      }
      const normalized = avatar.startsWith("/") ? avatar : `/${avatar}`;
      return `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}${normalized.replace(/\\/g, "/")}`;
    }

    return undefined;
  }, [user?.avatar]);

  const handleLogout = () => {
    dispatch(doLogout());
  };

  React.useEffect(() => {
    if (isLogin) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isLogin]);

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Trang cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "orders",
      label: "Đơn hàng của tôi",
      icon: <ShoppingBagIcon size={16} />,
      onClick: () => navigate("/orders"),
    },
    {
      key: "address",
      label: "Địa chỉ",
      icon: <MapPin size={16} />,
      onClick: () => navigate("/address"),
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="flex items-center text-center">
      <Dropdown menu={{ items }} placement="bottomRight" arrow trigger={['click']}>
        <Avatar
          size={32}
          src={avatarSrc}
          className="cursor-pointer ml-4"
          icon={!avatarSrc && !user?.username ? <UserOutlined /> : undefined}
        >
          {!avatarSrc && user?.username ? user.username[0].toUpperCase() : null}
        </Avatar>
      </Dropdown>
    </div>
  );
}
