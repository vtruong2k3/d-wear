import { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import '../../../../styles/brand.css'

const BrandTable = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [form] = Form.useForm();

    // Fetch brands data
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            // Uncomment dòng dưới để gọi API thực tế
            // const response = await api.get('/brands');
            // setBrands(response.data);

            // Demo data
            setBrands([
                { id: 1, name: 'Nike' },
                { id: 2, name: 'Adidas' },
                { id: 3, name: 'Puma' },
                { id: 4, name: 'Converse' },
                { id: 5, name: 'Vans' },
                { id: 6, name: 'New Balance' },
                { id: 7, name: 'Reebok' },
                { id: 8, name: 'Under Armour' },
                { id: 9, name: 'ASICS' },
                { id: 10, name: 'Jordan' }
            ]);
        } catch (error) {
            console.error('Lỗi khi tải danh sách brand:', error);
            message.error('Không thể tải danh sách brand');
        } finally {
            setLoading(false);
        }
    };

    // Thêm brand mới
    const handleAdd = () => {
        setEditingBrand(null);
        form.resetFields();
        setModalVisible(true);
    };

    // Sửa brand
    const handleEdit = (brand) => {
        setEditingBrand(brand);
        form.setFieldsValue(brand);
        setModalVisible(true);
    };

    // Xóa brand
    const handleDelete = async (id) => {
        try {
            // Uncomment để gọi API thực tế
            // await api.delete(`/brands/${id}`);

            // Demo: xóa khỏi state
            setBrands(brands.filter(brand => brand.id !== id));
            message.success('Xóa brand thành công');
        } catch (error) {
            console.error('Lỗi khi xóa brand:', error);
            message.error('Không thể xóa brand');
        }
    };

    // Lưu brand (thêm mới hoặc cập nhật)
    const handleSave = async (values) => {
        try {
            if (editingBrand) {
                // Cập nhật brand
                // await api.put(`/brands/${editingBrand.id}`, values);

                // Demo: cập nhật trong state
                setBrands(brands.map(brand =>
                    brand.id === editingBrand.id
                        ? { ...brand, ...values }
                        : brand
                ));
                message.success('Cập nhật brand thành công');
            } else {
                // Thêm brand mới
                // const response = await api.post('/brands', values);

                // Demo: thêm vào state
                const newBrand = {
                    id: Math.max(...brands.map(b => b.id)) + 1,
                    ...values
                };
                setBrands([...brands, newBrand]);
                message.success('Thêm brand thành công');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Lỗi khi lưu brand:', error);
            message.error('Không thể lưu brand');
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 80,
            align: 'center',
            render: (_, __, index) => (
                <span className="font-medium text-gray-600">{index + 1}</span>
            ),
        },
        {
            title: 'Tên Brand',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <TagOutlined className="text-blue-600 text-sm" />
                    </div>
                    <span className="font-semibold text-gray-800 text-base">{text}</span>
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description={`Bạn có chắc chắn muốn xóa brand "${record.name}"?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="primary"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Card className="mb-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                <TagOutlined className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    Quản Lý Brand
                                </h1>
                                <p className="text-gray-600">Quản lý danh sách thương hiệu sản phẩm</p>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 h-12 px-6 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Thêm Brand
                        </Button>
                    </div>
                </Card>

                {/* Table */}
                <Card className="shadow-lg">
                    <Table
                        columns={columns}
                        dataSource={brands}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} brand`,
                        }}
                        className="custom-table"
                        size="middle"
                    />
                </Card>

                {/* Modal thêm/sửa brand */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <TagOutlined className="text-blue-600" />
                            </div>
                            <span className="text-xl font-semibold">
                                {editingBrand ? 'Sửa Brand' : 'Thêm Brand Mới'}
                            </span>
                        </div>
                    }
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                    width={500}
                    className="custom-modal"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                        className="mt-6"
                    >
                        <Form.Item
                            label={<span className="text-gray-800 font-semibold">Tên Brand</span>}
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên brand!' },
                                { min: 2, message: 'Tên brand phải có ít nhất 2 ký tự!' },
                                { max: 50, message: 'Tên brand không được quá 50 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="Nhập tên brand..."
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-8">
                            <Button
                                size="large"
                                onClick={() => {
                                    setModalVisible(false);
                                    form.resetFields();
                                }}
                                className="min-w-[100px]"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
                            >
                                {editingBrand ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>


        </div>
    );
};

export default BrandTable;