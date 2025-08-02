import { useState, useRef, useEffect } from "react";
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
  message,
} from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import type {
  WaitingChatRoom,
  ChatMessage,
  ChatRoomUser,
} from "../../../../types/message/IMessage";
// Đổi tên hàm import cho rõ nghĩa hoặc giữ nguyên getWaitingRooms đều được
import {
  getMessages,
  sendMessage,
  joinChatRoom,
} from "../../../../services/client/messageService";
import socket from "../../../../sockets/socket";
import { format } from "date-fns";
import { getAdminChatRooms } from "../../../../services/admin/messageServiceAdmin";
import type { ErrorType } from "../../../../types/error/IError";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminMessageManager = () => {
  const [customers, setCustomers] = useState<WaitingChatRoom[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<WaitingChatRoom | null>(null);
  const [messages, setMessages] = useState<{ [roomId: string]: ChatMessage[] }>(
    {}
  );
  const [replyMessage, setReplyMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const user = useSelector((state: RootState) => state.authAdminSlice.user);
  const selectedCustomerIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect 1: Lấy dữ liệu ban đầu và cài đặt socket
  useEffect(() => {
    if (!user) return;
    const fetchInitialRooms = async () => {
      try {
        const rooms = await getAdminChatRooms(user._id);
        const sortedRooms = rooms.sort(
          (a: WaitingChatRoom, b: WaitingChatRoom) =>
            new Date(b.lastActive || 0).getTime() -
            new Date(a.lastActive || 0).getTime()
        );
        setCustomers(sortedRooms);
        if (sortedRooms.length > 0 && !selectedCustomerIdRef.current) {
          setSelectedCustomer(sortedRooms[0]);
        }
      } catch (error) {
        antMessage.error("Không thể tải danh sách phòng chat.");
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      }
    };
    fetchInitialRooms();
    socket.connect();
    socket.emit("adminJoin", user._id);

    const handleReceiveMessage = (newMessage: ChatMessage) => {
      const senderId =
        typeof newMessage.sender === "object" && newMessage.sender !== null
          ? newMessage.sender._id
          : newMessage.sender;
      if (senderId !== user._id) {
        setMessages((prev) => ({
          ...prev,
          [newMessage.chatRoomId]: [
            ...(prev[newMessage.chatRoomId] || []),
            newMessage,
          ],
        }));
      }
    };
    const handleNewRoom = (newRoom: WaitingChatRoom) => {
      setCustomers((prev) => {
        if (prev.find((c) => c._id === newRoom._id)) return prev;
        return [newRoom, ...prev];
      });
    };
    const handleUpdateRoomList = (message: ChatMessage) => {
      setCustomers((prevCustomers) => {
        const roomExists = prevCustomers.some(
          (c) => c._id === message.chatRoomId
        );
        if (roomExists) {
          const updatedCustomers = prevCustomers.map((c) =>
            c._id === message.chatRoomId
              ? {
                  ...c,
                  lastMessage: message.content,
                  lastActive: message.createdAt,
                  unreadCount:
                    c._id !== selectedCustomerIdRef.current
                      ? (c.unreadCount || 0) + 1
                      : 0,
                }
              : c
          );
          return updatedCustomers.sort(
            (a: WaitingChatRoom, b: WaitingChatRoom) =>
              new Date(b.lastActive!).getTime() -
              new Date(a.lastActive!).getTime()
          );
        }
        return prevCustomers;
      });
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("newRoom", handleNewRoom);
    socket.on("updateRoomList", handleUpdateRoomList);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("newRoom", handleNewRoom);
      socket.off("updateRoomList", handleUpdateRoomList);
      socket.disconnect();
    };
  }, [user]);

  // Effect 2: Xử lý khi chọn một khách hàng khác
  useEffect(() => {
    selectedCustomerIdRef.current = selectedCustomer?._id || null;

    if (selectedCustomer && user) {
      const handleJoinAndFetch = async () => {
        try {
          const isAdminMember = selectedCustomer.members.some(
            (member: ChatRoomUser) => String(member._id) === user._id
          );
          if (!isAdminMember) {
            await joinChatRoom(selectedCustomer._id, user._id);
            setCustomers((prev) =>
              prev.map((c) =>
                c._id === selectedCustomer._id
                  ? { ...c, members: [...c.members, user as ChatRoomUser] }
                  : c
              )
            );
          }

          socket.emit("joinRoom", selectedCustomer._id);

          // 1. Kiểm tra xem phòng có tin nhắn chưa đọc không
          const roomData = customers.find(
            (c) => c._id === selectedCustomer._id
          );

          const hasUnreadMessages =
            roomData?.unreadCount && roomData.unreadCount > 0;

          // 2. Tải lại tin nhắn nếu chưa có hoặc khi có tin nhắn chưa đọc
          if (!messages[selectedCustomer._id] || hasUnreadMessages) {
            const messageHistory = await getMessages(selectedCustomer._id);
            setMessages((prev) => ({
              ...prev,
              [selectedCustomer._id]: messageHistory,
            }));
          }

          // Reset số tin nhắn chưa đọc sau khi đã bấm vào xem

          if (roomData?.unreadCount > 0) {
            setCustomers((prev) =>
              prev.map((c) =>
                c._id === selectedCustomer._id ? { ...c, unreadCount: 0 } : c
              )
            );
          }
        } catch (error) {
          antMessage.error("Lỗi khi tải phòng chat.");
          const errorMessage =
            (error as ErrorType).response?.data?.message ||
            (error as ErrorType).message ||
            "Đã xảy ra lỗi, vui lòng thử lại.";
          message.error(errorMessage);
        }
      };
      handleJoinAndFetch();
    }

    return () => {
      if (selectedCustomer) {
        socket.emit("leaveRoom", selectedCustomer._id);
      }
    };
  }, [selectedCustomer, user, customers, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedCustomer]);

  // Hàm gửi tin nhắn dùng Optimistic Update
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedCustomer || !user) return;
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      chatRoomId: selectedCustomer._id,
      sender: user,
      content: replyMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedCustomer._id]: [
        ...(prev[selectedCustomer._id] || []),
        optimisticMessage,
      ],
    }));
    setReplyMessage("");
    try {
      const finalMessage = await sendMessage({
        chatRoomId: selectedCustomer._id,
        sender: user._id,
        content: optimisticMessage.content,
      });
      setMessages((prev) => {
        const newRoomMessages = prev[selectedCustomer._id].map((msg) =>
          msg._id === tempId ? finalMessage : msg
        );
        return { ...prev, [selectedCustomer._id]: newRoomMessages };
      });
    } catch (error) {
      setMessages((prev) => {
        const newRoomMessages = prev[selectedCustomer._id].filter(
          (msg) => msg._id !== tempId
        );
        return { ...prev, [selectedCustomer._id]: newRoomMessages };
      });
      antMessage.error("Gửi tin nhắn thất bại.");
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  // --- RENDER ---
  return (
    <Layout className="h-screen bg-gray-50">
      <Header className="bg-white shadow-sm !border-b !border-gray-200 px-6">
        <Title level={3} className="!mb-0 !text-gray-800">
          Quản lý Tin nhắn Khách hàng
        </Title>
      </Header>
      <Layout className="h-full">
        <Sider
          width={350}
          className="bg-white !border-r !border-gray-200 overflow-hidden"
        >
          <div className="p-4 !border-b !border-gray-100">
            <Title level={5} className="!mb-0">
              Danh sách khách hàng
            </Title>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            <List
              dataSource={customers}
              renderItem={(customer) => (
                <List.Item
                  className={`px-4 py-3 cursor-pointer transition-all hover:bg-blue-50 
                                    ${
                                      selectedCustomer?._id === customer._id
                                        ? "bg-blue-50 !border-r-4 !border-blue-500"
                                        : "!border-r-4 !border-transparent"
                                    }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={customer.unreadCount}
                        size="small"
                        offset={[-5, 30]}
                      >
                        <Avatar
                          src={customer.members?.[0].avatar}
                          icon={<UserOutlined />}
                          size="large"
                        />
                      </Badge>
                    }
                    title={
                      <Text strong className="text-gray-800">
                        {customer.members?.[0].username}
                      </Text>
                    }
                    description={
                      <div>
                        <Text
                          className={`block text-sm ${
                            customer.unreadCount && customer.unreadCount > 0
                              ? "font-bold text-gray-900"
                              : "text-gray-500"
                          }`}
                          ellipsis={{ tooltip: customer.lastMessage }}
                        >
                          {customer.lastMessage}
                        </Text>
                        <Text type="secondary" className="text-xs mt-1 block">
                          {customer.lastActive
                            ? format(
                                new Date(customer.lastActive),
                                "p, dd/MM/yy"
                              )
                            : "Chưa có hoạt động"}
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
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={selectedCustomer.members?.[0].avatar}
                    icon={<UserOutlined />}
                    size="large"
                  />
                  <div>
                    <Title level={4} className="!mb-1">
                      {selectedCustomer.members?.[0].username}
                    </Title>
                    <Text type="secondary">
                      {selectedCustomer.lastActive
                        ? `Hoạt động lần cuối: ${format(
                            new Date(selectedCustomer.lastActive),
                            "p, dd/MM/yy"
                          )}`
                        : "Đang hoạt động"}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {(messages[selectedCustomer._id] || []).map((msg) => {
                    // SỬA LỖI Ở ĐÂY: Thêm logic để lấy ID người gửi một cách an toàn
                    const senderId =
                      typeof msg.sender === "object" && msg.sender !== null
                        ? msg.sender._id
                        : msg.sender;
                    const isMe = String(senderId) === user?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Sử dụng biến 'isMe' đã được kiểm tra an toàn */}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-lg"
                              : "bg-white text-gray-800 !border !border-gray-200 rounded-bl-lg"
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {msg.content}
                          </div>
                          <div
                            className={`text-xs mt-2 text-right ${
                              isMe ? "text-blue-100" : "text-gray-400"
                            }`}
                          >
                            {format(new Date(msg.createdAt), "p")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                      size="large"
                    >
                      Gửi
                    </Button>
                  </div>
                  <Text type="secondary" className="text-xs mt-2 block">
                    Nhấn Enter để gửi, Shift + Enter để xuống dòng.
                  </Text>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Empty description="Chọn một khách hàng để bắt đầu trò chuyện" />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminMessageManager;
