import { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Popconfirm, message, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined, SearchOutlined } from '@ant-design/icons';
import AddBrandModal from './FormAddBrand'; // Import component modal thêm
import EditBrandModal from './FormUpdateBrand'; // Import component modal sửa
import '../../../../styles/brand.css'

const BrandTable = () => {
    // States cho dữ liệu và UI
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]); // State cho danh sách đã lọc
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false); // Modal thêm
    const [editModalVisible, setEditModalVisible] = useState(false); // Modal sửa
    const [editingBrand, setEditingBrand] = useState(null); // Brand đang được sửa
    const [searchText, setSearchText] = useState(''); // State cho text tìm kiếm

    // Fetch brands data khi component mount
    useEffect(() => {
        fetchBrands();
    }, []);

    // Effect để lọc brands khi searchText thay đổi
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredBrands(brands);
        } else {
            const filtered = brands.filter(brand =>
                brand.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredBrands(filtered);
        }
    }, [brands, searchText]);

    // Hàm fetch danh sách brands
    const fetchBrands = async () => {
        try {
            setLoading(true);
            // Uncomment dòng dưới để gọi API thực tế
            // const response = await api.get('/brands');
            // setBrands(response.data);

            // Demo data với mô tả
            const demoData = [
                { id: 1, name: 'Nike', description: 'Thương hiệu thể thao nổi tiếng thế giới' },
                { id: 2, name: 'Adidas', description: 'Thương hiệu thể thao từ Đức' },
                { id: 3, name: 'Puma', description: 'Thương hiệu thời trang thể thao' },
                { id: 4, name: 'Converse', description: 'Thương hiệu giày canvas classic' },
                { id: 5, name: 'Vans', description: 'Thương hiệu streetwear và skateboard' },
                { id: 6, name: 'New Balance', description: 'Thương hiệu giày chạy bộ' },
                { id: 7, name: 'Reebok', description: 'Thương hiệu thể thao và fitness' },
                { id: 8, name: 'Under Armour', description: 'Thương hiệu đồ thể thao hiện đại' },
                { id: 9, name: 'ASICS', description: 'Thương hiệu giày chạy từ Nhật Bản' },
                { id: 10, name: 'Jordan', description: 'Thương hiệu giày bóng rổ cao cấp' }
            ];
            setBrands(demoData);
        } catch (error) {
            console.error('Lỗi khi tải danh sách brand:', error);
            message.error('Không thể tải danh sách brand');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Hàm reset tìm kiếm
    const handleResetSearch = () => {
        setSearchText('');
    };

    // ==================== THÊM BRAND ====================
    // Hàm mở modal thêm brand mới
    const handleOpenAddModal = () => {
        setAddModalVisible(true);
    };

    // Hàm đóng modal thêm
    const handleCloseAddModal = () => {
        setAddModalVisible(false);
    };

    // Hàm thêm brand mới
    const handleAddBrand = async (brandData) => {
        try {
            // Uncomment để gọi API thực tế
            // const response = await api.post('/brands', brandData);
            // const newBrand = response.data;

            // Demo: thêm vào state
            const newBrand = {
                id: Math.max(...brands.map(b => b.id)) + 1,
                ...brandData
            };

            setBrands([...brands, newBrand]);
            message.success(`Thêm brand "${brandData.name}" thành công!`);
            setAddModalVisible(false);
        } catch (error) {
            console.error('Lỗi khi thêm brand:', error);
            message.error('Không thể thêm brand mới');
            throw error; // Ném lỗi để modal xử lý
        }
    };

    // ==================== SỬA BRAND ====================
    // Hàm mở modal sửa brand
    const handleOpenEditModal = (brand) => {
        setEditingBrand(brand);
        setEditModalVisible(true);
    };

    // Hàm đóng modal sửa
    const handleCloseEditModal = () => {
        setEditModalVisible(false);
        setEditingBrand(null);
    };

    // Hàm cập nhật brand
    const handleUpdateBrand = async (brandId, brandData) => {
        try {
            // Uncomment để gọi API thực tế
            // await api.put(`/brands/${brandId}`, brandData);

            // Demo: cập nhật trong state
            setBrands(brands.map(brand =>
                brand.id === brandId
                    ? { ...brand, ...brandData }
                    : brand
            ));

            message.success(`Cập nhật brand "${brandData.name}" thành công!`);
            setEditModalVisible(false);
            setEditingBrand(null);
        } catch (error) {
            console.error('Lỗi khi cập nhật brand:', error);
            message.error('Không thể cập nhật brand');
            throw error; // Ném lỗi để modal xử lý
        }
    };

    // ==================== XÓA BRAND ====================
    // Hàm xóa brand
    const handleDeleteBrand = async (brand) => {
        try {
            // Uncomment để gọi API thực tế
            // await api.delete(`/brands/${brand.id}`);

            // Demo: xóa khỏi state
            setBrands(brands.filter(b => b.id !== brand.id));
            message.success(`Xóa brand "${brand.name}" thành công!`);
        } catch (error) {
            console.error('Lỗi khi xóa brand:', error);
            message.error(`Không thể xóa brand "${brand.name}"`);
        }
    };

    // Cấu hình columns cho table
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
            render: (text, record) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <TagOutlined className="text-blue-600 text-sm" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800 text-base">{text}</div>
                        {record.description && (
                            <div className="text-sm text-gray-500 mt-1">{record.description}</div>
                        )}
                    </div>
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
                        onClick={() => handleOpenEditModal(record)}
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                        title={`Sửa brand ${record.name}`}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa brand"
                        description={
                            <div>
                                <div>Bạn có chắc chắn muốn xóa brand:</div>
                                <div className="font-semibold text-red-600 mt-1">"{record.name}"?</div>
                                <div className="text-xs text-gray-500 mt-2">Hành động này không thể hoàn tác!</div>
                            </div>
                        }
                        onConfirm={() => handleDeleteBrand(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{
                            danger: true,
                            loading: false
                        }}
                        placement="topRight"
                    >
                        <Button
                            type="primary"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            title={`Xóa brand ${record.name}`}
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
                            onClick={handleOpenAddModal}
                            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 h-12 px-6 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Thêm Brand
                        </Button>
                    </div>
                </Card>

                {/* Search Section */}
                <Card className="mb-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 max-w-md">
                            <Input.Search
                                placeholder="Tìm kiếm brand theo tên..."
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                onSearch={handleSearch}
                                size="large"
                                className="rounded-lg"
                                prefix={<SearchOutlined className="text-gray-400" />}
                                allowClear
                                onClear={handleResetSearch}
                            />
                        </div>
                        <div className="flex items-center text-gray-600 ml-4">
                            <span className="text-sm font-medium">
                                Hiển thị <span className="text-blue-600 font-bold">{filteredBrands.length}</span> / <span className="font-bold">{brands.length}</span> brand
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Table */}
                <Card className="shadow-lg">
                    <Table
                        columns={columns}
                        dataSource={filteredBrands} // Sử dụng filteredBrands thay vì brands
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} brand`,
                            pageSizeOptions: ['5', '10', '20', '50'],
                        }}
                        className="custom-table"
                        size="middle"
                        locale={{
                            emptyText: searchText ?
                                `Không tìm thấy brand nào với từ khóa "${searchText}"` :
                                'Không có dữ liệu brand'
                        }}
                        scroll={{ x: 800 }} // Responsive table
                    />
                </Card>

                {/* Modal thêm brand */}
                <AddBrandModal
                    visible={addModalVisible}
                    onAdd={handleAddBrand}
                    onClose={handleCloseAddModal}
                />

                {/* Modal sửa brand */}
                <EditBrandModal
                    visible={editModalVisible}
                    brand={editingBrand}
                    onUpdate={handleUpdateBrand}
                    onClose={handleCloseEditModal}
                />
            </div>
        </div>
    );
};

export default BrandTable;