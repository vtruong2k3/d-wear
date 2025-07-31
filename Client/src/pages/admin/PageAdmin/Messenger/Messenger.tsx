import React, { useState, useRef, useEffect } from 'react';
import {
    Layout,
    List,
    Avatar,
    Input,
    Button,
    Badge,

    Typography,

    Empty,
    message as antMessage,

    Tag
} from 'antd';
import {
    SendOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminMessageManager = () => {
    // Dữ liệu mẫu khách hàng và tin nhắn
    const [customers] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            avatar: null,
            lastMessage: 'Xin chào, tôi cần hỗ trợ về sản phẩm',
            unreadCount: 3,
            lastActive: '2 phút trước',
            status: 'pending'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            avatar: null,
            lastMessage: 'Cảm ơn bạn đã hỗ trợ!',
            unreadCount: 0,
            lastActive: '15 phút trước',
            status: 'resolved'
        },
        {
            id: 3,
            name: 'Lê Văn C',
            avatar: null,
            lastMessage: 'Khi nào sản phẩm được giao?',
            unreadCount: 1,
            lastActive: '1 giờ trước',
            status: 'in-progress'
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            avatar: null,
            lastMessage: 'Tôi muốn đổi trả sản phẩm',
            unreadCount: 2,
            lastActive: '3 giờ trước',
            status: 'pending'
        }
    ]);

    const [conversations] = useState({
        1: [
            { id: 1, sender: 'customer', content: 'Xin chào, tôi cần hỗ trợ về sản phẩm', time: '14:30', isRead: true },
            { id: 2, sender: 'customer', content: 'Sản phẩm tôi mua bị lỗi', time: '14:32', isRead: true },
            { id: 3, sender: 'customer', content: 'Làm sao để đổi trả?', time: '14:35', isRead: false }
        ],
        2: [
            { id: 1, sender: 'customer', content: 'Tôi có vấn đề với đơn hàng', time: '13:00', isRead: true },
            { id: 2, sender: 'admin', content: 'Chào bạn! Tôi sẽ kiểm tra đơn hàng của bạn ngay', time: '13:05', isRead: true },
            { id: 3, sender: 'admin', content: 'Đơn hàng của bạn đang được xử lý và sẽ giao trong 2-3 ngày', time: '13:10', isRead: true },
            { id: 4, sender: 'customer', content: 'Cảm ơn bạn đã hỗ trợ!', time: '13:15', isRead: true }
        ],
        3: [
            { id: 1, sender: 'customer', content: 'Khi nào sản phẩm được giao?', time: '12:00', isRead: false }
        ],
        4: [
            { id: 1, sender: 'customer', content: 'Tôi muốn đổi trả sản phẩm', time: '10:30', isRead: false },
            { id: 2, sender: 'customer', content: 'Sản phẩm không đúng như mô tả', time: '10:32', isRead: false }
        ]
    });

    const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
    const [replyMessage, setReplyMessage] = useState('');
    const [customerMessages, setCustomerMessages] = useState(conversations);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedCustomer, customerMessages]);

    const handleSendReply = () => {
        if (!replyMessage.trim()) {
            antMessage.warning('Vui lòng nhập nội dung tin nhắn');
            return;
        }

        const newMessage = {
            id: Date.now(),
            sender: 'admin',
            content: replyMessage,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isRead: true
        };

        setCustomerMessages(prev => ({
            ...prev,
            [selectedCustomer.id]: [...(prev[selectedCustomer.id] || []), newMessage]
        }));

        setReplyMessage('');
        antMessage.success('Đã gửi tin nhắn thành công!');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'in-progress': return 'blue';
            case 'resolved': return 'green';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'in-progress': return 'Đang xử lý';
            case 'resolved': return 'Đã giải quyết';
            default: return 'Không xác định';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <ExclamationCircleOutlined />;
            case 'in-progress': return <ClockCircleOutlined />;
            case 'resolved': return <CheckCircleOutlined />;
            default: return null;
        }
    };

    return (
        <Layout className="h-screen bg-gray-50">
            <Header className="bg-white shadow-sm !border-b !border-gray-200 px-6">
                <div className="flex items-center justify-between h-full">
                    <Title level={3} className="!mb-0 !text-gray-800">
                        Quản lý Tin nhắn Khách hàng
                    </Title>
                    <div className="flex items-center space-x-4">
                        <Badge count={customers.reduce((sum, c) => sum + c.unreadCount, 0)} showZero>
                            <Button type="primary" size="large">
                                Tin nhắn mới
                            </Button>
                        </Badge>
                    </div>
                </div>
            </Header>

            <Layout className="h-full">
                <Sider width={350} className="bg-white !border-r !border-gray-200 overflow-hidden">
                    <div className="p-4 !border-b !border-gray-100">
                        <Title level={5} className="!mb-2">Danh sách khách hàng</Title>
                        <Text type="secondary">
                            {customers.filter(c => c.unreadCount > 0).length} tin nhắn chưa đọc
                        </Text>
                    </div>

                    <div className="overflow-y-auto h-full pb-20">
                        <List
                            dataSource={customers}
                            renderItem={(customer) => (
                                <List.Item
                                    className={`px-4 py-3 cursor-pointer transition-all hover:bg-blue-50 ${selectedCustomer.id === customer.id
                                        ? 'bg-blue-50 !border-r-4 !border-blue-500'
                                        : '!border-r-4 !border-transparent'
                                        }`}
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Badge count={customer.unreadCount} size="small" offset={[-5, 5]}>
                                                <Avatar
                                                    src={customer.avatar}
                                                    icon={<UserOutlined />}
                                                    size="large"
                                                    className="bg-gradient-to-r from-blue-400 to-blue-600"
                                                />
                                            </Badge>
                                        }
                                        title={
                                            <div className="flex items-center justify-between">
                                                <Text strong className="text-gray-800">{customer.name}</Text>
                                                <Tag
                                                    color={getStatusColor(customer.status)}
                                                    icon={getStatusIcon(customer.status)}
                                                    className="text-xs"
                                                >
                                                    {getStatusText(customer.status)}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <Text
                                                    className={`block text-sm ${customer.unreadCount > 0 ? 'font-medium text-gray-800' : 'text-gray-500'
                                                        }`}
                                                    ellipsis={{ tooltip: customer.lastMessage }}
                                                >
                                                    {customer.lastMessage}
                                                </Text>
                                                <Text type="secondary" className="text-xs mt-1 block">
                                                    {customer.lastActive}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </Sider>

                <Content className="flex flex-col bg-white">
                    {selectedCustomer ? (
                        <>
                            <div className="p-4 !border-b !border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar
                                            src={selectedCustomer.avatar}
                                            icon={<UserOutlined />}
                                            size="large"
                                            className="bg-gradient-to-r from-blue-400 to-blue-600"
                                        />
                                        <div>
                                            <Title level={4} className="!mb-1">{selectedCustomer.name}</Title>
                                            <Text type="secondary">Hoạt động {selectedCustomer.lastActive}</Text>
                                        </div>
                                    </div>
                                    <Tag
                                        color={getStatusColor(selectedCustomer.status)}
                                        icon={getStatusIcon(selectedCustomer.status)}
                                        className="px-3 py-1"
                                    >
                                        {getStatusText(selectedCustomer.status)}
                                    </Tag>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                <div className="space-y-4 max-w-4xl mx-auto">
                                    {customerMessages[selectedCustomer.id]?.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'admin'
                                                    ? 'bg-blue-500 text-white rounded-br-md'
                                                    : 'bg-white text-gray-800 !border !border-gray-200 rounded-bl-md'
                                                    }`}
                                            >
                                                <div className="text-sm leading-relaxed">{msg.content}</div>
                                                <div
                                                    className={`text-xs mt-2 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                                        }`}
                                                >
                                                    {msg.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 !border-t !border-gray-200 bg-white">
                                <div className="max-w-4xl mx-auto">
                                    <div className="flex space-x-3 items-end">
                                        <TextArea
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            placeholder="Nhập tin nhắn phản hồi..."
                                            autoSize={{ minRows: 1, maxRows: 4 }}
                                            className="flex-1"
                                            onPressEnter={(e) => {
                                                if (!e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendReply}
                                            size="middle"
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-1.5 transition-colors !ml-2"
                                        >
                                            Gửi
                                        </Button>
                                    </div>

                                    <Text type="secondary" className="text-xs mt-2 block">
                                        Nhấn Enter để gửi, Shift + Enter để xuống dòng
                                    </Text>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <Empty
                                description="Chọn một khách hàng để bắt đầu trò chuyện"
                                className="text-gray-500"
                            />
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminMessageManager;