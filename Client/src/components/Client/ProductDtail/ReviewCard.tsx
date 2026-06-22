import React from 'react';
import { ThumbsUp, MessageCircle, Flag, Star, ShieldCheck } from 'lucide-react';
import { Image, Avatar } from 'antd';
import type { IReview } from '../../../types/IReview';
import { getImageUrl } from '../../../utils/imageUrl';

interface Props {
    review: IReview;
    formatDate: (dateString: string) => string;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
    <Star className={`w-4 h-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
);

const ReviewCard: React.FC<Props> = ({ review, formatDate }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-blue-100 to-blue-50 flex-shrink-0 border-2 border-white shadow-sm">
                    <img
                        src={review.user_id?.avatar ? getImageUrl(review.user_id.avatar) : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                        alt={review.user_id?.username}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    {/* Header: Name + Badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <h5 className="font-bold text-gray-900 text-base">{review.user_id?.username}</h5>
                        {review.is_order && (
                            <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium border border-green-100">
                                <ShieldCheck className="w-3 h-3" /> Đã mua hàng
                            </span>
                        )}
                    </div>

                    {/* Rating + Date */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} filled={i < review.rating} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-400 font-medium">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>

                    {/* Comment text */}
                    <div className="text-gray-700 leading-relaxed mb-4 text-[15px]">
                        <p>{review.comment}</p>
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                        <div className="mb-5">
                            <Image.PreviewGroup>
                                <div className="flex flex-wrap gap-2">
                                    {review.images.map((image: string, imgIndex: number) => (
                                        <div key={imgIndex} className="relative group overflow-hidden rounded-lg">
                                            <Image
                                                src={getImageUrl(image)}
                                                alt={`Review image ${imgIndex + 1}`}
                                                className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                                                style={{ width: '96px', height: '96px' }}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            </Image.PreviewGroup>
                        </div>
                    )}

                    {/* Admin Replies */}
                    {review.replies && review.replies.length > 0 && (
                        <div className="mb-5 space-y-3">
                            {review.replies.map((reply: any, replyIndex: number) => (
                                <div key={reply._id || replyIndex} className="relative ml-2">
                                    {/* Line connecting */}
                                    <div className="absolute -left-4 top-6 bottom-0 w-px bg-blue-200"></div>
                                    
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-xl p-4 border border-blue-100/50 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0 border border-blue-100">
                                                <img
                                                    src={reply.user_id?.avatar ? getImageUrl(reply.user_id.avatar) : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                                                    alt={reply.user_id?.username || "Admin"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span className="font-bold text-blue-800 text-sm">
                                                        {reply.user_id?.username || "D-Wear Admin"}
                                                    </span>
                                                    <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                                                        Phản hồi từ Shop
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {formatDate(reply.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {reply.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Interaction Buttons */}
                    <div className="flex items-center gap-5 text-sm text-gray-500 font-medium pt-2 border-t border-gray-50">
                        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 group">
                            <div className="p-1.5 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                            </div>
                            Hữu ích ({review.helpful || 0})
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 group">
                            <div className="p-1.5 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            Trả lời
                            {review.replies && review.replies.length > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-1 font-bold">
                                    {review.replies.length}
                                </span>
                            )}
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors py-1 group ml-auto">
                            <Flag className="w-4 h-4" />
                            <span className="hidden sm:inline">Báo cáo</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
