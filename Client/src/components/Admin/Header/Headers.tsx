import '../../../styles/headerAdmin.css'
import { Button, Avatar, Dropdown, Input, type MenuProps } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,

    SearchOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import NotificationDropdown from '../Notification/Notification'; // Import component thông báo
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/admin/adminSlice';
import type { RootState } from '../../../redux/store';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../../../redux/store';

const { Search } = Input;
interface AdminHeaderProps {
    collapsed: boolean;
    onCollapse: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapse }) => {
    // const dispatch = useDispatch<AppDispatch>()
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'account',
            icon: <UserOutlined />,
            label: 'Tài khoản',
        },
        {

            key: 'setting',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },

        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
        },
    ];
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.authAdminSlice.user)

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout())
        // ⏳ Đợi 300ms rồi mới navigate
        setTimeout(() => {
            navigate("/admin/login");
        }, 300);
    };

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            handleLogout();
        }
    };

    return (
        <div className="h-16 bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm shadow-lg border-b border-gray-100 px-6 flex items-center justify-between relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/10"></div>

            {/* Left side */}
            <div className="flex items-center relative z-10">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onCollapse}
                    className="text-lg w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                />
                {/* <div className="ml-6 hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-0 tracking-tight">
                        Admin Dashboard
                    </h1>
                    <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
                </div> */}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6 relative z-10">
                {/* Search */}
                <div className="hidden lg:block relative">
                    <Search
                        placeholder="Tìm kiếm..."
                        style={{ width: 280 }}
                        className="search-input"
                        prefix={<SearchOutlined className="text-gray-400" />}
                    />

                </div>

                {/* Notifications - Thay thế bằng NotificationDropdown component */}
                <NotificationDropdown />

                {/* User dropdown */}
                <Dropdown
                    menu={{
                        items: userMenuItems,
                        onClick: handleMenuClick
                    }}
                    placement="bottomRight"
                    trigger={['click']}
                    overlayClassName="user-dropdown"
                >
                    <div className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                        <div className="relative">
                            <Avatar
                                size={36}
                                className="mr-3 ring-2 ring-white shadow-lg transition-all duration-300 group-hover:ring-blue-200"
                                style={{
                                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                                }}
                            >{!user?.avatar && (user?.username?.slice(0, 1)?.toUpperCase() || "?")}</Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        {/* <div className="block">
                            <div className="text-sm font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">
                                {user?.username?.toUpperCase() || "User"}
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                                {user?.email || "No email"}
                            </div>
                        </div> */}
                    </div>
                </Dropdown>


            </div>
        </div>
    );
};

export default AdminHeader;