
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ShoppingCartOutlined,

    SettingOutlined,
    ProductOutlined,
    TeamOutlined,
    TagsOutlined,
    BranchesOutlined,
    GiftOutlined,
    AppstoreOutlined,
    ColumnWidthOutlined,
    BgColorsOutlined,
    CommentOutlined,
    MessageOutlined,

} from '@ant-design/icons';
interface SidebarProps {
    collapsed: boolean;
    onCollapse: () => void;
}
const AsideAdmin = ({ collapsed }: SidebarProps) => {

    const location = useLocation();

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
        },
        {
            key: '/admin/orders',
            icon: <ShoppingCartOutlined />,
            label: <Link to="/admin/orders">Đơn hàng</Link>,
        },
        {
            key: 'products-group',
            icon: <ProductOutlined />,
            label: 'Sản phẩm',
            children: [
                {
                    key: '/admin/products',
                    icon: <ProductOutlined />,
                    label: <Link to="/admin/products">Sản phẩm</Link>,
                },
                {
                    key: 'variants-group',
                    icon: <TagsOutlined />,
                    label: 'Biến thể',
                    children: [
                        {
                            key: '/admin/variants',
                            icon: <TagsOutlined />,
                            label: <Link to="/admin/variants">Danh sách biến thể</Link>,
                        },
                        {
                            key: '/admin/sizes',
                            icon: <ColumnWidthOutlined />, // Hoặc ExpandOutlined
                            label: <Link to="/admin/size">Kích thước</Link>,
                        },
                        {
                            key: '/admin/colors',
                            icon: <BgColorsOutlined />, // bạn cũng có thể dùng 'FormatPainterOutlined' hoặc icon khác nếu muốn
                            label: <Link to="/admin/color">Màu sắc</Link>,
                        },
                    ],
                },
                {
                    key: '/admin/categories',
                    icon: <AppstoreOutlined />,
                    label: <Link to="/admin/categories">Danh mục</Link>,
                },
            ],
        },

        {
            key: '/admin/brands',
            icon: <BranchesOutlined />,
            label: <Link to="/admin/brands">Thương hiệu</Link>,
        },
        {
            key: '/admin/voucher',
            icon: <GiftOutlined />,
            label: <Link to="/admin/voucher">Voucher</Link>
        },

        {
            key: '/admin/users',
            icon: <TeamOutlined />,
            label: <Link to="/admin/users">Người dùng</Link>,
        },
        {

            key: '/admin/messenger',
            icon: <MessageOutlined />,
            label: <Link to="/admin/messenger">Tin nhắn</Link>,
        },
        {
            key: '/admin/review',
            icon: <CommentOutlined />,
            label: <Link to="/admin/review">Bình luận</Link>,
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: <Link to="/admin/settings">Cài đặt</Link>,
        },
    ];

    // Tự động mở submenu nếu đang ở một trong các trang con
    const getDefaultOpenKeys = () => {
        const currentPath = location.pathname;
        if (currentPath.includes('/admin/products') ||
            currentPath.includes('/admin/variants') ||
            currentPath.includes('/admin/categories')) {
            return ['products-group'];
        }
        return [];
    };

    return (
        <div className="h-full bg-white shadow-lg flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
                <h2 className={`font-bold text-blue-600 transition-all duration-300 ${collapsed ? 'text-lg' : 'text-xl'
                    }`}>
                    {collapsed ? 'A' : 'Admin Panel'}
                </h2>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto">
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={getDefaultOpenKeys()}
                    items={menuItems}
                    className="border-r-0 mt-4"
                    inlineCollapsed={collapsed}
                />
            </div>
        </div>
    );
};

export default AsideAdmin;