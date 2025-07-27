import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    Input,
    Avatar,
    Badge,

    Tooltip,

} from 'antd';
import {
    SendOutlined,
    RobotOutlined,

    MinusOutlined,
    VideoCameraOutlined,

} from '@ant-design/icons';

const { TextArea } = Input;

const FashionChatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Xin chào! Tôi là Fashion Assistant. Tôi có thể giúp bạn tìm kiếm trang phục, tư vấn phong cách và hỗ trợ mua sắm. Bạn cần hỗ trợ gì hôm nay?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const quickActions = [
        { text: '👗 Váy mới', value: 'Tôi muốn xem các mẫu váy mới nhất' },
        { text: '👔 Áo sơ mi nam', value: 'Tìm áo sơ mi nam công sở' },
        { text: '👟 Giày thể thao', value: 'Xem giày thể thao trending' },
        { text: '💄 Phụ kiện', value: 'Tư vấn phụ kiện thời trang' },
        { text: '🎯 Sale off', value: 'Có chương trình khuyến mãi nào không?' },
        { text: '📞 Liên hệ', value: 'Tôi muốn được tư vấn trực tiếp' }
    ];

    const botResponses = {
        'váy': 'Chúng tôi có nhiều mẫu váy đẹp: váy công sở, váy dạ hội, váy casual. Bạn thích phong cách nào? 👗✨',
        'áo sơ mi': 'Áo sơ mi nam chúng tôi có từ phong cách công sở đến casual, chất liệu cotton cao cấp. Size từ S-XXL 👔',
        'giày': 'Giày thể thao hot nhất: Nike, Adidas, Vans. Nhiều màu sắc và size. Bạn thích brand nào? 👟',
        'phụ kiện': 'Chúng tôi có túi xách, ví, thắt lưng, kính mát. Tất cả đều theo xu hướng 2024! 💎',
        'sale': 'Hiện tại shop đang có chương trình giảm giá 30-50% cho nhiều sản phẩm. Flash sale cuối tuần! 🔥',
        'liên hệ': 'Bạn có thể gọi hotline: 1900-1234 hoặc chat với tư vấn viên qua Zalo/Facebook! 📞',
        'default': 'Cảm ơn bạn đã quan tâm! Tôi sẽ chuyển cho tư vấn viên để hỗ trợ bạn tốt nhất. Vui lòng chờ trong giây lát... 😊'
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        for (const [key, response] of Object.entries(botResponses)) {
            if (key !== 'default' && message.includes(key)) {
                return response;
            }
        }
        return botResponses.default;
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot typing delay
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: generateBotResponse(inputValue),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleQuickAction = (actionValue) => {
        setInputValue(actionValue);
        setTimeout(() => handleSend(), 100);
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative">
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={<RobotOutlined className="text-xl" />}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-500 hover:bg-blue-600 border-none flex items-center justify-center"
                    />
                    <Badge
                        count=""
                        dot
                        status="processing"
                        className="absolute -top-1 -right-1"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="w-96 bg-white rounded-2xl shadow-2xl !border !border-gray-200 overflow-hidden">
                {/* Header - Messenger style */}
                <div className="bg-white !border-b !border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar
                                    size={40}
                                    icon={<RobotOutlined />}
                                    className="border-2 border-green-400 bg-blue-500 text-white rounded-full"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 !border-2 !border-white rounded-full"></div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">Fashion Assistant</div>
                                <div className="text-xs text-green-500 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    Đang hoạt động
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Tooltip title="Video call">
                                <Button
                                    type="text"
                                    icon={<VideoCameraOutlined />}
                                    className="text-gray-500 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                                />
                            </Tooltip>
                            <Tooltip title="Thu nhỏ">
                                <Button
                                    type="text"
                                    icon={<MinusOutlined />}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                                />
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Messages - Messenger style */}
                <div className="h-80 overflow-y-auto p-4 bg-white">
                    <div className="space-y-3">
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.type === 'bot' && (
                                    <Avatar
                                        size={24}
                                        icon={<RobotOutlined />}
                                        className="mb-1 bg-blue-500 text-white rounded-full"
                                    />
                                )}
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${message.type === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-md'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-end gap-2 justify-start">
                                <Avatar
                                    size={24}
                                    icon={<RobotOutlined />}
                                    className="mb-1 bg-blue-500 text-white rounded-full"
                                />
                                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Quick Actions - Messenger style */}
                <div className="px-4 py-2 bg-gray-50 !border-t !border-gray-200">
                    <div className="flex flex-wrap gap-1">
                        {quickActions.slice(0, 3).map((action, index) => (
                            <Button
                                key={index}
                                size="small"
                                type="default"
                                onClick={() => handleQuickAction(action.value)}
                                className="text-xs h-7 bg-white !border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full px-3"
                            >
                                {action.text}
                            </Button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {quickActions.slice(3).map((action, index) => (
                            <Button
                                key={index + 3}
                                size="small"
                                type="default"
                                onClick={() => handleQuickAction(action.value)}
                                className="text-xs h-7 bg-white !border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full px-3"
                            >
                                {action.text}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Input - Messenger style */}
                <div className="p-3 bg-white !border-t !border-gray-200">
                    <div className="flex items-end gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 min-h-[40px] flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Aa"
                                className="flex-1 bg-transparent outline-none text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                        </div>
                        <Button
                            type="text"
                            icon={<SendOutlined className="text-blue-500" />}
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-50 disabled:hover:bg-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FashionChatbot;