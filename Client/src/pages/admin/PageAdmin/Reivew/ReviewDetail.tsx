
import { Modal, Button, Tag, Rate, Image } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const ReviewDetailModal = ({
    visible,
    onCancel,
    review,
    onReply
}) => {
    if (!review) return null;

    return (
        <Modal
            title="Chi tiết bình luận"
            open={visible}
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="close" onClick={onCancel}>
                    Đóng
                </Button>,
                <Button
                    key="reply"
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={() => onReply(review)}
                    className="bg-blue-500"
                >
                    Phản hồi
                </Button>
            ]}
        >
            <div className="space-y-4">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <span className="font-medium text-gray-700">Người dùng:</span>
                        <p className="text-gray-900">{review.userName}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Sản phẩm:</span>
                        <p className="text-blue-600">{review.productName}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Đánh giá:</span>
                        <Rate disabled defaultValue={review.rating} />
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Trạng thái:</span>
                        <Tag color={review.is_approved ? 'green' : 'red'} className="ml-2">
                            {review.is_approved ? 'Đã duyệt' : 'Chờ duyệt'}
                        </Tag>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Ngày tạo:</span>
                        <p className="text-gray-900">
                            {new Date(review.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Hữu ích:</span>
                        <p className="text-green-600 font-medium">{review.helpful} lượt</p>
                    </div>
                </div>

                {/* Nội dung bình luận */}
                <div>
                    <h4 className="font-medium text-gray-700 mb-2">Nội dung bình luận:</h4>
                    <div className="p-3 bg-white !border !border-gray-200 rounded-lg">
                        <p className="text-gray-900">{review.comment || 'Không có bình luận'}</p>
                    </div>
                </div>

                {/* Hình ảnh */}
                {review.images && review.images.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                            Hình ảnh đính kèm ({review.images.length}):
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {review.images.map((img, index) => (
                                <Image
                                    key={index}
                                    width={100}
                                    height={100}
                                    src={img}
                                    className="rounded object-cover !border"
                                    placeholder={
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            Loading...
                                        </div>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Phản hồi */}
                <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                        Phản hồi ({review.replies ? review.replies.length : 0})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {review.replies && review.replies.length > 0 ? (
                            review.replies.map((reply) => (
                                <div key={reply.id} className="p-3 bg-blue-50 rounded-lg !border-l-4 !border-blue-500">
                                    <div className="space-y-1">
                                        <p className="text-gray-900">{reply.content}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500">
                                                <span className="font-medium">{reply.author}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-2">
                                    <MessageOutlined className="text-2xl" />
                                </div>
                                <p className="text-gray-500">Chưa có phản hồi nào</p>
                                <p className="text-xs text-gray-400">Hãy thêm phản hồi đầu tiên</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin bổ sung */}
                <div className="pt-4 !border-t !border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <p className="text-gray-500">ID Đơn hàng</p>
                            <p className="font-mono text-gray-900">{review.order_id}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500">ID Sản phẩm</p>
                            <p className="font-mono text-gray-900">{review.product_id}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500">ID Người dùng</p>
                            <p className="font-mono text-gray-900">{review.user_id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReviewDetailModal;