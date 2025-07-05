import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Image,
  Input,
  Popconfirm,
  Table,
  Tag,
  Typography,


} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import type { IVariants, VariantFormValues } from '../../../../types/IVariants';
import AddVariants from './AddVariants';
import EditVariant from './EditVariant';
import { toast } from 'react-toastify';
import {
  createVariant,
  updateVariant,
  deleteVariant,
  getAllVariants
} from '../../../../services/variantServices';
import axios from 'axios';
import type { ErrorType } from '../../../../types/error/IError';
import { useLoading } from '../../../../contexts/LoadingContext';

const { Title } = Typography;

const VariantsPage: React.FC = () => {
  const [variants, setVariants] = useState<IVariants[]>([]);
  const [products, setProducts] = useState<{ _id: string; product_name: string }[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<IVariants | null>(null);
  const { setLoading } = useLoading();


  const fetchVariants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllVariants();
      setVariants(data);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        'Đã xảy ra lỗi, vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setVariants]);

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get('/api/product/items');
      const data = Array.isArray(res.data.products) ? res.data.products : [];
      setProducts(data);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        'Đã xảy ra lỗi, vui lòng thử lại.';
      toast.error(errorMessage);
    }
  }, []);
  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, [fetchVariants, fetchProducts]);
  const handleDelete = async (id: number | string) => {
    try {
      setLoading(true)
      await deleteVariant(id);
      setVariants(prev => prev.filter(v => v._id !== id));
      toast.success('Xóa biến thể thành công!');
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        'Đã xảy ra lỗi, vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };

  const handleAdd = () => setShowAddModal(true);

  const handleEdit = (variant: IVariants) => {
    setEditingVariant(variant);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (
    values: VariantFormValues,
    imageFiles: File[]
  ) => {
    console.log("🧪 Submit Add Variant:", values, imageFiles); // THÊM DÒNG NÀY

    if (!imageFiles.length) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }

    try {
      setLoading(true)
      const res = await createVariant(values, imageFiles);
      // ✅ dùng imageFiles chứ KHÔNG dùng values.imageVariant
      toast.success(res.message);
      setShowAddModal(false);
      fetchVariants();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };


  const handleEditSubmit = async (
    values: VariantFormValues,
    imageFiles: File[]
  ) => {
    if (!editingVariant) return;



    try {
      setLoading(true);
      const res = await updateVariant(editingVariant.id, values, imageFiles);
      toast.success(res.message);
      setShowEditModal(false);
      fetchVariants();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        'Đã xảy ra lỗi, vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };


  const filteredVariants = variants.filter(variant =>
    variant.product_id.toLowerCase().includes(searchText.toLowerCase()) ||
    variant.size.toLowerCase().includes(searchText.toLowerCase()) ||
    variant.color.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id', width: 80 },
    {
      title: 'Tên sản phẩm',
      key: 'product_name',
      render: (_: IVariants, record: IVariants) => {
        const product = products.find(p => p._id === record.product_id);
        return product?.product_name || record.product_id;
      }
    },
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
      dataIndex: 'image',
      key: 'image',
      render: (images: string[] = []) => (
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
      render: (_: IVariants, record: IVariants) => (
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
              onChange={e => setSearchText(e.target.value)}
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
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <AddVariants
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        products={products}
      />

      <EditVariant
        visible={showEditModal}
        initialValues={editingVariant}
        onCancel={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        products={products}
      />
    </div>
  );
};

export default VariantsPage;
