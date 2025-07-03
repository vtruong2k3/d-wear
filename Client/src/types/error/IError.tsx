export interface ErrorType {
    error: string,
    message: string

    response?: {
        data?: {
            message: string;
        };
    };
}