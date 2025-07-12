export interface ColorOption {
    _id: string;
    color_name: string;
}
export interface ColorRespone {

    message: string,
    data: ColorOption

}
export interface GetColorsResponse {
    color: ColorOption[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}