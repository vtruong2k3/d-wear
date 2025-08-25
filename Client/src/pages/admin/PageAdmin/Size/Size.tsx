import { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Space, Input, Card, Typography, Popconfirm,
    Tag,
    message,
} from 'antd';
import {
    EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined,
} from '@ant-design/icons';
import AddSizeModal from './AddSize';
import EditSizeModal from './UpdateSize';
import {
    getAllSizes,
    createSize,
    updateSize,
    deleteSize
} from '../../../../services/admin/sizeService';
import type { SizeOption } from '../../../../types/size/ISize';
import type { ErrorType } from '../../../../types/error/IError';



const { Title } = Typography;

const SizeManagement = () => {
    const [sizes, setSizes] = useState<SizeOption[]>([]);
    const [filteredSizes, setFilteredSizes] = useState<SizeOption[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSize, setEditingSize] = useState<SizeOption | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchSizes = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getAllSizes(currentPage, pageSize);
            const sizesWithSTT = res.size.map((item: SizeOption, index: number) => ({
                ...item,
                stt: (currentPage - 1) * pageSize + index + 1,
            }));
            setSizes(sizesWithSTT);
            setFilteredSizes(sizesWithSTT);
            setTotalItems(res.pagination.total);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                'Đã xảy ra lỗi khi tải danh sách.';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [currentPage, pageSize, setLoading]);

    useEffect(() => {
        fetchSizes();
    }, [fetchSizes]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = sizes.filter(size =>
            size.size_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSizes(filtered);
    };

    const handleAddSize = () => setIsAddModalOpen(true);

    const handleAddSubmit = async (newSize: { size_name: string }) => {
        try {
            setLoading(true)
            const res = await createSize(newSize.size_name);
            message.success(res.message);
            fetchSizes();
            setIsAddModalOpen(false);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                'Lỗi khi thêm kích thước';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const handleAddCancel = () => setIsAddModalOpen(false);

    const handleEditSize = (size: SizeOption) => {
        setEditingSize(size);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (updatedSize: SizeOption) => {
        try {
            setLoading(true)
            const res = await updateSize(updatedSize._id, {
                size_name: updatedSize.size_name
            });
            message.success(res.message);
            fetchSizes();
            setIsEditModalOpen(false);
            setEditingSize(null);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                'Lỗi khi cập nhật kích thước';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditingSize(null);
    };

    const handleDeleteSize = async (id: string) => {
        try {
            setLoading(true)
            const res = await deleteSize(id);
            message.success(res.message);
            fetchSizes();
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                'Lỗi khi xóa kích thước';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const columns = [
        {
            title: 'STT',

            key: 'stt',
            width: 250,
            align: 'center' as const,
            render: (_text: SizeOption, _record: SizeOption, index: number) => (
                <Tag color="blue">#{(currentPage - 1) * pageSize + index + 1}</Tag>
            ),
        },
        {
            title: 'Tên kích thước',
            dataIndex: 'size_name',
            key: 'size_name',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_: SizeOption, record: SizeOption) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"

                        onClick={() => handleEditSize(record)}
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleDeleteSize(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card>
                <div className="mb-6">
                    <Title level={2} className="text-blue-600 mb-4">Danh Sách Size</Title>

                    <div className="flex justify-between items-center mb-4">
                        <Input
                            placeholder="Tìm kiếm..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            allowClear
                            className="w-80"
                        />
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            style={{ marginLeft: "20px" }}
                            onClick={handleAddSize}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Thêm kích thước
                        </Button>
                    </div>
                </div>

                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={filteredSizes}

                    rowKey="_id"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} mục`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                />
            </Card>

            <AddSizeModal
                isOpen={isAddModalOpen}
                onSave={handleAddSubmit}
                onCancel={handleAddCancel}
                sizes={sizes}
            />

            <EditSizeModal
                isOpen={isEditModalOpen}
                onSave={handleEditSubmit}
                onCancel={handleEditCancel}
                editingSize={editingSize}
                sizes={sizes}
            />
        </div>
    );
};

export default SizeManagement;
