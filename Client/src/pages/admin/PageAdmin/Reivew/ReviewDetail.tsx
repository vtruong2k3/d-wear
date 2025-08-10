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
                                size={48}
                                className="bg-gradient-to-r from-purple-500 to-pink-500"
                                src={review.user?.avatar ? `http://localhost:5000${review.user.avatar}` : undefined}
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
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-3 mb-2">
                                <Tag
                                    color={statusConfig.color}
                                    icon={statusConfig.icon}
                                    className="px-3 py-1 text-sm font-medium rounded-full"
                                >
                                    {statusConfig.text}
                                </Tag>
                            </div>
                            <div className="flex items-center gap-2">
                                <Rate disabled value={review.rating} className="text-lg" />
                                <Text strong className="text-lg text-yellow-600">
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
                    className="shadow-sm"
                >
                    <div className="space-y-3">
                        {/* Thông tin sản phẩm chính */}
                        <div className="flex items-center justify-between">
                            {/* Thông tin bên trái */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        review.product?.imageUrls?.[0]?.startsWith("http")
                                            ? review.product.imageUrls[0]
                                            : `http://localhost:5000/${review.product?.imageUrls?.[0]}`
                                    }
                                    alt={review.product.product_name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <Text strong className="text-blue-600 text-lg block">
                                        {review.product.product_name}
                                    </Text>
                                    <Text className="text-red-500 font-semibold text-base">
                                        {review.variant.price ? `${formatCurrency(review.variant.price)}` : 'Chưa có giá'}
                                    </Text>
                                </div>
                            </div>

                            {/* Lượt hữu ích bên phải */}
                            <div className="flex items-center gap-2">
                                <LikeOutlined className="text-green-500" />
                                <Text strong className="text-green-600">
                                    {review.helpful} lượt hữu ích
                                </Text>
                            </div>
                        </div>

                        {/* Chi tiết sản phẩm - trên cùng một dòng */}
                        <div className="flex items-center justify-between gap-6 py-2 px-3 bg-gray-50 rounded-lg">
                            {/* Size */}
                            <div className="flex items-center gap-2">
                                <Avatar size={24} className="bg-blue-100 text-blue-600" icon={<Ruler size={16} />} />
                                <Text type="secondary" className="text-sm">Size:</Text>
                                <Text strong className="text-gray-800 text-sm">
                                    {review.variant.size || 'Không có size'}
                                </Text>
                            </div>

                            {/* Color */}
                            <div className="flex items-center gap-2">
                                <BgColorsOutlined className="text-gray-500 text-base" />
                                <Text type="secondary" className="text-sm">Màu:</Text>
                                <Text strong className="text-gray-800 text-sm">
                                    {review.variant.color || 'không có màu'}
                                </Text>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-2">

                                <Avatar size={24} className="bg-green-100 text-green-600" icon={<NumberOutlined />} />

                                <Text type="secondary" className="text-sm">SL:</Text>
                                <Text strong className="text-gray-800 text-sm">
                                    {review.variant.quantity || 0}
                                </Text>
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
                    className="shadow-sm"
                >
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <Text className="text-gray-800 text-base leading-relaxed ">
                            {review.comment || (
                                <Text type="secondary" italic>
                                    Người dùng chưa để lại bình luận
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
                        className="shadow-sm"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {review.images.map((img, index) => (
                                <div key={index} className="group relative">
                                    <Image
                                        width={55}
                                        height={100}
                                        src={`http://localhost:5000${img}`}
                                        className="rounded-lg object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300"
                                        placeholder={
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
                                                <PictureOutlined className="text-gray-400 text-xl" />
                                            </div>
                                        }
                                    />
                                </div>
                            ))}
                        </div>
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
                    className="shadow-sm"
                >
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {review.replies && review.replies.length > 0 ? (
                            review.replies.map((reply, index) => (
                                <div key={reply._id} className="relative">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <Avatar
                                                src={`http://localhost:5000${reply.user?.avatar}`}
                                                size={32}
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500"
                                            >

                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Text strong className="text-blue-700">
                                                        {reply.user?.username}
                                                    </Text>
                                                    <Text type="secondary" className="text-xs">
                                                        {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                                    </Text>
                                                </div>
                                                <Text className="text-gray-800">
                                                    {reply.comment}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                    {index < review.replies.length - 1 && (
                                        <div className="w-px h-4 bg-gray-200 ml-4 mt-2"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageOutlined className="text-gray-400 text-2xl" />
                                </div>
                                <Title level={5} type="secondary" className="mb-2">
                                    Chưa có phản hồi nào
                                </Title>
                                <Text type="secondary">
                                    Hãy là người đầu tiên phản hồi đánh giá này
                                </Text>
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
                    className="shadow-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                            <Text type="secondary" className="block text-sm mb-1">ID Đơn hàng</Text>
                            <Text strong className="font-mono text-lg text-gray-700">
                                {review.order_id}
                            </Text>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            <Text type="secondary" className="block text-sm mb-1">ID Sản phẩm</Text>
                            <Text strong className="font-mono text-lg text-blue-700">
                                {review.product_id}
                            </Text>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                            <Text type="secondary" className="block text-sm mb-1">ID Người dùng</Text>
                            <Text strong className="font-mono text-lg text-purple-700">
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