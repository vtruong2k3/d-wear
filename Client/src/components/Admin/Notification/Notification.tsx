import { useState } from 'react';
import '../../../styles/notification.css'
import { Dropdown, Badge, Button, List, Typography, Tag, Empty } from 'antd';
import {
    BellOutlined,

    CheckOutlined,
    DeleteOutlined,
    SettingOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'Đơn hàng thành công',
            message: 'Đơn hàng #12345 đã được xử lý thành công',
            time: '2 phút trước',
            read: false,
            avatar: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        },
        {
            id: 2,
            type: 'warning',
            title: 'Cảnh báo hệ thống',
            message: 'Dung lượng server đang đạt 85%',
            time: '15 phút trước',
            read: false,
            avatar: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        },
        {
            id: 3,
            type: 'info',
            title: 'Người dùng mới',
            message: 'Có 3 người dùng mới đăng ký hôm nay',
            time: '1 giờ trước',
            read: true,
            avatar: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
        },
        {
            id: 4,
            type: 'error',
            title: 'Lỗi kết nối',
            message: 'Không thể kết nối đến database chính',
            time: '2 giờ trước',
            read: false,
            avatar: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        },
        {
            id: 5,
            type: 'info',
            title: 'Báo cáo hàng tháng',
            message: 'Báo cáo tháng 6 đã sẵn sàng để xem',
            time: '1 ngày trước',
            read: true,
            avatar: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    type AlertType = 'success' | 'warning' | 'info' | 'error';



    const getTypeColor = (type: string): string => {
        const colors: Record<AlertType, string> = {
            success: '#52c41a',
            warning: '#faad14',
            info: '#1890ff',
            error: '#ff4d4f',
        };

        return colors[type as AlertType] || '#1890ff';
    };


    const getTypeTag = (type: string) => {
        const tags: Record<AlertType, { color: string; text: string }> = {
            success: { color: 'success', text: 'Thành công' },
            warning: { color: 'warning', text: 'Cảnh báo' },
            info: { color: 'processing', text: 'Thông tin' },
            error: { color: 'error', text: 'Lỗi' },
        };

        return tags[type as AlertType] || { color: 'default', text: 'Khác' };
    };



    const notificationContent = (
        <div className="notification-dropdown-content" style={{
            width: 380,
            maxHeight: 500,
            overflow: 'hidden',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
            {/* Header */}
            <div className="notification-header" style={{
                padding: '16px 20px 12px',
                borderBottom: '1px solid #f0f0f0',
                background: 'white',
                color: '#333',
                borderRadius: '12px 12px 0 0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5} style={{ margin: 0, color: '#333', fontSize: '16px' }}>
                        <BellOutlined style={{ marginRight: 8 }} />
                        Thông báo ({unreadCount})
                    </Title>
                    {unreadCount > 0 && (
                        <Button
                            type="text"
                            size="small"
                            onClick={markAllAsRead}
                            style={{ color: '#666', fontSize: '12px' }}
                            icon={<CheckOutlined />}
                        >
                            Đánh dấu tất cả
                        </Button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0', background: 'white' }}>
                {notifications.length > 0 ? (
                    <List
                        dataSource={notifications}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    padding: '12px 20px',
                                    background: item.read ? 'white' : 'rgba(24, 144, 255, 0.02)',
                                    borderLeft: item.read ? 'none' : `3px solid ${getTypeColor(item.type)}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    margin: '0 8px 4px',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                    border: '1px solid rgba(0, 0, 0, 0.02)'
                                }}
                                className="notification-item"
                                actions={[
                                    !item.read && (
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item.id);
                                            }}
                                            style={{ color: '#52c41a' }}
                                        />
                                    ),
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(item.id);
                                        }}
                                        style={{ color: '#ff4d4f' }}
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: `linear-gradient(45deg, ${getTypeColor(item.type)}20, ${getTypeColor(item.type)}10)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px'
                                        }}>
                                            {item.avatar}
                                        </div>
                                    }
                                    title={
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: 4
                                            }}>
                                                <Text strong={!item.read} style={{ fontSize: '14px' }}>
                                                    {item.title}
                                                </Text>
                                                <Tag
                                                    color={getTypeTag(item.type).color}
                                                    size="small"
                                                    style={{ fontSize: '10px', padding: '0 6px' }}
                                                >
                                                    {getTypeTag(item.type).text}
                                                </Tag>
                                            </div>
                                            {!item.read && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        right: 12,
                                                        top: 12,
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: getTypeColor(item.type),
                                                        animation: 'pulse 2s infinite'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: '13px',
                                                    display: 'block',
                                                    marginBottom: 4,
                                                    opacity: item.read ? 0.7 : 1
                                                }}
                                            >
                                                {item.message}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: '11px',
                                                    opacity: 0.6
                                                }}
                                            >
                                                {item.time}
                                            </Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty
                        description="Không có thông báo nào"
                        style={{ padding: '40px 20px' }}
                        imageStyle={{ height: 60 }}
                    />
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid #f0f0f0',
                    background: 'white',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center',
                    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)'
                }}>
                    <Button
                        type="link"
                        icon={<SettingOutlined />}
                        style={{ fontSize: '13px' }}
                    >
                        Xem tất cả thông báo
                    </Button>
                </div>
            )}


        </div>
    );

    return (
        <div className="relative">
            <Dropdown
                dropdownRender={() => notificationContent}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="notification-dropdown-overlay"
            >
                <div>
                    <Badge
                        count={unreadCount}
                        size="small"
                        className="notification-badge"
                    >
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-md relative overflow-hidden"
                        />
                    </Badge>
                </div>
            </Dropdown>


        </div>
    );
};

export default NotificationDropdown;