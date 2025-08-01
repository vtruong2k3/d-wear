interface User {
    _id: string,
    username: string,
    avatar: string
}

export interface IReview {
    _id: string,
    user_id: User
    product_id: string,
    order_id: string,
    rating: number,
    images: [string],
    comment: string
    is_approved: boolean
    is_order: boolean
    helpful: number
    createdAt: string
}

export type FormValuesReview = {
    product_id: string
    order_id: string
    rating: number;
    comment: string;
    images?: File[];
};