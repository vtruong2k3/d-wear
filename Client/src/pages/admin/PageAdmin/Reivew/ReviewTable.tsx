import React from 'react';
import { Table, Space, Button, Tag, Rate, Tooltip, Popconfirm, Empty } from 'antd';
import { EyeOutlined, DeleteOutlined, EyeInvisibleOutlined, InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { IReviews } from '../../../../types/IReview';

interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}

interface Props {
    reviews: IReviews[];
    loading: boolean;
    pagination: Pagination;
    handleTableChange: (pag: Pagination) => void;
    handleViewDetail: (record: IReviews) => void;
    handleToggleApproval: (reviewId: string) => void;
    handleHardDelete: (reviewId: string) => void;
}

const ReviewTable: React.FC<Props> = ({
    reviews, loading, pagination,
    handleTableChange, handleViewDetail,
    handleToggleApproval, handleHardDelete
}) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center' as const,
            render: (_: unknown, __: IReviews, index: number) => (
                <span className="text-gray-500 font-medium">
                    {(pagination.current! - 1) * (pagination.pageSize || 10) + index + 1}
                </span>
            ),
        },
        {
            title: 'Khách hàng',
            dataIndex: 'userName',
            key: 'userName',
            width: 150,
            render: (_: string, record: IReviews) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 border border-blue-200">
                        {record.user?.username?.charAt(0) || 'U'}
                    </div>
                    <span className="font-semibold text-gray-800 line-clamp-1">{record.user?.username}</span>
                </div>
            )
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            width: 200,
            render: (_: string, record: IReviews) => (
                <div className="flex flex-col">
                    <span className="text-blue-600 font-semibold line-clamp-2 hover:underline cursor-pointer transition-colors leading-tight">
                        {record.product?.product_name}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">ID: {record.product_id?.substring(0, 8)}...</span>
                </div>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 130,
            render: (rating: number) => (
                <div className="flex flex-col">
                    <Rate disabled value={rating} className="text-sm text-yellow-500" />
                    <span className="text-xs font-bold text-gray-500 mt-1">{rating} / 5 sao</span>
                </div>
            )
        },
        {
            title: 'Nội dung bình luận',
            dataIndex: 'comment',
            key: 'comment',
            render: (text: string) => (
                <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 max-w-sm">
                    <p className="line-clamp-2 text-gray-700 text-sm leading-relaxed mb-0">
                        {text || <span className="italic text-gray-400">Khách hàng không để lại bình luận chữ</span>}
                    </p>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_approved',
            key: 'is_approved',
            width: 120,
            align: 'center' as const,
            render: (approved: boolean) => (
                <Tag 
                    color={approved ? 'success' : 'warning'} 
                    className="rounded-full px-3 py-1 text-xs font-bold border-0 shadow-sm"
                >
                    {approved ? 'Đã duyệt' : 'Chờ duyệt'}
                </Tag>
            )
        },
        {
            title: 'Thời gian',
            key: 'createdAt',
            width: 120,
            render: (_: string, record: IReviews) => (
                <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                        {dayjs(record.createdAt).format('DD/MM/YYYY')}
                    </span>
                    <span className="text-gray-400 text-xs">
                        {dayjs(record.createdAt).format('HH:mm')}
                    </span>
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 140,
            align: 'center' as const,
            render: (_: unknown, record: IReviews) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết & Phản hồi" color="blue">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                            className="bg-blue-500 hover:bg-blue-600 shadow-sm border-0 rounded-lg flex items-center justify-center w-8 h-8 p-0"
                        />
                    </Tooltip>
                    
                    <Tooltip title={record.is_approved ? 'Ẩn (Chờ duyệt)' : 'Duyệt hiển thị'} color={record.is_approved ? 'orange' : 'green'}>
                        <Popconfirm
                            title={record.is_approved ? 'Bạn chắc chắn muốn ẩn nội dung này?' : 'Bạn chắc chắn muốn duyệt nội dung này?'}
                            onConfirm={() => handleToggleApproval(record._id)}
                            okText="Có"
                            cancelText="Không"
                            placement="topRight"
                        >
                            <Button
                                type="default"
                                icon={record.is_approved ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                className={`shadow-sm rounded-lg flex items-center justify-center w-8 h-8 p-0 ${
                                    record.is_approved
                                        ? '!text-orange-500 !border-orange-200 hover:!bg-orange-50'
                                        : '!text-green-600 !border-green-200 hover:!bg-green-50'
                                }`}
                            />
                        </Popconfirm>
                    </Tooltip>

                    <Tooltip title="Xóa vĩnh viễn" color="red">
                        <Popconfirm
                            title="Xóa bình luận"
                            description="Hành động này không thể hoàn tác!"
                            onConfirm={() => handleHardDelete(record._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            placement="topRight"
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                className="shadow-sm rounded-lg flex items-center justify-center w-8 h-8 p-0 hover:!bg-red-50 border-red-200"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
            <Table
                columns={columns}
                dataSource={reviews}
                rowKey="_id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => (
                        <span className="text-gray-500 font-medium">
                            Đang xem <strong className="text-gray-800">{range[0]}-{range[1]}</strong> trong <strong className="text-gray-800">{total}</strong> bình luận
                        </span>
                    ),
                    className: 'px-6 py-4 border-t border-gray-100'
                }}
                loading={loading}
                onChange={handleTableChange}
                className="review-modern-table"
                rowClassName="hover:bg-blue-50/30 cursor-default transition-colors group"
                locale={{
                    emptyText: (
                        <Empty
                            image={<InboxOutlined className="text-6xl text-gray-300" />}
                            description={
                                <div className="py-4">
                                    <p className="text-lg font-bold text-gray-500 mb-1">Không tìm thấy đánh giá nào</p>
                                    <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                </div>
                            }
                        />
                    )
                }}
            />
        </div>
    );
};

export default ReviewTable;
