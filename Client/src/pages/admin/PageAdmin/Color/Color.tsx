import { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Space, Input, Card, Typography, Popconfirm, Tag,
    message
} from 'antd';
import {
    EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined
} from '@ant-design/icons';


import AddColorModal from './AddColor';
import EditColorModal from './UpdateColor';

import {
    getAllColors,
    createColor,
    updateColor,
    deleteColor
} from '../../../../services/admin/colorService';

import type { ColorOption } from '../../../../types/color/IColor';
import type { ErrorType } from '../../../../types/error/IError';


const { Title } = Typography;

const ColorManagement = () => {
    const [colors, setColors] = useState<ColorOption[]>([]);
    const [filteredColors, setFilteredColors] = useState<ColorOption[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<ColorOption | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchColors = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getAllColors(currentPage, pageSize);
            const colorsWithSTT = res.color.map((item: ColorOption, index: number) => ({
                ...item,
                stt: (currentPage - 1) * pageSize + index + 1,
            }));
            setColors(colorsWithSTT);
            setFilteredColors(colorsWithSTT);
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
        fetchColors();
    }, [fetchColors]);


    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = colors.filter(color =>
            color.color_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredColors(filtered);
    };

    const handleAddColor = () => setIsAddModalOpen(true);

    const handleAddSubmit = async (newColor: { color_name: string }) => {
        try {
            setLoading(true)
            const res = await createColor(newColor.color_name);
            message.success(res.message);
            fetchColors();
            setIsAddModalOpen(false);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message || 'Lỗi khi thêm màu sắc';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const handleAddCancel = () => setIsAddModalOpen(false);

    const handleEditColor = (color: ColorOption) => {
        setEditingColor(color);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (updatedColor: ColorOption) => {
        try {
            setLoading(true)
            const res = await updateColor(updatedColor._id, {
                color_name: updatedColor.color_name
            });
            message.success(res.message);
            fetchColors();
            setIsEditModalOpen(false);
            setEditingColor(null);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message || 'Lỗi khi cập nhật màu sắc';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditingColor(null);
    };

    const handleDeleteColor = async (id: string) => {
        try {
            setLoading(true)
            const res = await deleteColor(id);
            message.success(res.message);
            fetchColors();
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message || 'Lỗi khi xoá màu sắc';
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
            render: (_text: ColorOption, _record: ColorOption, index: number) => (
                <Tag color="purple">#{(currentPage - 1) * pageSize + index + 1}</Tag>
            ),
        },
        {
            title: 'Tên màu sắc',
            dataIndex: 'color_name',
            key: 'color_name',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_: ColorOption, record: ColorOption) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditColor(record)}
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleDeleteColor(record._id)}
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
                    <Title level={2} className="text-purple-600 mb-4"> Danh Sách Màu Sắc</Title>

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
                            onClick={handleAddColor}
                            className="bg-purple-500 hover:bg-purple-600"
                        >
                            Thêm màu sắc
                        </Button>
                    </div>
                </div>

                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={filteredColors}
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

            <AddColorModal
                isOpen={isAddModalOpen}
                onSave={handleAddSubmit}
                onCancel={handleAddCancel}
                colors={colors}
            />

            <EditColorModal
                isOpen={isEditModalOpen}
                onSave={handleEditSubmit}
                onCancel={handleEditCancel}
                editingColor={editingColor}
                colors={colors}
            />
        </div>
    );
};

export default ColorManagement;
