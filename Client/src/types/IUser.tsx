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

export interface IUsers {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    isActive: boolean;
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    phone?: string;

}
export interface IUsersDetail {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    isActive: boolean;
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    phone?: string;
    isGoogleAccount?: boolean;

}
export interface CreateUser {
    username: string;
    email: string;
    password?: string;
    phone?: string;
    role?: "user" | "admin";
    isActive?: boolean;
    avatar?: File | null;      // ← file ảnh
}
