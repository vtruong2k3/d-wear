import React from 'react';
import { Button, Avatar, Dropdown, Badge, Input, Space } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    SearchOutlined,
} from '@ant-design/icons';

const { Search } = Input;

const AdminHeader = ({ collapsed, onCollapse }) => {
    const userMenuItems = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
        },
        {
            key: '2',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
        },
    ];

    const handleLogout = () => {
        // Xử lý đăng xuất
        console.log('Đăng xuất');
    };

    const handleMenuClick = ({ key }) => {
        if (key === '3') {
            handleLogout();
        }
    };

    return (
        <div className="h-16 bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onCollapse}
                    className="text-lg w-10 h-10 flex items-center justify-center"
                />
                <div className="ml-4 hidden md:block">
                    <h1 className="text-lg font-semibold text-gray-800 mb-0">Admin Dashboard</h1>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {/* Search */}
                <Search
                    placeholder="Tìm kiếm..."
                    style={{ width: 250 }}
                    className="hidden lg:block"
                />

                {/* Notifications */}
                <Badge count={5} size="small">
                    <Button
                        type="text"
                        icon={<BellOutlined />}
                        className="w-10 h-10 flex items-center justify-center"
                    />
                </Badge>

                {/* User dropdown */}
                <Dropdown
                    menu={{
                        items: userMenuItems,
                        onClick: handleMenuClick
                    }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                        <Avatar
                            size={32}
                            icon={<UserOutlined />}
                            className="mr-2"
                        />
                        <div className="hidden md:block">
                            <div className="text-sm font-medium text-gray-700">Admin User</div>
                            <div className="text-xs text-gray-500">admin@example.com</div>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default AdminHeader;