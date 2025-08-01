import axios from "axios";

// 1. Tạo phòng chat mới cho khách hàng (chỉ chứa 1 user)
export const createChatRoom = async (userId: string) => {
  const res = await axios.post("/api/chat-rooms", { userId });
  return res.data;
};

// 2. Lấy danh sách phòng chờ (chỉ có 1 user, dành cho admin)
export const getWaitingRooms = async () => {
  const res = await axios.get("/api/chat-rooms/waiting");
  return res.data;
};

// 3. Admin join vào phòng chat với khách hàng
export const joinChatRoom = async (roomId: string, adminId: string) => {
  const res = await axios.patch(`/api/chat-rooms/${roomId}/join`, { adminId });
  return res.data;
};

// 4. Gửi tin nhắn trong phòng chat
export const sendMessage = async (messageData: {
  chatRoomId: string;
  sender: string; // userId hoặc adminId
  content: string;
}) => {
  const res = await axios.post("/api/messages", messageData);
  return res.data;
};

// 5. Lấy toàn bộ tin nhắn trong 1 phòng chat
export const getMessages = async (chatRoomId: string) => {
  const res = await axios.get(`/api/messages/${chatRoomId}`);
  return res.data;
};

// 6. Lấy danh sách các phòng chat của một user (admin hoặc khách)
export const getUserChatRooms = async (userId: string) => {
  const res = await axios.get(`/api/chat-rooms/user/${userId}`);
  return res.data;
};
