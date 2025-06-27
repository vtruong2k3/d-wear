// VoucherManagement.jsx
import { useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Input, Select, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AddVoucherForm from './VoucherFomAdd';
import EditVoucherForm from './VoucherFormUpadate';

const { Search } = Input;
const { Option } = Select;

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([
        {
            id: 1,
            code: 'SALE2024',
            discountType: 'percentage',
            discountValue: 20,
            minOrderValue: 100000,
            maxDiscountValue: 50000,
            maxUser: 100,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isActive: true
        },
        {
            id: 2,
            code: 'FIXED50K',
            discountType: 'fixed',
            discountValue: 50000,
            minOrderValue: 200000,
            maxDiscountValue: 0,
            maxUser: 50,
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            isActive: false
        },
        {
            id: 3,
            code: 'NEWUSER10',
            discountType: 'percentage',
            discountValue: 10,
            minOrderValue: 50000,
            maxDiscountValue: 30000,
            maxUser: 200,
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            isActive: true
        }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);

    // State cho tìm kiếm
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingVoucher(record);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setVouchers(vouchers.filter(v => v.id !== id));
        message.success('Xóa voucher thành công!');
    };

    const handleAddSubmit = (values) => {
        setVouchers([...vouchers, { ...values, id: Date.now() }]);
        message.success('Thêm voucher thành công!');
        setIsAddModalOpen(false);
    };

    const handleEditSubmit = (values) => {
        setVouchers(vouchers.map(v =>
            v.id === editingVoucher.id
                ? { ...values, id: editingVoucher.id }
                : v
        ));
        message.success('Cập nhật voucher thành công!');
        setIsEditModalOpen(false);
    };

    // Hàm lọc dữ liệu voucher
    const getFilteredVouchers = () => {
        return vouchers.filter(voucher => {
            // Lọc theo text tìm kiếm (mã voucher)
            const matchesSearch = searchText === '' ||
                voucher.code.toLowerCase().includes(searchText.toLowerCase());

            // Lọc theo loại giảm giá
            const matchesType = filterType === 'all' || voucher.discountType === filterType;

            // Lọc theo trạng thái
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && voucher.isActive) ||
                (filterStatus === 'inactive' && !voucher.isActive);

            return matchesSearch && matchesType && matchesStatus;
        });
    };

    // Hàm reset tất cả bộ lọc
    const handleResetFilters = () => {
        setSearchText('');
        setFilterType('all');
        setFilterStatus('all');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
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
            render: (value, record) => (
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
            render: (_, record) => (
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
            render: (_, record) => (
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
                        onConfirm={() => handleDelete(record.id)}
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
                        rowKey="id"
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} voucher`,
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