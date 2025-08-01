import React, { useState, useEffect, useRef } from 'react';
import { Star, ThumbsUp, MessageCircle, Flag, X } from 'lucide-react';
import { Upload, Image, message, Form, Input, Rate, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { checkOrderReviewType } from '../../../types/order/IOrder';
import type { FormValuesReview, IReview } from '../../../types/IReview';
import toast from 'react-hot-toast';
import type { ErrorType } from '../../../types/error/IError';
import { createReviewProduct, fetcheGetRivew } from '../../../services/client/reviewService';
import type { RcFile } from 'antd/es/upload';
import { checkReviewProduct } from '../../../services/client/orderAPI';

const { TextArea } = Input;



interface Props {
    initialReviews: IReview[];
    productId: string;
    chechShowFormReview?: checkOrderReviewType;
}

const ProductReviews: React.FC<Props> = ({ initialReviews, productId, chechShowFormReview }) => {
    const reviewsContainerRef = useRef<HTMLDivElement | null>(null);
    const [form] = Form.useForm();

    const [reviews, setReviews] = useState<IReview[]>(initialReviews);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [canReview, setCanReview] = useState<boolean>(chechShowFormReview?.canReview ?? false);
    const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [reviewsToShow, setReviewsToShow] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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
        setCanReview(chechShowFormReview?.canReview ?? false); // thêm dòng này
    }, [chechShowFormReview]);
    useEffect(() => {
        setShowReviewForm(chechShowFormReview?.canReview ?? false);
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
            day: 'numeric'
        });
    };

    // Giới hạn upload ảnh: chỉ ảnh < 5MB
    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Kích thước ảnh phải nhỏ hơn 5MB!");
            return Upload.LIST_IGNORE;
        }

        // Không upload ngay, chỉ lưu vào fileList
        return false;
    };

    // Xử lý thay đổi file upload
    const handleUploadChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // // Chuyển File sang base64 nếu cần (dùng để preview ảnh)
    // const getBase64 = (file: File): Promise<string> =>
    //     new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result as string);
    //         reader.onerror = (error) => reject(error);
    //     });

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

    const handleSubmitReview = async (values: FormValuesReview) => {
        try {
            setLoading(true);

            // Lấy danh sách ảnh từ fileList
            const images: File[] = fileList
                .map((file) => file.originFileObj as RcFile | undefined)
                .filter((file): file is RcFile => !!file);

            // Tạo FormData để gửi kèm ảnh
            const formData = new FormData();
            formData.append("order_id", chechShowFormReview?.order_id || "");
            formData.append("product_id", productId);
            formData.append("rating", values.rating.toString());
            formData.append("comment", values.comment);

            images.forEach((file) => {
                formData.append("reviewImage", file);
            });

            const res = await createReviewProduct(formData);



            // Reset form
            form.resetFields();
            setFileList([]);
            setShowReviewForm(false);

            if (res) {
                const updatedCheck = await checkReviewProduct(productId);
                setCanReview(updatedCheck.canReview);
                const realoadReview = await fetcheGetRivew(productId)
                setReviews(realoadReview)
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

    const handleCancelReview = () => {
        setShowReviewForm(false);
        form.resetFields();
        setFileList([]);
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

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Thêm ảnh</div>
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

                    {canReview && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Viết đánh giá
                        </button>
                    )}

                </div>

                {showReviewForm && (
                    <div className="bg-white !border !border-gray-200 shadow-sm rounded-lg p-6 mb-8 transform transition-all duration-300 ease-in-out">
                        <h4 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h4>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmitReview}
                            initialValues={{
                                rating: 5,
                                comment: ''
                            }}
                        >
                            <Form.Item
                                label="Đánh giá sao"
                                name="rating"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn số sao đánh giá!' }
                                ]}
                            >
                                <Rate
                                    allowHalf={false}
                                    style={{ fontSize: 24 }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Bình luận"
                                name="comment"
                                rules={[

                                    { min: 5, message: 'Bình luận tối thiểu 10 ký tự!' }
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    showCount
                                    maxLength={1000}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Hình ảnh (tùy chọn)"
                                name="images"
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={beforeUpload}
                                    multiple
                                    maxCount={5}
                                    accept="image/*"
                                >
                                    {fileList.length >= 5 ? null : uploadButton}
                                </Upload>
                                <div className="text-xs text-gray-500 mt-2">
                                    Tối đa 5 hình ảnh. Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <div className="flex gap-3">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        style={{ backgroundColor: '#000', borderColor: '#000' }}
                                    >
                                        Gửi đánh giá
                                    </Button>
                                    <Button onClick={handleCancelReview}>
                                        Hủy
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
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
                                {displayedReviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-white !border !border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={
                                                        review.user_id?.avatar
                                                            ? `http://localhost:5000${review.user_id.avatar}`
                                                            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                                    }
                                                    alt={review.user_id?.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h5 className="font-semibold text-gray-900">{review.user_id.username}</h5>
                                                    {review.is_order && (
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
                                                        {formatDate(review.createdAt)}
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
                                                                            src={`http://localhost:5000${image}`}
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