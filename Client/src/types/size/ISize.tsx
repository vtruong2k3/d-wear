export interface SizeOption {
    _id: string;
    size_name: string;
}
export interface SizeResponse {
    message: string,
    data: SizeOption

}
export interface GetSizesResponse {
    message: string;
    size: SizeOption[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}