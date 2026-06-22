import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Badge, Button, List, Typography, Empty, message } from 'antd';
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import socket from '../../../sockets/socket';
import dayjs from 'dayjs';
import { getClientNotifications, markClientNotificationAsRead, markAllClientNotificationsAsRead, deleteClientNotification } from '../../../services/client/clientNotificationService';

const { Text, Title } = Typography;

interface NotificationItem {
    _id: string;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    orderId?: string;
}

const NotificationDropdownClient = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    
    // Kiểm tra xem đã đăng nhập chưa
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Lấy userId nếu lưu

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    };

    const fetchNotifs = async () => {
        if (!token) return;
        try {
            const data = await getClientNotifications(1, 30);
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Lỗi lấy thông báo:", error);
        }
    };

    useEffect(() => {
        fetchNotifs();

        if (token && userId) {
            // Join room userId của chính khách hàng đó
            socket.emit('joinRoom', userId);
            
            socket.on('newNotification', (notif: NotificationItem) => {
                setNotifications((prev) => [notif, ...prev]);
                setUnreadCount((prev) => prev + 1);
                playNotificationSound();
            });
        }

        return () => {
            socket.off('newNotification');
        };
    }, [token, userId]);

    const markAsRead = async (id: string) => {
        try {
            await markClientNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            message.error("Lỗi đánh dấu đã đọc");
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllClientNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            message.error("Lỗi cập nhật thông báo");
        }
    };

    const removeNotification = async (id: string) => {
        try {
            await deleteClientNotification(id);
            const notif = notifications.find(n => n._id === id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            if (notif && !notif.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            message.error("Lỗi xóa thông báo");
        }
    };

    const handleNotificationClick = (item: NotificationItem) => {
        if (!item.isRead) markAsRead(item._id);
        if (item.orderId) {
            navigate(`/orders/${item.orderId}`);
        }
    };

    const getTypeColor = (type: NotificationItem['type']): string => {
        const colors = {
            success: '#f59e0b', // Amber-500
            warning: '#fcd34d', // Amber-300
            info: '#1d4ed8',    // Blue-700
            error: '#ef4444',   // Red-500
        };
        return colors[type] || '#f59e0b';
    };

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'success': return <CheckCircleOutlined style={{ color: '#f59e0b' }} />;
            case 'error': return <CloseCircleOutlined style={{ color: '#ef4444' }} />;
            case 'warning': return <WarningOutlined style={{ color: '#fcd34d' }} />;
            default: return <InfoCircleOutlined style={{ color: '#1d4ed8' }} />;
        }
    }

    if (!token) return null;

    const notificationContent = (
        <div className="notification-dropdown-content" style={{ width: 360, maxHeight: 450, overflow: 'hidden', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                        Thông báo ({unreadCount})
                    </Title>
                    {unreadCount > 0 && (
                        <Button type="text" size="small" onClick={markAllAsRead} style={{ fontSize: 13, color: '#f59e0b' }}>
                            Đánh dấu đã đọc
                        </Button>
                    )}
                </div>
            </div>

            <div style={{ maxHeight: 350, overflowY: 'auto', padding: '8px 0' }}>
                {notifications.length > 0 ? (
                    <List
                        dataSource={notifications}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleNotificationClick(item)}
                                style={{
                                    padding: '12px 20px',
                                    background: item.isRead ? 'white' : '#fffbeb',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                actions={[
                                    !item.isRead && (
                                        <Button
                                            key="read"
                                            type="text"
                                            size="small"
                                            icon={<CheckOutlined style={{ color: '#f59e0b' }} />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item._id);
                                            }}
                                        />
                                    ),
                                    <Button
                                        key="delete"
                                        type="text"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(item._id);
                                        }}
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            background: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 16,
                                        }}>
                                            {getIcon(item.type)}
                                        </div>
                                    }
                                    title={
                                        <Text strong={!item.isRead} style={{ fontSize: 14 }}>{item.title}</Text>
                                    }
                                    description={
                                        <div style={{ marginTop: 4 }}>
                                            <Text style={{ display: 'block', fontSize: 13, color: '#4b5563' }}>{item.message}</Text>
                                            <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
                                                {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                                            </Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="Không có thông báo nào" style={{ padding: '30px 20px' }} />
                )}
            </div>
        </div>
    );

    return (
        <Dropdown dropdownRender={() => notificationContent} placement="bottomRight" trigger={['click']}>
            <div className="relative opacity-70 hover:opacity-100 transition-opacity cursor-pointer flex items-center">
                <span className="absolute -top-[8px] -right-[8px] size-[18px] bg-amber-600 text-white rounded-full text-xs grid place-items-center font-medium z-10" style={{ display: unreadCount > 0 ? 'grid' : 'none' }}>
                    {unreadCount}
                </span>
                <BellOutlined style={{ fontSize: 20 }} />
            </div>
        </Dropdown>
    );
};

export default NotificationDropdownClient;
