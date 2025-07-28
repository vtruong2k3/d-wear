import React, { useState, useEffect, useRef } from 'react';
import { Star, ThumbsUp, MessageCircle, Flag, X } from 'lucide-react';
import { Upload, Image, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

interface IReview {
    _id: string;
    user_name: string;
    user_avatar?: string;
    rating: number;
    comment: string;
    images?: string[];
    created_at: string;
    verified_purchase: boolean;
}

interface Props {
    initialReviews: IReview[];
    productId: string;
}

const ProductReviews: React.FC<Props> = ({ initialReviews, productId }) => {
    const reviewsContainerRef = useRef<HTMLDivElement | null>(null);

    const [reviews, setReviews] = useState<IReview[]>(initialReviews);
    const [showReviewForm, setShowReviewForm] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "", images: [] as string[] });
    const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [reviewsToShow, setReviewsToShow] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    useEffect(() => {
        setShowAllReviews(false);
        setReviewsToShow(3);
    }, [reviewFilter]);

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
            day: 'numeric'
        });
    };

    // Xử lý upload ảnh với Ant Design
    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        // Chuyển đổi fileList thành mảng base64 strings
        const imageUrls: string[] = [];
        newFileList.forEach(file => {
            if (file.originFileObj) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target?.result as string;
                    imageUrls.push(imageUrl);
                    if (imageUrls.length === newFileList.length) {
                        setNewReview(prev => ({ ...prev, images: imageUrls }));
                    }
                };
                reader.readAsDataURL(file.originFileObj);
            }
        });

        if (newFileList.length === 0) {
            setNewReview(prev => ({ ...prev, images: [] }));
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được upload file ảnh!');
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
            return false;
        }

        return false; // Ngăn upload tự động, chỉ xử lý local
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

    const handleSubmitReview = () => {
        if (newReview.comment.trim() === "") {
            message.error("Vui lòng nhập bình luận");
            return;
        }

        const review: IReview = {
            _id: `r${Date.now()}`,
            user_name: "Bạn",
            user_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            rating: newReview.rating,
            comment: newReview.comment,
            images: newReview.images.length > 0 ? newReview.images : undefined,
            created_at: new Date().toISOString(),
            verified_purchase: true
        };

        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: "", images: [] });
        setFileList([]);
        setShowReviewForm(false);
        message.success("Đã gửi đánh giá thành công!");
    };

    const StarIcon = ({ filled }: { filled: boolean }) => (
        <Star
            className={`w-5 h-5 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
    );

    const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-full">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>
                <img
                    src={imageUrl}
                    alt="Review image"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );

    const ratingCounts = getRatingCounts();
    const filteredReviews = reviewFilter === 'all'
        ? reviews
        : reviews.filter(review => review.rating === reviewFilter);
    const displayedReviews = showAllReviews
        ? filteredReviews
        : filteredReviews.slice(0, reviewsToShow);

    return (
        <div className="mt-16 mb-16" ref={reviewsContainerRef}>
            <div className="!border-t !border-gray-300 pt-16">
                <h3 className="text-2xl font-semibold mb-8">Đánh giá sản phẩm</h3>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-500 mb-2">
                                {calculateAverageRating()}
                            </div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < Math.floor(parseFloat(calculateAverageRating()))} />
                                ))}
                            </div>
                            <div className="text-sm text-gray-600">{reviews.length} đánh giá</div>
                        </div>

                        <div className="flex-1">
                            {Object.entries(ratingCounts).reverse().map(([rating, count]) => (
                                <div key={rating} className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center gap-1 text-sm w-8">
                                        {rating} <StarIcon filled={true} />
                                    </span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setReviewFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm transition-colors ${reviewFilter === 'all'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
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
                                    className={`px-4 py-2 rounded-md text-sm transition-colors ${reviewFilter === rating
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    {rating} sao ({count})
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Viết đánh giá
                    </button>
                </div>

                {showReviewForm && (
                    <div className="bg-white !border !border-gray-200 shadow-sm rounded-lg p-6 mb-8 transform transition-all duration-300 ease-in-out">
                        <h4 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h4>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Đánh giá sao</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <button
                                        key={rating}
                                        onClick={() => setNewReview({ ...newReview, rating })}
                                        className="w-6 h-6 transition-all duration-200 hover:scale-110"
                                    >
                                        <StarIcon filled={rating <= newReview.rating} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Bình luận</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="w-full p-3 !border !border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Hình ảnh (tùy chọn)</label>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={beforeUpload}
                                multiple
                                maxCount={5}
                                accept="image/*"
                                className="review-upload"
                            >
                                {fileList.length >= 5 ? null : (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-2xl text-gray-400 mb-2">+</div>
                                        <div className="text-sm text-gray-600">Thêm ảnh</div>
                                    </div>
                                )}
                            </Upload>
                            <p className="text-xs text-gray-500 mt-2">
                                Tối đa 5 hình ảnh. Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitReview}
                                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Gửi đánh giá
                            </button>
                            <button
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setNewReview({ rating: 5, comment: "", images: [] });
                                    setFileList([]);
                                }}
                                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}

                <div
                    className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-75 scale-[0.98]' : 'opacity-100 scale-100'}`}
                >
                    <div className="space-y-6">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-4">💬</div>
                                <p>Chưa có đánh giá nào{reviewFilter !== 'all' ? ` cho ${reviewFilter} sao` : ''}.</p>
                                <p className="text-sm mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                            </div>
                        ) : (
                            <>
                                {displayedReviews.map((review, index) => (
                                    <div
                                        key={review._id}
                                        className="bg-white !border !border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={review.user_avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                                                    alt={review.user_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h5 className="font-semibold text-gray-900">{review.user_name}</h5>
                                                    {review.verified_purchase && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            ✓ Đã mua hàng
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon key={i} filled={i < review.rating} />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(review.created_at)}
                                                    </span>
                                                </div>
                                                <div className="text-gray-700 leading-relaxed mb-4">
                                                    <p>{review.comment}</p>
                                                </div>

                                                {review.images && review.images.length > 0 && (
                                                    <div className="mb-4">
                                                        <Image.PreviewGroup>
                                                            <div className="grid grid-cols-8 gap-1">
                                                                {review.images.map((image, imgIndex) => (
                                                                    <div key={imgIndex} className="relative">
                                                                        <Image
                                                                            src={image}
                                                                            alt={`Review image ${imgIndex + 1}`}
                                                                            className="w-full h-11 object-cover rounded-md border border-gray-200"
                                                                            style={{ width: '100%', height: '124px' }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Image.PreviewGroup>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                                        <ThumbsUp className="w-4 h-4" />
                                                        Hữu ích (0)
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                                        <MessageCircle className="w-4 h-4" />
                                                        Trả lời
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                                                        <Flag className="w-4 h-4" />
                                                        Báo cáo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {filteredReviews.length > 3 && (
                    <div className="text-center mt-8">
                        <button
                            onClick={handleShowMoreReviews}
                            disabled={isTransitioning}
                            className={`min-w-[180px] h-12 bg-transparent text-gray-700 px-6 py-3 transition-all duration-300 hover:text-black hover:scale-105 flex items-center justify-center gap-2 mx-auto font-medium text-sm ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            {isTransitioning ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 !border-2 !border-gray-300 !border-t-gray-600 rounded-full animate-spin"></div>
                                    <span>Đang tải...</span>
                                </div>
                            ) : showAllReviews ? (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span>Thu gọn</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span>Xem thêm</span>
                                </div>
                            )}
                        </button>

                        <div className="mt-4 flex justify-center">
                            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                                Hiển thị {displayedReviews.length} / {filteredReviews.length} bình luận
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div
                                        className="bg-blue-500 h-1 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${(displayedReviews.length / filteredReviews.length) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default ProductReviews;