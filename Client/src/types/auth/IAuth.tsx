export interface LoginResponse {
    token: string;
    message: string;
}
export type LoginFormValues = {
    email: string;
    password: string;
};
export interface LoginGoogle {
    email: string;

}

export interface User {
    _id: string;
    username?: string;
    email?: string;
    phone?: string;
    isGoogleAccount: boolean;
    role: "user" | "admin";
    isActive: boolean;
    avatar?: string | File; // ✅ sửa chỗ này
    createdAt: string;
    updatedAt: string;
}


// Interface state
export interface AuthState {
    user: User | null;
    token: string | null;
    isLogin: boolean;
    loading: boolean;
    error: string | null;

}
export interface AuthStateAdmin {
    user: User | null;
    token: string | null;
    isLogin: boolean;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}
export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}
export interface LoginFormData {
    email: string;
    password: string;
}