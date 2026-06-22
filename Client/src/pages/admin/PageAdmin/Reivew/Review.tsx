import { useCallback, useEffect, useState } from 'react';
import { message, Modal, Input, Card } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ErrorType } from '../../../../types/error/IError';
import { fetchApproved, fetchDeleteReview, fetchGetReviewAdmin, fetchReplyComment, type TypeParams } from '../../../../services/admin/reviewService';
import type { IReviewReplyUI, IReviews, TypeStatus } from '../../../../types/IReview';
import Title from 'antd/es/typography/Title';
import ReviewDetailModal from './ReviewDetail';
import ReviewStatsCards from './ReviewStatsCards';
import ReviewFilterBar from './ReviewFilterBar';
import ReviewTable from './ReviewTable';

const { TextArea } = Input;

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
    const handleHardDelete = async (reviewId: string) => {
        try {
            const res = await fetchDeleteReview(reviewId);
            setReviews(prev => prev.filter(review => review._id !== reviewId));
            message.success(res.message);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        }
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

            setReviews(prev =>
                prev.map(r =>
                    r._id === selectedReview._id
                        ? {
                            ...r,
                            replies: [...(r.replies ?? []), newReply],
                            hasReply: true,
                        }
                        : r
                )
            );

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

    return (
        <div className="p-6 bg-[#f4f7fe] min-h-screen font-sans">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                        <MessageOutlined className="text-3xl" />
                    </div>
                    <div>
                        <Title level={2} className="!mb-1 !text-gray-900 tracking-tight font-bold">Quản lý Đánh giá</Title>
                        <p className="text-gray-500 m-0 text-base">Theo dõi, kiểm duyệt và phản hồi ý kiến từ khách hàng</p>
                    </div>
                </div>

                {/* Stats Section */}
                <ReviewStatsCards stats={stats} />

                {/* Filters */}
                <ReviewFilterBar
                    searchText={searchText} setSearchText={setSearchText}
                    filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                    filterRating={filterRating} setFilterRating={setFilterRating}
                    filterHasReply={filterHasReply} setFilterHasReply={setFilterHasReply}
                    filterDateRange={filterDateRange} setFilterDateRange={setFilterDateRange}
                    handleResetFilters={handleResetFilters}
                />

                {/* Table */}
                <ReviewTable
                    reviews={reviews}
                    loading={tableLoading}
                    pagination={pagination}
                    handleTableChange={handleTableChange}
                    handleViewDetail={handleViewDetail}
                    handleToggleApproval={handleToggleApproval}
                    handleHardDelete={handleHardDelete}
                />
            </div>

            <ReviewDetailModal
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                review={selectedReview!}
                onReply={handleReply}
            />

            <Modal
                title={
                    <div className="flex items-center gap-3 text-blue-600">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <MessageOutlined className="text-lg" />
                        </div>
                        <span className="text-lg font-bold">Phản hồi bình luận</span>
                    </div>
                }
                open={replyModalVisible}
                onCancel={() => {
                    setReplyModalVisible(false);
                    setReplyContent('');
                }}
                onOk={handleSubmitReply}
                confirmLoading={loading}
                okText={<span className="font-medium">Gửi phản hồi</span>}
                cancelText="Hủy"
                centered
                width={600}
                className="review-reply-modal"
            >
                <div className="space-y-5 py-4">
                    <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-inner">
                        <p className="text-xs text-blue-600 mb-2 uppercase font-bold tracking-wider">Đánh giá của khách hàng</p>
                        <p className="font-medium text-gray-800 text-base italic leading-relaxed">
                            "{selectedReview?.comment || 'Không có bình luận chữ'}"
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Nhập nội dung phản hồi:
                        </label>
                        <TextArea
                            rows={5}
                            placeholder="Xin chào, cảm ơn bạn đã quan tâm đến sản phẩm..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="resize-none rounded-xl focus:border-blue-500 shadow-sm text-base p-3"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReviewManagement;