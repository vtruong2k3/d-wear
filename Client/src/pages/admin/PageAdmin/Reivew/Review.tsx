import { useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Rate, Modal, Input, message, Popconfirm, Select, DatePicker, Card, Row, Col, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, EyeInvisibleOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import ReviewDetailModal from './ReviewDetail';
import dayjs from 'dayjs';

const { TextArea, Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data mẫu
const mockReviews = [
    {
        id: '1',
        user_id: 'user1',
        userName: 'Nguyễn Văn A',
        product_id: 'prod1',
        productName: 'iPhone 15 Pro Max',
        order_id: 'order1',
        rating: 5,
        comment: 'Sản phẩm rất tốt, giao hàng nhanh, đóng gói cẩn thận. Tôi rất hài lòng với sản phẩm này.',
        images: ['https://via.placeholder.com/100x100?text=IMG1', 'https://via.placeholder.com/100x100?text=IMG2'],
        is_approved: true,
        is_order: true,
        helpful: 15,
        createdAt: '2024-01-15T10:30:00Z',
        replies: []
    },
    {
        id: '2',
        user_id: 'user2',
        userName: 'Trần Thị B',
        product_id: 'prod2',
        productName: 'Samsung Galaxy S24',
        order_id: 'order2',
        rating: 4,
        comment: 'Điện thoại đẹp, pin khỏe. Tuy nhiên camera có thể tốt hơn.',
        images: ['https://via.placeholder.com/100x100?text=IMG3'],
        is_approved: false,
        is_order: true,
        helpful: 8,
        createdAt: '2024-01-14T15:20:00Z',
        replies: []
    },
    {
        id: '3',
        user_id: 'user3',
        userName: 'Lê Văn C',
        product_id: 'prod3',
        productName: 'MacBook Air M2',
        order_id: 'order3',
        rating: 3,
        comment: 'Máy chạy ổn nhưng giá hơi cao so với cấu hình.',
        images: [],
        is_approved: true,
        is_order: true,
        helpful: 3,
        createdAt: '2024-01-13T09:15:00Z',
        replies: [
            {
                id: 'reply1',
                content: 'Cảm ơn bạn đã phản hồi. Chúng tôi sẽ cải thiện dịch vụ.',
                createdAt: '2024-01-13T10:30:00Z',
                author: 'Admin'
            }
        ]
    },
    {
        id: '4',
        user_id: 'user4',
        userName: 'Phạm Thị D',
        product_id: 'prod4',
        productName: 'iPad Pro 12.9',
        order_id: 'order4',
        rating: 5,
        comment: 'Màn hình đẹp, hiệu năng mạnh mẽ. Rất phù hợp cho công việc thiết kế.',
        images: ['https://via.placeholder.com/100x100?text=IMG4'],
        is_approved: true,
        is_order: true,
        helpful: 22,
        createdAt: '2024-01-12T14:45:00Z',
        replies: []
    },
    {
        id: '5',
        user_id: 'user5',
        userName: 'Hoàng Văn E',
        product_id: 'prod5',
        productName: 'AirPods Pro 2',
        order_id: 'order5',
        rating: 2,
        comment: 'Chất lượng âm thanh không như mong đợi, giá hơi cao.',
        images: [],
        is_approved: false,
        is_order: true,
        helpful: 1,
        createdAt: '2024-01-11T08:20:00Z',
        replies: []
    }
];

const ReviewManagement = () => {
    const [reviews, setReviews] = useState(mockReviews);
    const [selectedReview, setSelectedReview] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);

    // States cho tìm kiếm và lọc
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState(null);
    const [filterHasReply, setFilterHasReply] = useState('all');

    // Lọc và tìm kiếm dữ liệu
    const filteredReviews = useMemo(() => {
        let filtered = [...reviews];

        // Tìm kiếm theo tên người dùng, sản phẩm, hoặc nội dung bình luận
        if (searchText) {
            filtered = filtered.filter(review =>
                review.userName.toLowerCase().includes(searchText.toLowerCase()) ||
                review.productName.toLowerCase().includes(searchText.toLowerCase()) ||
                (review.comment && review.comment.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        // Lọc theo trạng thái duyệt
        if (filterStatus !== 'all') {
            filtered = filtered.filter(review =>
                filterStatus === 'approved' ? review.is_approved : !review.is_approved
            );
        }

        // Lọc theo đánh giá
        if (filterRating !== 'all') {
            filtered = filtered.filter(review => review.rating === parseInt(filterRating));
        }

        // Lọc theo ngày tạo
        if (filterDateRange && filterDateRange.length === 2) {
            const [startDate, endDate] = filterDateRange;
            filtered = filtered.filter(review => {
                const reviewDate = dayjs(review.createdAt);
                return reviewDate.isAfter(startDate.startOf('day')) &&
                    reviewDate.isBefore(endDate.endOf('day'));
            });
        }

        // Lọc theo có phản hồi hay không
        if (filterHasReply !== 'all') {
            filtered = filtered.filter(review =>
                filterHasReply === 'has_reply'
                    ? review.replies.length > 0
                    : review.replies.length === 0
            );
        }

        return filtered;
    }, [reviews, searchText, filterStatus, filterRating, filterDateRange, filterHasReply]);

    // Reset tất cả bộ lọc
    const handleResetFilters = () => {
        setSearchText('');
        setFilterStatus('all');
        setFilterRating('all');
        setFilterDateRange(null);
        setFilterHasReply('all');
        message.success('Đã reset tất cả bộ lọc!');
    };

    // Xem chi tiết bình luận
    const handleViewDetail = (record) => {
        setSelectedReview(record);
        setDetailModalVisible(true);
    };

    // Ẩn/hiện bình luận
    const handleToggleApproval = (reviewId) => {
        setReviews(prev => prev.map(review =>
            review.id === reviewId
                ? { ...review, is_approved: !review.is_approved }
                : review
        ));
        message.success('Cập nhật trạng thái thành công!');
    };

    // Xóa cứng bình luận
    const handleHardDelete = (reviewId) => {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        message.success('Xóa bình luận thành công!');
    };

    // Phản hồi bình luận
    const handleReply = (review) => {
        setSelectedReview(review);
        setReplyModalVisible(true);
    };

    // Gửi phản hồi
    const handleSubmitReply = () => {
        if (!replyContent.trim()) {
            message.error('Vui lòng nhập nội dung phản hồi!');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const newReply = {
                id: `reply_${Date.now()}`,
                content: replyContent,
                createdAt: new Date().toISOString(),
                author: 'Admin'
            };

            setReviews(prev => prev.map(review =>
                review.id === selectedReview.id
                    ? { ...review, replies: [...review.replies, newReply] }
                    : review
            ));

            // Cập nhật selectedReview nếu đang hiển thị detail
            if (selectedReview) {
                setSelectedReview(prev => ({
                    ...prev,
                    replies: [...prev.replies, newReply]
                }));
            }

            setReplyContent('');
            setReplyModalVisible(false);
            setLoading(false);
            message.success('Phản hồi thành công!');
        }, 1000);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (text) => <span className="font-mono text-sm">{text}</span>
        },
        {
            title: 'Người dùng',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => <span className="font-medium">{text}</span>
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (text) => <span className="text-blue-600">{text}</span>
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 140,
            render: (rating) => <Rate disabled defaultValue={rating} className="text-sm" />
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            render: (text) => (
                <div className="max-w-xs">
                    <p className="truncate text-gray-700">{text || 'Không có bình luận'}</p>
                </div>
            )
        },

        {
            title: 'Trạng thái',
            dataIndex: 'is_approved',
            key: 'is_approved',
            width: 100,
            render: (approved) => (
                <Tag color={approved ? 'green' : 'red'}>
                    {approved ? 'Đã duyệt' : 'Chờ duyệt'}
                </Tag>
            )
        },
        // {
        //     title: 'Hữu ích',
        //     dataIndex: 'helpful',
        //     key: 'helpful',
        //     width: 80,
        //     render: (helpful) => <span className="text-green-600 font-medium">{helpful}</span>
        // },
        {
            title: 'Thời gian',
            key: 'createdAt',
            width: 120,
            render: (_, record) => (
                <Tooltip title={dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                    <span className="text-blue-600 font-medium">
                        {dayjs(record.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                    </span>
                </Tooltip>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetail(record)}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Chi tiết
                    </Button>
                    <Tooltip title={record.is_approved ? 'Ẩn nội dung này' : 'Hiển thị nội dung này'}>
                        <Popconfirm
                            title={record.is_approved ? 'Bạn chắc chắn muốn ẩn nội dung này?' : 'Bạn chắc chắn muốn hiển thị nội dung này?'}
                            onConfirm={() => handleToggleApproval(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button
                                type="default"
                                icon={record.is_approved ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                size="small"
                                className={
                                    record.is_approved
                                        ? '!text-orange-600 !border-orange-600'
                                        : '!text-green-600 !border-green-600'
                                }
                            >
                                {record.is_approved ? 'Ẩn' : 'Hiện'}
                            </Button>
                        </Popconfirm>
                    </Tooltip>


                    <Popconfirm
                        title="Xóa bình luận"
                        description="Bạn có chắc chắn muốn xóa bình luận này?"
                        onConfirm={() => handleHardDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 !border-b !border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
                    <p className="text-gray-600 mt-1">Quản lý tất cả bình luận và đánh giá của khách hàng</p>
                </div>

                <div className="p-6">
                    {/* Bộ lọc và tìm kiếm */}
                    <Card className="mb-6 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    <FilterOutlined className="mr-2" />
                                    Tìm kiếm và lọc
                                </h3>
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={handleResetFilters}
                                    className="text-gray-600"
                                >
                                    Reset bộ lọc
                                </Button>
                            </div>

                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tìm kiếm
                                        </label>
                                        <Search
                                            placeholder="Tìm theo tên, sản phẩm, bình luận..."
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            allowClear
                                            className="w-full"
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <Select
                                            value={filterStatus}
                                            onChange={setFilterStatus}
                                            className="w-full"
                                        >
                                            <Option value="all">Tất cả</Option>
                                            <Option value="approved">Đã duyệt</Option>
                                            <Option value="pending">Chờ duyệt</Option>
                                        </Select>
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Đánh giá
                                        </label>
                                        <Select
                                            value={filterRating}
                                            onChange={setFilterRating}
                                            className="w-full"
                                        >
                                            <Option value="all">Tất cả</Option>
                                            <Option value="5">5 sao</Option>
                                            <Option value="4">4 sao</Option>
                                            <Option value="3">3 sao</Option>
                                            <Option value="2">2 sao</Option>
                                            <Option value="1">1 sao</Option>
                                        </Select>
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phản hồi
                                        </label>
                                        <Select
                                            value={filterHasReply}
                                            onChange={setFilterHasReply}
                                            className="w-full"
                                        >
                                            <Option value="all">Tất cả</Option>
                                            <Option value="has_reply">Có phản hồi</Option>
                                            <Option value="no_reply">Chưa phản hồi</Option>
                                        </Select>
                                    </div>
                                </Col>

                                <Col xs={24} sm={24} md={16} lg={12}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Khoảng thời gian
                                        </label>
                                        <RangePicker
                                            value={filterDateRange}
                                            onChange={setFilterDateRange}
                                            className="w-full"
                                            placeholder={['Từ ngày', 'Đến ngày']}
                                            format="DD/MM/YYYY"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            {/* Thống kê */}
                            <div className="pt-4 !border-t !border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center">
                                        <p className="text-gray-500">Tổng số</p>
                                        <p className="text-lg font-bold text-blue-600">{filteredReviews.length}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Đã duyệt</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {filteredReviews.filter(r => r.is_approved).length}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Chờ duyệt</p>
                                        <p className="text-lg font-bold text-orange-600">
                                            {filteredReviews.filter(r => !r.is_approved).length}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Đánh giá TB</p>
                                        <p className="text-lg font-bold text-yellow-600">
                                            {filteredReviews.length > 0
                                                ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
                                                : '0'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Table
                        columns={columns}
                        dataSource={filteredReviews}
                        rowKey="id"
                        pagination={{
                            total: filteredReviews.length,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bình luận`,
                        }}
                        className="shadow-sm"
                    />
                </div>
            </div>

            {/* Modal chi tiết bình luận */}
            <ReviewDetailModal
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                review={selectedReview}
                onReply={handleReply}
            />

            {/* Modal phản hồi */}
            <Modal
                title="Phản hồi bình luận"
                open={replyModalVisible}
                onCancel={() => {
                    setReplyModalVisible(false);
                    setReplyContent('');
                }}
                onOk={handleSubmitReply}
                confirmLoading={loading}
                okText="Gửi phản hồi"
                cancelText="Hủy"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Phản hồi cho bình luận của:</p>
                        <p className="font-medium">{selectedReview?.userName}</p>
                    </div>
                    <div>
                        <TextArea
                            rows={4}
                            placeholder="Nhập nội dung phản hồi..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReviewManagement;