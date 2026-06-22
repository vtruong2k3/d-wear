import React, { useState, useEffect, useRef } from 'react';
import type { UploadFile } from 'antd';
import type { checkOrderReviewType } from '../../../types/order/IOrder';
import type { FormValuesReview, IReview } from '../../../types/IReview';
import toast from 'react-hot-toast';
import type { ErrorType } from '../../../types/error/IError';
import { createReviewProduct, fetcheGetRivew } from '../../../services/client/reviewService';
import { checkReviewProduct } from '../../../services/client/orderAPI';
import type { RcFile } from 'antd/es/upload';

// Import sub-components
import ReviewSummaryBar from './ReviewSummaryBar';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';

interface Props {
    initialReviews: IReview[];
    productId: string;
    chechShowFormReview?: checkOrderReviewType;
}

const ProductReviews: React.FC<Props> = ({ initialReviews, productId, chechShowFormReview }) => {
    const reviewsContainerRef = useRef<HTMLDivElement | null>(null);

    const [reviews, setReviews] = useState<IReview[]>(initialReviews);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [canReview, setCanReview] = useState<boolean>(chechShowFormReview?.canReview ?? false);
    const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [reviewsToShow, setReviewsToShow] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    useEffect(() => {
        setShowAllReviews(false);
        setReviewsToShow(3);
    }, [reviewFilter]);

    useEffect(() => {
        setShowReviewForm(chechShowFormReview?.canReview ?? false);
        setCanReview(chechShowFormReview?.canReview ?? false);
    }, [chechShowFormReview]);

    const calculateAverageRating = () => {
        if (reviews.length === 0) return "0.0";
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingCounts = () => {
        const counts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            counts[review.rating]++;
        });
        return counts;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleShowMoreReviews = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            if (showAllReviews) {
                setShowAllReviews(false);
                setReviewsToShow(3);
                reviewsContainerRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                setShowAllReviews(true);
            }
            setIsTransitioning(false);
        }, 150);
    };

    const handleSubmitReview = async (values: FormValuesReview, fileList: UploadFile[]) => {
        try {
            setLoading(true);

            // Extract images
            const images: File[] = fileList
                .map((file) => file.originFileObj as RcFile | undefined)
                .filter((file): file is RcFile => !!file);

            // FormData
            const formData = new FormData();
            formData.append("order_id", chechShowFormReview?.order_id || "");
            formData.append("product_id", productId);
            formData.append("rating", values.rating.toString());
            formData.append("comment", values.comment);

            images.forEach((file) => {
                formData.append("reviewImage", file);
            });

            const res = await createReviewProduct(formData);

            setShowReviewForm(false);

            if (res) {
                const updatedCheck = await checkReviewProduct(productId);
                setCanReview(updatedCheck.canReview);
                const realoadReview = await fetcheGetRivew(productId);
                setReviews(realoadReview);
            }
            toast.success(res.message);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const ratingCounts = getRatingCounts();
    const filteredReviews = reviewFilter === 'all'
        ? reviews
        : reviews.filter(review => review.rating === reviewFilter);
    const displayedReviews = showAllReviews
        ? filteredReviews
        : filteredReviews.slice(0, reviewsToShow);

    return (
        <div className="mt-16 mb-16" ref={reviewsContainerRef}>
            <div className="!border-t !border-gray-200 pt-16">
                <h3 className="text-2xl font-bold mb-8 text-gray-900">Đánh giá sản phẩm</h3>

                <ReviewSummaryBar 
                    reviews={reviews} 
                    averageRating={calculateAverageRating()} 
                    ratingCounts={ratingCounts} 
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setReviewFilter('all')}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                                reviewFilter === 'all'
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-transparent hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            Tất cả ({reviews.length})
                        </button>
                        {[5, 4, 3, 2, 1].map(rating => {
                            const count = ratingCounts[rating] || 0;
                            return (
                                <button
                                    key={rating}
                                    onClick={() => setReviewFilter(rating)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                                        reviewFilter === rating
                                            ? 'bg-black text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-transparent hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {rating} sao ({count})
                                </button>
                            );
                        })}
                    </div>

                    {canReview && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 hover:shadow-lg transition-all active:scale-95"
                        >
                            Viết đánh giá
                        </button>
                    )}
                </div>

                {showReviewForm && (
                    <ReviewForm 
                        onSubmit={handleSubmitReview} 
                        onCancel={() => setShowReviewForm(false)} 
                        loading={loading} 
                    />
                )}

                <div className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}`}>
                    <div className="space-y-6">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl">
                                <div className="text-6xl mb-6 opacity-40">🛍️</div>
                                <p className="text-xl font-medium text-gray-500">Chưa có đánh giá nào{reviewFilter !== 'all' ? ` cho ${reviewFilter} sao` : ''}.</p>
                                <p className="text-base text-gray-400 mt-2">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {displayedReviews.map((review) => (
                                    <ReviewCard 
                                        key={review._id} 
                                        review={review} 
                                        formatDate={formatDate} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {filteredReviews.length > 3 && (
                    <div className="text-center mt-10">
                        <button
                            onClick={handleShowMoreReviews}
                            disabled={isTransitioning}
                            className={`group relative inline-flex items-center justify-center min-w-[200px] h-12 px-6 py-3 font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900 transition-all duration-300 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            {isTransitioning ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                    <span>Đang xử lý...</span>
                                </div>
                            ) : showAllReviews ? (
                                <div className="flex items-center gap-2">
                                    <span>Thu gọn đánh giá</span>
                                    <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Xem tất cả {filteredReviews.length} đánh giá</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;