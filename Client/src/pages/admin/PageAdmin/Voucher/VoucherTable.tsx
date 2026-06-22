import React from 'react';
import { Table, Space, Button, Tag, Popconfirm, Tooltip, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { IVoucher } from '../../../../types/voucher/IVoucher';
import { formatCurrency } from '../../../../utils/Format';

interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}

interface Props {
    vouchers: IVoucher[];
    loading: boolean;
    pagination: Pagination;
    handleTableChange: (pag: Pagination) => void;
    handleEdit: (record: IVoucher) => void;
    handleDelete: (id: string) => void;
}

const VoucherTable: React.FC<Props> = ({
    vouchers, loading, pagination,
    handleTableChange, handleEdit, handleDelete
}) => {

    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'code',
            key: 'code',
            render: (text: string) => (
                <div className="flex items-center">
                    <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 tracking-wider">
                        {text}
                    </span>
                </div>
            )
        },
        {
            title: 'Khuyến mãi',
            key: 'promotion',
            render: (_: unknown, record: IVoucher) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-base">
                        {record.discountType === 'percentage'
                            ? `${record.discountValue}%`
                            : formatCurrency(record.discountValue)
                        }
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                        Loại: <Tag color={record.discountType === 'percentage' ? 'blue' : 'green'} className="border-0 rounded">
                            {record.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                        </Tag>
                    </span>
                </div>
            )
        },
        {
            title: 'Điều kiện',
            key: 'conditions',
            render: (_: unknown, record: IVoucher) => (
                <div className="flex flex-col gap-1 text-sm">
                    <div><span className="text-gray-500">Đơn tối thiểu: </span> <span className="font-semibold">{formatCurrency(record.minOrderValue)}</span></div>
                    {record.maxDiscountValue > 0 && (
                        <div><span className="text-gray-500">Giảm tối đa: </span> <span className="font-semibold text-orange-600">{formatCurrency(record.maxDiscountValue)}</span></div>
                    )}
                </div>
            )
        },
        {
            title: 'Lượt dùng',
            key: 'usage',
            align: 'center' as const,
            render: (_: unknown, record: IVoucher) => {
                const used = record.usedUsers?.length || 0;
                const max = record.maxUser || 0;
                const isUnlimited = max === 0;
                const isFull = !isUnlimited && used >= max;

                return (
                    <div className="flex flex-col items-center">
                        <span className={`font-bold ${isFull ? 'text-red-500' : 'text-blue-600'}`}>
                            {used} {isUnlimited ? '' : `/ ${max}`}
                        </span>
                        <span className="text-xs text-gray-400">{isUnlimited ? 'Không giới hạn' : 'Lượt'}</span>
                    </div>
                )
            }
        },
        {
            title: 'Thời gian áp dụng',
            key: 'duration',
            render: (_: unknown, record: IVoucher) => {
                const isExpired = dayjs().isAfter(dayjs(record.endDate));
                return (
                    <div className="flex flex-col text-sm">
                        <span className="text-gray-700 font-medium">{dayjs(record.startDate).format('DD/MM/YYYY')}</span>
                        <span className={`font-medium ${isExpired ? 'text-red-500 line-through' : 'text-gray-500'}`}>
                            đến {dayjs(record.endDate).format('DD/MM/YYYY')}
                        </span>
                    </div>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center' as const,
            render: (isActive: boolean, record: IVoucher) => {
                const isExpired = dayjs().isAfter(dayjs(record.endDate));
                if (isExpired) return <Tag color="error" className="rounded-full px-3 py-1 text-xs font-bold border-0">Hết hạn</Tag>

                return (
                    <Tag color={isActive ? 'success' : 'default'} className="rounded-full px-3 py-1 text-xs font-bold border-0 shadow-sm">
                        {isActive ? 'Hoạt động' : 'Đã tắt'}
                    </Tag>
                )
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            render: (_: unknown, record: IVoucher) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa voucher" color="blue">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-0 shadow-sm rounded-lg flex items-center justify-center w-8 h-8 p-0"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa voucher" color="red">
                        <Popconfirm
                            title="Xóa voucher"
                            description="Bạn có chắc chắn muốn xóa vĩnh viễn voucher này?"
                            onConfirm={() => handleDelete(record._id!)}
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
                dataSource={vouchers}
                rowKey="_id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => (
                        <span className="text-gray-500 font-medium">
                            Đang xem <strong className="text-gray-800">{range[0]}-{range[1]}</strong> trong <strong className="text-gray-800">{total}</strong> voucher
                        </span>
                    ),
                    className: 'px-6 py-4 border-t border-gray-100'
                }}
                loading={loading}
                onChange={handleTableChange}
                className="voucher-modern-table"
                rowClassName="hover:bg-blue-50/30 transition-colors group"
                locale={{
                    emptyText: (
                        <Empty
                            image={<InboxOutlined className="text-6xl text-gray-300" />}
                            description={
                                <div className="py-4">
                                    <p className="text-lg font-bold text-gray-500 mb-1">Không tìm thấy voucher nào</p>
                                    <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc thêm voucher mới</p>
                                </div>
                            }
                        />
                    )
                }}
            />
        </div>
    );
};

export default VoucherTable;
