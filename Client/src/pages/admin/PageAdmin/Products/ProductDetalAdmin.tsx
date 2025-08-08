import { useCallback, useEffect, useState } from 'react';
import {
    Card,
    Tag,
    Image,
    Descriptions,
    Table,
    Badge,
    Button,

    Divider,
    message
} from 'antd';
import {
    ArrowLeftOutlined,
    EyeOutlined,
    TagOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import type { IProducts } from '../../../../types/IProducts';
import type { IVariants } from '../../../../types/IVariants';
import type { ErrorType } from '../../../../types/error/IError';
import { useParams } from 'react-router-dom';
import { getDetailProduct } from '../../../../services/admin/productService';
import { formatCurrency, formatDate } from '../../../../utils/Format';
import type { ColumnsType } from 'antd/es/table';

const AdminProductDetail = () => {
    // Mock data dựa trên schema
    const { id } = useParams()
    const [product, setProduct] = useState<IProducts | null>(null)
    const [variants, setVariant] = useState<IVariants[]>([])
    const [loading, setLoading] = useState(false);


    // State phân trang
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);





    const getStockTag = (stock: number) => {
        if (stock === 0) return <Tag color="red">Hết hàng</Tag>;
        if (stock < 10) return <Tag color="orange">Sắp hết ({stock})</Tag>;
        return <Tag color="green">Còn hàng ({stock})</Tag>;
    };

    const getGenderTag = (gender: 'male' | 'female' | 'unisex') => {
        const genderConfig = {
            male: { color: 'blue', text: 'Nam' },
            female: { color: 'pink', text: 'Nữ' },
            unisex: { color: 'default', text: 'Unisex' }
        };
        const config = genderConfig[gender] || genderConfig.unisex;
        return <Tag color={config.color}>{config.text}</Tag>;
    };
    const loadDetailProduct = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getDetailProduct(id, limit, page)
            console.log("data:", res)
            setProduct(res.product)
            setVariant(res.variants)
            setTotal(res.total)
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [id, limit, page, setLoading])
    useEffect(() => {
        loadDetailProduct()
    }, [loadDetailProduct])
    // Tính tổng số lượng tồn kho
    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

    // Tính giá thấp nhất và cao nhất
    const prices = variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(product?.basePrice ?? 0);

    const variantColumns: ColumnsType<IVariants> = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 80,
            render: (images: string[]) => (
                <Image
                    width={60}
                    height={60}
                    src={`http://localhost:5000/${images[0]}`}
                    className="rounded-lg object-cover"
                    placeholder={<div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                        <EyeOutlined className="text-gray-400" />
                    </div>}
                />
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            sorter: (a: IVariants, b: IVariants) => {
                const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
            },
            render: (size: string) => <Tag color="blue">{size}</Tag>,
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            filters: [
                { text: 'Trắng', value: 'Trắng' },
                { text: 'Đen', value: 'Đen' },
                { text: 'Xanh navy', value: 'Xanh navy' },
            ],
            onFilter: (value, record: IVariants) => record.color === value,
            render: (color: string) => <Tag color="purple">{color}</Tag>,
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            sorter: (a: IVariants, b: IVariants) => a.price - b.price,
            render: (price: number) => (
                <span className="font-semibold text-green-600">{formatCurrency(price)}</span>
            ),
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a: IVariants, b: IVariants) => a.stock - b.stock,
            render: (stock: number) => getStockTag(stock),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDelete',
            key: 'isDelete',
            filters: [
                { text: 'Hoạt động', value: false },
                { text: 'Đã xóa', value: true },
            ],
            onFilter: (value, record: IVariants) => record.isDeleted === value,
            render: (isDelete: boolean) => (
                <Badge
                    status={isDelete ? 'error' : 'success'}
                    text={isDelete ? 'Đã xóa' : 'Hoạt động'}
                />
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm  !border-b !border-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => window.history.back()}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Quay lại danh sách
                        </Button>
                        <Divider type="vertical" className="h-6" />
                        <h1 className="text-xl font-semibold text-gray-900">Chi tiết sản phẩm</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột trái - Hình ảnh sản phẩm */}
                    <div className="lg:col-span-1">
                        <Card title="Hình ảnh sản phẩm" className="shadow-sm">
                            <div className="space-y-4">
                                {/* <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={productData.imageUrls[0]}
                                        className="object-cover"
                                        placeholder={<div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <EyeOutlined className="text-4xl text-gray-400" />
                                        </div>}
                                    />
                                </div> */}
                                {(product?.imageUrls.length ?? 0) && (
                                    <div className={`grid gap-2 ${product?.imageUrls.length === 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        {product?.imageUrls.slice(1).map((url, index) => (
                                            <div key={index} className="aspect-square">
                                                <Image
                                                    width={500}
                                                    height={500}
                                                    src={url
                                                        ? url.startsWith('http')
                                                            ? url
                                                            : `http://localhost:5000/${url}`
                                                        : '/fallback-image.jpg'
                                                    } // ảnh mặc định khi không có url}
                                                    className="object-cover rounded-lg"
                                                    placeholder={<div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <EyeOutlined className="text-2xl text-gray-400" />
                                                    </div>}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Thống kê nhanh */}
                        <Card title="Thống kê" className="shadow-sm mt-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tổng biến thể:</span>
                                    <span className="font-semibold text-blue-600">{variants.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tổng tồn kho:</span>
                                    <span className="font-semibold text-green-600">{totalStock}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Khoảng giá:</span>
                                    <span className="font-semibold text-orange-600">
                                        {minPrice === maxPrice
                                            ? formatCurrency(minPrice)
                                            : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Cột phải - Thông tin sản phẩm */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Thông tin cơ bản */}
                        <Card
                            title={
                                <div className="flex items-center justify-between">
                                    <span>Thông tin cơ bản</span>
                                    <Badge
                                        status={product?.isDeleted ? 'error' : 'success'}
                                        text={product?.isDeleted ? 'Đã ẩn' : 'Đang hiển thị'}
                                    />
                                </div>
                            }
                            className="shadow-sm"
                        >
                            <Descriptions column={2} labelStyle={{ fontWeight: 500, color: '#666' }}>
                                <Descriptions.Item label="Tên sản phẩm" span={2}>
                                    <span className="text-lg font-semibold text-gray-900">{product?.product_name}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Mô tả" span={2}>
                                    <p className="text-gray-700 leading-relaxed">{product?.description}</p>
                                </Descriptions.Item>
                                <Descriptions.Item label="Giá cơ bản">
                                    <span className="text-lg font-semibold text-green-600">
                                        {formatCurrency(product?.basePrice ?? 0)}
                                    </span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Chất liệu">
                                    <Tag color="cyan" style={{ whiteSpace: 'normal', height: 'auto', padding: '4px 8px' }}>
                                        {product?.material}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Danh mục">
                                    <Tag icon={<TagOutlined />} color="blue">
                                        {product?.category_id.category_name}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Thương hiệu">
                                    <Tag icon={<ShoppingOutlined />} color="purple">
                                        {product?.brand_id.brand_name}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới tính" span={2}>
                                    {getGenderTag((product?.gender ?? "unisex") as "male" | "female" | "unisex")}
                                </Descriptions.Item>
                                <Descriptions.Item label="ID sản phẩm" span={2}>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
                                        {product?._id}
                                    </code>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo">
                                    <span className="text-gray-600">{formatDate(product?.createdAt ?? "N/A")}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Cập nhật lần cuối">
                                    <span className="text-gray-600">{formatDate(product?.updatedAt ?? "N/A")}</span>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Biến thể sản phẩm */}
                        <Card
                            title={`Biến thể sản phẩm (${variants.length})`}
                            className="shadow-sm"
                        >
                            <Table
                                rowKey={(record) => record._id} // Hoặc field id duy nhất của variant
                                loading={loading}
                                columns={variantColumns}
                                dataSource={variants}
                                pagination={{
                                    current: page,
                                    pageSize: limit,
                                    total: total,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} của ${total} biến thể`,
                                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                                }}
                                scroll={{ x: 800 }}
                                size="middle"
                                onChange={(pagination) => {
                                    setPage(pagination.current || 1);
                                    setLimit(pagination.pageSize || 10);
                                }}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetail;