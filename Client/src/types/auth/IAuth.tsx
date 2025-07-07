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
    username: string;
    email?: string;
    avatar?: string;
    role?: string;
}

// Interface state
export interface AuthState {
    user: User | null;
    token: string | null;
    isLogin: boolean;
    loading: boolean;
    error: string | null;
}
