interface Sender {
    _id: string;

}
export interface ChatMessage {
    _id: string;              // ID của message (Mongo ObjectId dưới dạng string)
    sender: string | Sender;           // ID của người gửi (ObjectId dạng string)
    content: string;          // Nội dung tin nhắn
    chatRoomId: string;       // ID của phòng chat
    read: boolean;            // Trạng thái đã đọc hay chưa
    createdAt: string;        // ISO Date dạng string (hoặc dùng Date nếu bạn convert)
    updatedAt: string;        // ISO Date
}

export interface ChatRoomUser {
    _id: string;
    username: string;
    avatar: string;
}

export interface WaitingChatRoom {
    _id: string;
    unreadCount: number
    createdAt: string;
    updatedAt: string;
    members: ChatRoomUser[];
    read: boolean;
    lastMessage: string | null;
    lastActive: string | null;
}

export type OptimisticChatMessage = {
    _id: string;
    chatRoomId: string;
    sender: ChatRoomUser;
    content: string;
    read: boolean;
};