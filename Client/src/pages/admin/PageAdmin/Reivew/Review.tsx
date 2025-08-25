import { useCallback, useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Rate, Modal, Input, message, Popconfirm, Select, DatePicker, Card, Row, Col, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, EyeInvisibleOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import ReviewDetailModal from './ReviewDetail';
import dayjs, { Dayjs } from 'dayjs';
import type { ErrorType } from '../../../../types/error/IError';
import { fetchApproved, fetchGetReviewAdmin, fetchReplyComment, type TypeParams } from '../../../../services/admin/reviewService';
import type { IReviewReplyUI, IReviews, TypeStatus } from '../../../../types/IReview';
import Title from 'antd/es/typography/Title';

const { TextArea, Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}

const ReviewManagement = () => {
    const [reviews, setReviews] = useState<IReviews[]>([]);
    const [stats, setStats] = useState<TypeStatus | null>(null);
    const [selectedReview, setSelectedReview] = useState<IReviews | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);

    // Pagination state
    const [pagination, setPagination] = useState<Pagination>({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [filterHasReply, setFilterHasReply] = useState('all');
    const { current, pageSize } = pagination;
    // Fetch API
    const getAllReview = useCallback(async () => {
        setTableLoading(true);
        try {
            const params: TypeParams = {
                page: current,
                limit: pageSize
            };

            if (searchText.trim()) params.keyword = searchText.trim();
            if (filterStatus !== 'all') params.is_approved = filterStatus === 'approved';
            if (filterRating !== 'all') params.rating = Number(filterRating);
            if (filterHasReply !== 'all') params.hasReply = filterHasReply === 'has_reply';
            if (filterDateRange && filterDateRange.length === 2) {
                params.startDate = dayjs(filterDateRange[0]).startOf('day').toISOString();
                params.endDate = dayjs(filterDateRange[1]).endOf('day').toISOString();
            }

            const res = await fetchGetReviewAdmin(params);
            setReviews(res.reviews);
            console.log(res.reviews)
            setStats(res.stats);
            setPagination(prev => ({ ...prev, total: res.total || 0 }));
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        } finally {
            setTableLoading(false);
        }

    }, [current, pageSize, searchText, filterStatus, filterRating, filterHasReply, filterDateRange, setTableLoading]);

    useEffect(() => {
        getAllReview();
    }, [getAllReview]);

    // Reset tất cả bộ lọc
    const handleResetFilters = () => {
        setSearchText('');
        setFilterStatus('all');
        setFilterRating('all');
        setFilterDateRange(null);
        setFilterHasReply('all');
        setPagination(prev => ({ ...prev, current: 1 })); // về trang 1

    };
    const handleTableChange = (pag: Pagination) => {
        setPagination({
            ...pagination,
            current: pag.current,
            pageSize: pag.pageSize
        });
    };
    // Xem chi tiết bình luận
    const handleViewDetail = (record: IReviews) => {
        setSelectedReview(record);
        setDetailModalVisible(true);
    };

    // Ẩn/hiện bình luận
    const handleToggleApproval = async (reviewId: string) => {
        try {
            const reviewToUpdate = reviews.filter((review) => review._id === reviewId)[0];
            const newApprovalStatus = !reviewToUpdate.is_approved;
            const res = await fetchApproved(reviewId, newApprovalStatus)
            const updatedReviews = reviews.map((review) =>
                review._id === reviewId ? { ...review, is_approved: newApprovalStatus } : review
            );


            setReviews(updatedReviews);

            message.success(res.message)
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        }
    };

    // Xóa cứng bình luận
    const handleHardDelete = (reviewId: string) => {
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        message.success('Xóa bình luận thành công!');
    };

    // Phản hồi bình luận
    const handleReply = (reviewId: string | undefined) => {
        const r = reviews.find(x => x._id === reviewId);
        if (!r) return;
        setSelectedReview(r);
        setReplyContent('');
        setReplyModalVisible(true);
    };

    // Gửi phản hồi
    const handleSubmitReply = async () => {
        if (!replyContent.trim()) {
            message.error('Vui lòng nhập nội dung phản hồi!');
            return;
        }
        if (!selectedReview?._id) {
            message.error('Thiếu ID đánh giá.');
            return;
        }
        setLoading(true);
        try {

            const res = await fetchReplyComment(selectedReview?._id, replyContent)
            const srv = res.reviewReply;
            // Map về đúng shape IReviewReplyUI
            const newReply: IReviewReplyUI = {
                _id: srv._id,
                comment: srv.comment,
                createdAt: srv.createdAt,
                user: srv.user_id
                    ? {
                        _id: srv.user_id._id,
                        username: srv.user_id.username,
                        avatar: srv.user_id.avatar,
                    }
                    : undefined,
            };

            // Cập nhật danh sách reviews
            setReviews(prev =>
                prev.map(r =>
                    r._id === selectedReview._id
                        ? {
                            ...r,
                            replies: [...(r.replies ?? []), newReply],
                            hasReply: true, // nếu bạn có field này
                        }
                        : r
                )
            );

            // Cập nhật selectedReview nếu đang xem chi tiết
            setSelectedReview(prev =>
                prev
                    ? {
                        ...prev,
                        replies: [...(prev.replies ?? []), newReply],
                        hasReply: true,
                    }
                    : prev
            );
            message.success(res.message);
            setReplyContent('');
            setReplyModalVisible(false);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (_: unknown, __: IReviews, index: number) =>
                (pagination.current! - 1) * (pagination.pageSize || 10) + index + 1,
        },
        {
            title: 'Người dùng',
            dataIndex: 'userName',
            key: 'userName',
            render: (_: string, record: IReviews) => (
                <span className="font-medium">{record.user.username}</span>
            )
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (_: string, record: IReviews) => (
                <span className="text-blue-600">{record.product.product_name}</span>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 140,
            render: (rating: number) => <Rate disabled value={rating} className="text-sm" />
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            render: (text: string) => (
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
            render: (approved: boolean) => (
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
            render: (_: string, record: IReviews) => (
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
            render: (_: unknown, record: IReviews) => (
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
                            onConfirm={() => handleToggleApproval(record._id)}
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
                        onConfirm={() => handleHardDelete(record._id)}
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
                    <Title level={2}>Quản lý bình luận</Title>
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
                                            onChange={(dates) => setFilterDateRange(dates)}
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
                                        <p className="text-lg font-bold text-blue-600">{stats?.total}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Đã duyệt</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {stats?.approved}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Chờ duyệt</p>
                                        <p className="text-lg font-bold text-orange-600">
                                            {stats?.notApproved}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Đánh giá TB</p>
                                        <p className="text-lg font-bold text-yellow-600">
                                            {stats?.avgRating}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Table
                        columns={columns}
                        dataSource={reviews}
                        rowKey="id"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bình luận`
                        }}
                        loading={tableLoading}
                        onChange={handleTableChange}
                    />
                </div>
            </div>

            {/* Modal chi tiết bình luận */}
            <ReviewDetailModal
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                review={selectedReview!}
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
                        <p className="font-medium"></p>
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