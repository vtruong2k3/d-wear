export interface UserType {
    _id: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    phone?: string;
    isDeleted?: boolean; // Thêm field xóa mềm
}