import { Modal, Button, Tag, Rate, Image, Avatar, Typography, Card } from 'antd';
import {
    MessageOutlined,
    ShoppingOutlined,
    CalendarOutlined,
    LikeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PictureOutlined,
    IdcardOutlined,
    UserOutlined,
    BgColorsOutlined,
    NumberOutlined
} from '@ant-design/icons';
import type { IReviews } from '../../../../types/IReview';
import { formatCurrency } from '../../../../utils/Format';
import { Ruler } from 'lucide-react';
import { getImageUrl } from '../../../../utils/imageUrl';

const { Text, Title } = Typography;

interface ReviewDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    review: IReviews;
    onReply: (reviewId: string | undefined) => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
    visible,
    onCancel,
    review,
    onReply
}) => {
    if (!review) return null;

    const getStatusConfig = (isApproved: boolean) => ({
        color: isApproved ? 'success' : 'warning',
        icon: isApproved ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
        text: isApproved ? 'Đã duyệt' : 'Chờ duyệt'
    });

    const statusConfig = getStatusConfig(review.is_approved);

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <MessageOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <Title level={4} className="mb-0 text-gray-800">
                            Chi tiết đánh giá
                        </Title>
                        <Text type="secondary" className="text-sm">
                            ID: {review._id || 'N/A'}
                        </Text>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            width={900}
            className="review-detail-modal"
            footer={[
                <Button
                    key="close"
                    onClick={onCancel}
                    size="large"
                    className="min-w-[100px]"
                >
                    Đóng
                </Button>,
                <Button
                    key="reply"
                    type="primary"
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={() => onReply(review._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 min-w-[120px] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Phản hồi
                </Button>
            ]}
        >
            <div className="space-y-6">
                {/* Header Card - Thông tin chính */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={56}
                                className="border-2 border-white shadow-sm"
                                src={review.user?.avatar ? getImageUrl(review.user.avatar) : undefined}
                                icon={!review.user?.avatar && <UserOutlined />}
                            />
                            <div>
                                <Text strong className="text-lg text-gray-800">
                                    {review.user.username}
                                </Text>
                                <div className="flex items-center gap-2 mt-1">
                                    <CalendarOutlined className="text-gray-400 text-sm" />
                                    <Text type="secondary" className="text-sm">
                                        {new Date(review.createdAt).toLocaleString('vi-VN')}
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* Status & Rating */}
                        <div className="flex flex-col items-end justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <Tag
                                    color={statusConfig.color}
                                    icon={statusConfig.icon}
                                    className="px-3 py-1 text-sm font-medium rounded-full border-0"
                                >
                                    {statusConfig.text}
                                </Tag>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                <Rate disabled value={review.rating} className="text-base text-yellow-500" />
                                <Text strong className="text-base text-yellow-600 ml-1">
                                    ({review.rating}/5)
                                </Text>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Product Info */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <ShoppingOutlined className="text-blue-500" />
                            <span>Thông tin sản phẩm</span>
                        </div>
                    }
                    className="shadow-sm border-gray-100"
                >
                    <div className="space-y-4">
                        {/* Thông tin sản phẩm chính */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                                    <img
                                        src={getImageUrl(review.product?.imageUrls?.[0])}
                                        alt={review.product.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="pt-1">
                                    <Text strong className="text-blue-600 text-lg block mb-1 hover:underline cursor-pointer">
                                        {review.product.product_name}
                                    </Text>
                                    <Text className="text-red-500 font-bold text-base">
                                        {review.variant.price ? `${formatCurrency(review.variant.price)}` : 'Chưa có giá'}
                                    </Text>
                                </div>
                            </div>

                            {/* Lượt hữu ích bên phải */}
                            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                <LikeOutlined className="text-green-500 text-lg" />
                                <Text strong className="text-green-700">
                                    {review.helpful} lượt hữu ích
                                </Text>
                            </div>
                        </div>

                        {/* Chi tiết biến thể */}
                        <div className="flex flex-wrap items-center gap-6 py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Ruler size={16} />
                                </div>
                                <div>
                                    <Text type="secondary" className="text-xs block leading-tight">Size</Text>
                                    <Text strong className="text-gray-800 text-sm">
                                        {review.variant.size || 'N/A'}
                                    </Text>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <BgColorsOutlined className="text-base" />
                                </div>
                                <div>
                                    <Text type="secondary" className="text-xs block leading-tight">Màu sắc</Text>
                                    <Text strong className="text-gray-800 text-sm">
                                        {review.variant.color || 'N/A'}
                                    </Text>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <NumberOutlined />
                                </div>
                                <div>
                                    <Text type="secondary" className="text-xs block leading-tight">Số lượng</Text>
                                    <Text strong className="text-gray-800 text-sm">
                                        {review.variant.quantity || 0}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Content */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <MessageOutlined className="text-green-500" />
                            <span>Nội dung đánh giá</span>
                        </div>
                    }
                    className="shadow-sm border-gray-100"
                >
                    <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500 shadow-inner">
                        <Text className="text-gray-800 text-base leading-relaxed">
                            {review.comment || (
                                <Text type="secondary" italic>
                                    Người dùng chưa để lại bình luận.
                                </Text>
                            )}
                        </Text>
                    </div>
                </Card>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <PictureOutlined className="text-purple-500" />
                                <span>Hình ảnh đính kèm ({review.images.length})</span>
                            </div>
                        }
                        className="shadow-sm border-gray-100"
                    >
                        <Image.PreviewGroup>
                            <div className="flex flex-wrap gap-4">
                                {review.images.map((img, index) => (
                                    <div key={index} className="relative group overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                        <Image
                                            src={getImageUrl(img)}
                                            alt={`Review image ${index + 1}`}
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            style={{ width: '140px', height: '140px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </Card>
                )}

                {/* Replies */}
                <Card
                    title={
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageOutlined className="text-orange-500" />
                                <span>Phản hồi ({review.replies ? review.replies.length : 0})</span>
                            </div>
                        </div>
                    }
                    className="shadow-sm border-gray-100"
                >
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {review.replies && review.replies.length > 0 ? (
                            review.replies.map((reply, index) => (
                                <div key={reply._id} className="relative">
                                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <Avatar
                                                src={getImageUrl(reply.user?.avatar)}
                                                size={40}
                                                className="border border-blue-200 shadow-sm"
                                                icon={!reply.user?.avatar && <UserOutlined />}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Text strong className="text-blue-800 text-base">
                                                        {reply.user?.username || 'Admin'}
                                                    </Text>
                                                    <Tag color="blue" className="border-0 font-medium">Quản trị viên</Tag>
                                                    <Text type="secondary" className="text-xs ml-auto">
                                                        {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                                    </Text>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg border border-blue-50">
                                                    <Text className="text-gray-700">
                                                        {reply.comment}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {index < review.replies.length - 1 && (
                                        <div className="w-px h-6 bg-blue-200 ml-8 my-1"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                    <MessageOutlined className="text-gray-400 text-2xl" />
                                </div>
                                <Title level={5} type="secondary" className="mb-2">
                                    Chưa có phản hồi nào
                                </Title>
                                <Text type="secondary" className="block mb-4">
                                    Hãy là người đầu tiên phản hồi đánh giá này
                                </Text>
                                <Button 
                                    type="primary" 
                                    ghost 
                                    icon={<MessageOutlined />}
                                    onClick={() => onReply(review._id)}
                                >
                                    Phản hồi ngay
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Technical Info */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <IdcardOutlined className="text-gray-500" />
                            <span>Thông tin kỹ thuật</span>
                        </div>
                    }
                    className="shadow-sm border-gray-100"
                    size="small"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <Text type="secondary" className="block text-xs mb-1 uppercase tracking-wider font-semibold">ID Đơn hàng</Text>
                            <Text strong className="font-mono text-sm text-gray-700 break-all">
                                {review.order_id}
                            </Text>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <Text type="secondary" className="block text-xs mb-1 uppercase tracking-wider font-semibold">ID Sản phẩm</Text>
                            <Text strong className="font-mono text-sm text-gray-700 break-all">
                                {review.product_id}
                            </Text>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <Text type="secondary" className="block text-xs mb-1 uppercase tracking-wider font-semibold">ID Người dùng</Text>
                            <Text strong className="font-mono text-sm text-gray-700 break-all">
                                {review.user_id}
                            </Text>
                        </div>
                    </div>
                </Card>
            </div>
        </Modal>
    );
};

export default ReviewDetailModal;