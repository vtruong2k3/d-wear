interface User {
    _id: string,
    username: string,
    avatar: string
}
interface Product {
    _id: string
    product_name: string,
    imageUrls: string[]
}
interface Variant {
    size: string,
    color: string,
    price: number,
    quantity: number
}
export interface IReviewReplyUI {
    _id: string;
    comment: string;
    createdAt: string;
    user?: User
}
interface TypeReplies {
    _id: string
    review_id: string
    user_id: User
    comment: string,
    createdAt: string,
    updatedAt: string
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
    replies: TypeReplies[]
    createdAt: string
}
export interface TypeStatus {
    total: number,
    approved: number,
    notApproved: number,
    withReply: number,
    avgRating: number
}
export interface IReviews {
    _id: string,
    user_id: string,
    product_id: string,
    order_id: string,
    images: string[],
    comment: string,
    rating: number
    is_approved: boolean,
    is_order: boolean,
    helpful: number
    createdAt: string,
    updatedAt: string,
    user: User,
    product: Product
    variant: Variant

    replies: IReviewReplyUI[]
    hasReply: boolean
}

export interface ReviewRespone {
    page: number,
    limit: number
    total: number,
    totalPages: number
    stats: TypeStatus
    reviews: IReviews[]
}
export type FormValuesReview = {
    product_id: string
    order_id: string
    rating: number;
    comment: string;
    images?: File[];
};