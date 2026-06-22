import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/notification.css';
import { Dropdown, Badge, Button, List, Typography, Tag, Empty, message } from 'antd';
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import socket from '../../../sockets/socket';
import dayjs from 'dayjs';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../../../services/admin/notificationService';

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

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    // Chuông báo dạng mp3 public
    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    };

    const fetchNotifs = async () => {
        try {
            const data = await getNotifications(1, 30);
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Lỗi lấy thông báo:", error);
        }
    };

    useEffect(() => {
        fetchNotifs();

        socket.emit('joinRoom', 'admin');
        
        socket.on('newNotification', (notif: NotificationItem) => {
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);
            playNotificationSound();
        });

        return () => {
            socket.off('newNotification');
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
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
            await markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            message.success("Đã đánh dấu tất cả là đã đọc");
        } catch (error) {
            message.error("Lỗi cập nhật thông báo");
        }
    };

    const removeNotification = async (id: string) => {
        try {
            await deleteNotification(id);
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
        return colors[type] || '#1890ff';
    };

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'error': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
            default: return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
        }
    }

    const notificationContent = (
        <div className="notification-dropdown-content" style={{ width: 380, maxHeight: 500, overflow: 'hidden', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f0f0f0', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                    background: item.isRead ? 'white' : 'rgba(24, 144, 255, 0.05)',
                                    borderLeft: item.isRead ? '3px solid transparent' : `3px solid ${getTypeColor(item.type)}`,
                                    cursor: 'pointer',
                                    margin: '0 8px 4px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(0, 0, 0, 0.02)',
                                    transition: 'all 0.3s'
                                }}
                                actions={[
                                    !item.isRead && (
                                        <Button
                                            key="read"
                                            type="text"
                                            size="small"
                                            icon={<CheckOutlined />}
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
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: `linear-gradient(45deg, ${getTypeColor(item.type)}20, ${getTypeColor(item.type)}10)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 18,
                                        }}>
                                            {getIcon(item.type)}
                                        </div>
                                    }
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong={!item.isRead} style={{ fontSize: 14 }}>{item.title}</Text>
                                        </div>
                                    }
                                    description={
                                        <div style={{ marginTop: 4 }}>
                                            <Text type="secondary" style={{ display: 'block', fontSize: 13, color: '#595959' }}>{item.message}</Text>
                                            <Text type="secondary" style={{ fontSize: 11, color: '#bfbfbf', marginTop: 4, display: 'block' }}>
                                                {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                                            </Text>
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
        </div>
    );

    return (
        <div className="relative">
            <Dropdown dropdownRender={() => notificationContent} placement="bottomRight" trigger={['click']}>
                <div style={{ cursor: 'pointer', padding: '0 12px' }}>
                    <Badge count={unreadCount} size="small" offset={[2, 4]}>
                        <BellOutlined style={{ fontSize: 20, color: '#595959' }} />
                    </Badge>
                </div>
            </Dropdown>
        </div>
    );
};

export default NotificationDropdown;
