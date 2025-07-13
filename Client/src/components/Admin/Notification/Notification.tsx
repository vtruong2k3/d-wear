import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/notification.css';
import { Dropdown, Badge, Button, List, Typography, Tag, Empty } from 'antd';
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    SettingOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import socket from '../../../sockets/socket';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface NotificationItem {
    id: string | number;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    time: string;
    read: boolean;
    avatar: JSX.Element;
    orderId?: string;
}

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('joinRoom', 'admin');
        socket.on('newOrder', (orders) => {
            console.log(orders)
            const newNotification: NotificationItem = {
                id: orders.orders._id,
                type: 'success',
                title: '🛒 Đơn hàng mới',
                message: `Đơn hàng #${orders.orders._id} vừa được tạo.`,
                time: dayjs().format('HH:mm:ss DD/MM/YYYY'),
                read: false,
                avatar: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                orderId: orders.orders._id,
            };

            setNotifications((prev) => [newNotification, ...prev]);
        });

        return () => {
            socket.off('newOrder');
        };
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string | number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string | number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleNotificationClick = (item: NotificationItem) => {
        markAsRead(item.id);
        if (item.orderId) {
            navigate(`/admin/orders/${item.orderId}`);
        }
    };

    const getTypeColor = (type: NotificationItem['type']): string => {
        const colors = {
            success: '#52c41a',
            warning: '#faad14',
            info: '#1890ff',
            error: '#ff4d4f',
        };
        return colors[type];
    };

    const getTypeTag = (type: NotificationItem['type']) => {
        const tags = {
            success: { color: 'success', text: 'Thành công' },
            warning: { color: 'warning', text: 'Cảnh báo' },
            info: { color: 'processing', text: 'Thông tin' },
            error: { color: 'error', text: 'Lỗi' },
        };
        return tags[type];
    };

    const notificationContent = (
        <div className="notification-dropdown-content" style={{ width: 380, maxHeight: 500, overflow: 'hidden', background: 'white', borderRadius: '12px' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f0f0f0', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={5} style={{ margin: 0 }}>
                        <BellOutlined style={{ marginRight: 8 }} />
                        Thông báo ({unreadCount})
                    </Title>
                    {unreadCount > 0 && (
                        <Button type="text" size="small" onClick={markAllAsRead} icon={<CheckOutlined />} style={{ fontSize: 12 }}>
                            Đánh dấu tất cả
                        </Button>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
                {notifications.length > 0 ? (
                    <List
                        dataSource={notifications}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleNotificationClick(item)}
                                style={{
                                    padding: '12px 20px',
                                    background: item.read ? 'white' : 'rgba(24, 144, 255, 0.02)',
                                    borderLeft: item.read ? 'none' : `3px solid ${getTypeColor(item.type)}`,
                                    cursor: 'pointer',
                                    margin: '0 8px 4px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(0, 0, 0, 0.02)',
                                }}
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
                                    />,
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
                                            fontSize: 18,
                                        }}>
                                            {item.avatar}
                                        </div>
                                    }
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong={!item.read}>{item.title}</Text>
                                            <Tag color={getTypeTag(item.type).color}>{getTypeTag(item.type).text}</Tag>
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text type="secondary" style={{ display: 'block' }}>{item.message}</Text>
                                            <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="Không có thông báo nào" style={{ padding: '40px 20px' }} imageStyle={{ height: 60 }} />
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0', background: 'white', textAlign: 'center' }}>
                    <Button type="link" icon={<SettingOutlined />} style={{ fontSize: 13 }}>
                        Xem tất cả thông báo
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="relative">
            <Dropdown dropdownRender={() => notificationContent} placement="bottomRight" trigger={['click']}>
                <div>
                    <Badge count={unreadCount} size="small">
                        <Button type="text" icon={<BellOutlined />} />
                    </Badge>
                </div>
            </Dropdown>
        </div>
    );
};

export default NotificationDropdown;
