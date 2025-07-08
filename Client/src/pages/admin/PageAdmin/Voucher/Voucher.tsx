// VoucherManagement.jsx
import { useCallback, useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Input, Select, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AddVoucherForm from './VoucherFomAdd';
import EditVoucherForm from './VoucherFormUpadate';
import { formatCurrency, formatDate } from '../../../../utils/Format';
import type { IVoucher } from '../../../../types/voucher/IVoucher';
import { fetchCreateVoucher, fetchDeleteVoucher, fetchGetAllVouchers, fetchUpdateVoucher } from '../../../../services/admin/voucherService';
import type { ErrorType } from '../../../../types/error/IError';
import { toast } from 'react-toastify';
import { useLoading } from '../../../../contexts/LoadingContext';

const { Search } = Input;
const { Option } = Select;

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<IVoucher | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    // State cho tìm kiếm
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const { setLoading } = useLoading();

    const getAllVoucher = useCallback(
        async (page = 1, limit = 10) => {
            setLoading(true);
            try {
                const res = await fetchGetAllVouchers(page, limit);
                setVouchers(res.vouchers);
                setTotal(res.pagination.total);
                setPage(res.pagination.page);
            } catch (error) {
                const errorMessage =
                    (error as ErrorType).response?.data?.message ||
                    (error as ErrorType).message ||
                    "Đã xảy ra lỗi, vui lòng thử lại.";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [setLoading]
    );


    useEffect(() => {
        getAllVoucher(page, limit);
    }, [page, limit, getAllVoucher]);


    const handlePageChange = (page: number) => {
        getAllVoucher(page); // gọi lại khi chuyển trang
    };
    const handlePageSizeChange = (_: number, newSize: number) => {
        setLimit(newSize);
        getAllVoucher(1, newSize); // reset về trang 1 khi đổi pageSize
    };
    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleEdit = (record: IVoucher) => {
        setEditingVoucher(record);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            const { message } = await fetchDeleteVoucher(id);
            setVouchers((prev) => prev.filter((v) => v._id !== id));
            toast.success(message);
        } catch (error) {
            const err = error as ErrorType;
            const errorMessage =
                err?.response?.data?.message || err.message || "Đã xảy ra lỗi khi xoá";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };


    const handleAddSubmit = async (
        values: Omit<IVoucher, '_id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            setLoading(true)
            const { message, voucher } = await fetchCreateVoucher(values);
            setVouchers([...vouchers, voucher]);
            setIsAddModalOpen(false);
            toast.success(message);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                'Đã xảy ra lỗi, vui lòng thử lại.';
            console.error('Lỗi:', errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const handleEditSubmit = async (
        values: Omit<IVoucher, "_id" | "createdAt" | "updatedAt">
    ) => {

        // Kiểm tra chắc chắn có editingVoucher và _id là string
        if (!editingVoucher || !editingVoucher._id) {
            toast.error("Không tìm thấy voucher để cập nhật");
            return;
        }

        try {
            setLoading(true)
            const { message, voucher } = await fetchUpdateVoucher(editingVoucher._id, values);

            setVouchers((prev) =>
                prev.map((v) => (v._id === editingVoucher._id ? voucher : v))
            );

            setIsEditModalOpen(false);
            toast.success(message);
        } catch (error) {
            const err = error as ErrorType;
            const errorMessage =
                err?.response?.data?.message || err.message || "Đã xảy ra lỗi khi cập nhật voucher";
            console.error("Lỗi cập nhật voucher:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };



    // Hàm lọc dữ liệu voucher
    const getFilteredVouchers = () => {
        return vouchers.filter(voucher => {
            const matchesSearch = voucher.code.toLowerCase().includes(searchText.toLowerCase());
            const matchesType = filterType === 'all' || voucher.discountType === filterType;
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && voucher.isActive) ||
                (filterStatus === 'inactive' && !voucher.isActive);

            return matchesSearch && matchesType && matchesStatus;
        });
    };

    const handleResetFilters = () => {
        setSearchText('');
        setFilterType('all');
        setFilterStatus('all');
    };



    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'code',
            key: 'code',
            render: (text: string) => <span className="font-semibold text-blue-600">{text}</span>
        },
        {
            title: 'Loại Giảm Giá',
            dataIndex: 'discountType',
            key: 'discountType',
            render: (type: string) => (
                <Tag color={type === 'percentage' ? 'blue' : 'green'}>
                    {type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                </Tag>
            )
        },
        {
            title: 'Giá Trị Giảm',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (value: number, record: IVoucher) => (
                <span className="font-medium">
                    {record.discountType === 'percentage'
                        ? `${value}%`
                        : formatCurrency(value)
                    }
                </span>
            )
        },
        {
            title: 'Đơn Hàng Tối Thiểu',
            dataIndex: 'minOrderValue',
            key: 'minOrderValue',
            render: (value: number) => formatCurrency(value)
        },
        {
            title: 'Giảm Tối Đa',
            dataIndex: 'maxDiscountValue',
            key: 'maxDiscountValue',
            render: (value: number) => value > 0 ? formatCurrency(value) : 'Không giới hạn'
        },
        {
            title: 'Số User Tối Đa',
            dataIndex: 'maxUser',
            key: 'maxUser',
            render: (value: number) => <span className="text-gray-600">{value}</span>
        },
        {
            title: 'Thời Gian Hiệu Lực',
            key: 'duration',
            render: (_value: string, record: IVoucher) => (
                <div className="text-sm">
                    <div>{formatDate(record.startDate)}</div>
                    <div className="text-gray-500">đến {formatDate(record.endDate)}</div>
                </div>
            )
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_value: string, record: IVoucher) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >

                    </Button>
                    <Popconfirm
                        title="Xóa voucher"
                        description="Bạn có chắc chắn muốn xóa voucher này?"
                        onConfirm={() => handleDelete(record._id!)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                        >

                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const filteredVouchers = getFilteredVouchers();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Voucher</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            size="large"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Thêm Voucher
                        </Button>
                    </div>

                    {/* Phần tìm kiếm và lọc */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Search
                                    placeholder="Tìm kiếm theo mã voucher..."
                                    allowClear
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '100%' }}
                                    prefix={<SearchOutlined />}
                                />
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Loại giảm giá"
                                    value={filterType}
                                    onChange={setFilterType}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">Tất cả loại</Option>
                                    <Option value="percentage">Phần trăm</Option>
                                    <Option value="fixed">Cố định</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Select
                                    placeholder="Trạng thái"
                                    value={filterStatus}
                                    onChange={setFilterStatus}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">Tất cả trạng thái</Option>
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="inactive">Không hoạt động</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Space>
                                    <Button
                                        onClick={handleResetFilters}
                                        className="text-gray-600"
                                    >
                                        Reset bộ lọc
                                    </Button>
                                    <span className="text-sm text-gray-500">
                                        Tìm thấy {filteredVouchers.length} voucher
                                    </span>
                                </Space>
                            </Col>
                        </Row>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredVouchers}
                        rowKey="_id" // Nếu dùng MongoDB thì thường là _id
                        pagination={{
                            current: page,
                            pageSize: limit,
                            total: total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} voucher`,
                            onChange: handlePageChange,
                            onShowSizeChange: handlePageSizeChange,
                        }}
                        scroll={{ x: 1200 }}

                    />


                    <AddVoucherForm
                        open={isAddModalOpen}
                        onCancel={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddSubmit}
                    />

                    <EditVoucherForm
                        open={isEditModalOpen}
                        onCancel={() => setIsEditModalOpen(false)}
                        onSubmit={handleEditSubmit}
                        editingVoucher={editingVoucher}
                    />
                </div>
            </div>
        </div>
    );
};

export default VoucherManagement;