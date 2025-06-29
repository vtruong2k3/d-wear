// src/pages/admin/Variants/index.tsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Image, Input, Popconfirm, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { IVariants } from '../../../../types/IVariants';
import AddVariants from './AddVariants';
import EditVariant from './EditVariant';
import { toast } from 'react-toastify';

const { Title } = Typography;

const VariantsPage: React.FC = () => {
  const [variants, setVariants] = useState<IVariants[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<IVariants | null>(null);

      const mockData: IVariants[] = [
      {
        id: 1,
        product_id: 'PROD001',
        size: 'L',
        color: 'Đỏ',
        stock: 50,
        price: 299000,
        imageVariant: ['https://via.placeholder.com/150x150/ff0000/ffffff?text=Red+L']
      },
      {
        id: 2,
        product_id: 'PROD001',
        size: 'M',
        color: 'Xanh',
        stock: 30,
        price: 299000,
        imageVariant: ['https://via.placeholder.com/150x150/0000ff/ffffff?text=Blue+M']
      },
      {
        id: 3,
        product_id: 'PROD002',
        size: 'XL',
        color: 'Đen',
        stock: 25,
        price: 459000,
        imageVariant: ['https://via.placeholder.com/150x150/000000/ffffff?text=Black+XL']
      }
    ];
  useEffect(() => {
    setVariants(mockData);
  }, []);

  const handleDelete = (id: number | string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
    message.success('Xóa biến thể thành công!');
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (variant: IVariants) => {
    setEditingVariant(variant);
    setShowEditModal(true);
  };

  const handleAddSubmit = (values: any) => {
    const newVariant = { id: Date.now(), imageVariant: [], ...values };
    setVariants(prev => [...prev, newVariant]);
    setShowAddModal(false);
    toast('Thêm mới thành công!');
  };

  const handleEditSubmit = (values: any) => {
    if (!editingVariant) return;
    const updated = { ...editingVariant, ...values };
    setVariants(prev => prev.map(v => v.id === updated.id ? updated : v));
    setShowEditModal(false);
    message.success('Cập nhật thành công!');
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
          {images.slice(0, 2).map((img, index) => (
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

export default VariantsPage;
