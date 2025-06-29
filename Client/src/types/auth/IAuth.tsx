export interface LoginResponse {
    token: string;
    message: string;
}
export type LoginFormValues = {
    email: string;
    password: string;
};