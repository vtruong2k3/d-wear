import { useState, useRef, useEffect } from 'react';
import { Button, Avatar, message as antMessage, message } from 'antd';
import {
    SendOutlined,
    MinusOutlined,
    MessageOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { createChatRoom, getMessages, sendMessage } from '../../../services/client/messageService';
import socket from '../../../sockets/socket';
import type { ChatMessage, ChatRoomUser } from '../../../types/message/IMessage';
import type { ErrorType } from '../../../types/error/IError';

const FashionChatbot = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.authenSlice.user);

    const quickActions = [
        { text: 'Tư vấn size', value: 'Tôi muốn tư vấn size' },
        { text: 'Sản phẩm mới', value: 'Tôi quan tâm đến sản phẩm mới' },
        { text: 'Chính sách đổi trả', value: 'Chính sách đổi trả của shop' },
    ];

    // Effect 1: Khởi tạo phòng chat và lấy tin nhắn cũ khi người dùng mở chat
    useEffect(() => {

        if (!user?._id || !isOpen) return;

        const initChat = async () => {
            // Nếu đã có phòng chat rồi thì không cần tạo lại
            if (chatRoomId) return;
            try {
                const room = await createChatRoom(user._id);
                if (room && room._id) {
                    setChatRoomId(room._id);
                    const oldMessages = await getMessages(room._id);
                    setMessages(oldMessages);
                }
            } catch (error) {
                console.error("Failed to initialize chat:", error);
                antMessage.error("Không thể kết nối đến máy chủ.");
            }
        };
        initChat();
    }, [user?._id, isOpen, chatRoomId]);

    // Effect 2: Quản lý kết nối socket khi có phòng chat và cửa sổ đang mở
    useEffect(() => {
        if (!chatRoomId || !isOpen) return;

        socket.connect();
        socket.emit('joinRoom', chatRoomId);

        const handleReceiveMessage = (newMessage: ChatMessage) => {
            // Chỉ thêm tin nhắn nếu nó không phải của chính mình
            const senderId = typeof newMessage.sender === 'object' && newMessage.sender !== null ? newMessage.sender._id : newMessage.sender;
            if (senderId !== user?._id) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        socket.on('receive-message', handleReceiveMessage);

        // Dọn dẹp khi component unmount hoặc đóng cửa sổ chat
        return () => {
            socket.emit('leaveRoom', chatRoomId);
            socket.off('receive-message', handleReceiveMessage);
            socket.disconnect();
        };
    }, [chatRoomId, isOpen, user?._id]);

    // Effect 3: Tự động cuộn xuống cuối
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Hàm gửi tin nhắn đã được tối ưu (Optimistic Update)
    const handleSend = async (content: string) => {
        if (!content.trim() || !chatRoomId || !user?._id) return;
        // 1. Tạo một đối tượng sender mới, an toàn về kiểu dữ liệu
        const senderAsChatRoomUser: ChatRoomUser = {
            _id: user._id,
            username: user.username || 'user',
            avatar: typeof user.avatar === 'string' ? user.avatar : ''
        };
        const tempId = `temp_${Date.now()}`;
        const optimisticMessage: ChatMessage = {
            _id: tempId,
            chatRoomId: chatRoomId,
            sender: senderAsChatRoomUser._id,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false,
        };

        // 1. Thêm tin nhắn tạm vào UI
        setMessages(prev => [...prev, optimisticMessage]);
        setInputValue('');

        try {
            // 2. Gửi tin nhắn thật lên server
            const finalMessage = await sendMessage({
                chatRoomId,
                sender: user._id,
                content: content,
            });

            // 3. Thay thế tin nhắn tạm bằng tin nhắn thật từ server
            setMessages(prev =>
                prev.map(msg => (msg._id === tempId ? finalMessage : msg))
            );
        } catch (error) {
            // 4. Nếu lỗi, xóa tin nhắn tạm và báo lỗi
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        }
    };
    if (!user) {
        return null
    }
    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    type="primary" shape="circle" size="large" icon={<MessageOutlined />}
                    onClick={() => setIsOpen(true)}
                    className="!fixed !bottom-6 !right-6 !w-16 !h-16 !bg-gradient-to-r !from-blue-500 !to-purple-600 !border-none !shadow-2xl hover:!scale-110 !transition-transform !duration-300 !z-50"
                    style={{ animation: 'pulse 2s infinite' }}
                />
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="w-96 bg-white rounded-2xl shadow-2xl !border !border-gray-200 overflow-hidden flex flex-col" style={{ height: '70vh', minHeight: '400px', maxHeight: '600px' }}>
                {/* Header */}
                <div className="bg-white !border-b !border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar size={40} icon={<CustomerServiceOutlined />} className="!bg-gradient-to-r !from-blue-500 !to-purple-600" />
                            <div>
                                <div className="font-semibold text-gray-900">D-Wear Fashion</div>
                                <div className="text-xs text-green-500">Đang hoạt động</div>
                            </div>
                        </div>
                        <Button type="text" icon={<MinusOutlined />} onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center" />
                    </div>
                </div>

                {/* Messages */}
                <div className="overflow-y-auto p-4 bg-white flex-grow">
                    <div className="space-y-3">
                        {messages.map((message) => {
                            const senderId = typeof message.sender === 'object' && message.sender !== null ? message.sender._id : message.sender;
                            const isMe = senderId === user?._id;

                            return (
                                <div key={message._id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!isMe && (
                                        <Avatar size={28} icon={<CustomerServiceOutlined />} className="!bg-gradient-to-r !from-blue-500 !to-purple-600" />
                                    )}
                                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words ${isMe ? 'bg-blue-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'}`}>
                                        {message.content}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Quick Actions & Input */}
                <div className="bg-white !border-t !border-gray-200 p-2">
                    <div className="flex flex-wrap gap-2 mb-2 px-1">
                        {quickActions.map((action) => (
                            <Button key={action.text} size="small" type="default" onClick={() => handleSend(action.value)} className="text-xs h-7 bg-gray-100 hover:bg-gray-200 !border-gray-200 text-gray-700 rounded-full px-3">
                                {action.text}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Aa"
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-sm h-10"
                            onKeyPress={(e) => { if (e.key === 'Enter') handleSend(inputValue); }}
                        />
                        <Button
                            type="primary" icon={<SendOutlined />} onClick={() => handleSend(inputValue)}
                            disabled={!inputValue.trim()}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FashionChatbot;