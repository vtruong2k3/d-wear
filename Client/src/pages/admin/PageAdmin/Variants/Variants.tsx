// src/pages/admin/Variants/index.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Image, Input, Popconfirm, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { IVariants } from '../../../../types/IVariants';
import AddVariants from './AddVariants';
import EditVariant from './EditVariant';
import { toast } from 'react-toastify';
import { useLoading } from '../../../../contexts/LoadingContext';
import type { ErrorType } from '../../../../types/error/IError';
import { fetchAllVariants } from '../../../../services/variantService';

const { Title } = Typography;

const Variants: React.FC = () => {
  const [variants, setVariants] = useState<IVariants[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<IVariants | null>(null);
  const { setLoading } = useLoading();

  // Fetch dữ liệu biến thể từ API khi load component
  const fetchVariants = useCallback(async () => {
     try {
       setLoading(true);
       const data = await fetchAllVariants();
       console.log(data);
       
       setVariants(data);
     } catch (error) {
       const errorMessage =
         (error as ErrorType).response?.data?.message ||
         (error as ErrorType).message ||
         "Đã xảy ra lỗi, vui lòng thử lại.";
       toast.error(errorMessage);
     } finally {
       setLoading(false);
     }
   }, [setLoading]);
  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);


  const handleDelete = async (id: number | string) => {
    try {
      await axios.delete(`/api/variants/${id}`);
      setVariants(prev => prev.filter(v => v.id !== id));
      message.success('Xóa biến thể thành công!');
    } catch (error) {
      message.error('Xóa thất bại!');
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (variant: IVariants) => {
    setEditingVariant(variant);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (values: any) => {
    try {
      const res = await axios.post('/api/variant', values);
      setVariants(prev => [...prev, res.data]);
      console.log(variants);
      
      setShowAddModal(true);
      toast('Thêm mới thành công!');
    } catch (error) {
      message.error('Thêm biến thể thất bại!');
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!editingVariant) return;
    try {
      const res = await axios.put(`/api/variant/${editingVariant.id}`, values);
      setVariants(prev => prev.map(v => v.id === editingVariant.id ? res.data : v));
      setShowEditModal(false);
      message.success('Cập nhật thành công!');
    } catch (error) {
      message.error('Cập nhật thất bại!');
    }
  };

  const filteredVariants = variants.filter(variant =>
    variant.product_id.toLowerCase().includes(searchText.toLowerCase()) ||
    variant.size.toLowerCase().includes(searchText.toLowerCase()) ||
    variant.color.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Mã sản phẩm', dataIndex: 'product_id', key: 'product_id' },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      render: (size: string) => <Tag color="blue">{size}</Tag>
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <Tag color="green">{color}</Tag>
    },
    { title: 'Số lượng', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className="font-semibold text-blue-600">
          {price.toLocaleString('vi-VN')}
        </span>
      )
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageVariant',
      key: 'imageVariant',
      render: (images: string[]) => (
        <div className="flex gap-1">
          {images?.slice(0, 2).map((img, index) => (
            <Image
              key={index}
              width={40}
              height={40}
              src={img}
              className="rounded-md object-cover"
              preview={{ src: img }}
            />
          ))}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: IVariants) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xác nhận xóa"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6 text-center">
        Quản Lý Biến Thể Sản Phẩm
      </Title>

      <Card
        title="Danh Sách Biến Thể"
        extra={
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm Biến Thể
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredVariants}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <AddVariants
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
      />

      <EditVariant
        visible={showEditModal}
        initialValues={editingVariant}
        onCancel={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default Variants;
