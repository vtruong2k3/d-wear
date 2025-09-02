import { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Upload,
    Modal,
    Row,
    Col,
    Card,
    Space,
    Divider,
    Tag,
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    DeleteOutlined,

    EyeOutlined,
    ClusterOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

// Mock data để demo
const mockBrands = [
    { _id: "1", brand_name: "Nike" },
    { _id: "2", brand_name: "Adidas" },
    { _id: "3", brand_name: "Puma" },
];

const mockCategories = [
    { _id: "1", category_name: "Giày thể thao" },
    { _id: "2", category_name: "Áo thun" },
    { _id: "3", category_name: "Quần jean" },
];

const mockSizes = [
    { _id: "1", size_name: "S" },
    { _id: "2", size_name: "M" },
    { _id: "3", size_name: "L" },
    { _id: "4", size_name: "XL" },
    { _id: "5", size_name: "XXL" },
    { _id: "6", size_name: "38" },
    { _id: "7", size_name: "39" },
    { _id: "8", size_name: "40" },
    { _id: "9", size_name: "41" },
    { _id: "10", size_name: "42" },
];

const mockColors = [
    { _id: "1", color_name: "Đỏ", color_code: "#FF0000" },
    { _id: "2", color_name: "Xanh dương", color_code: "#0000FF" },
    { _id: "3", color_name: "Trắng", color_code: "#FFFFFF" },
    { _id: "4", color_name: "Đen", color_code: "#000000" },
    { _id: "5", color_name: "Vàng", color_code: "#FFFF00" },
];

const ProductAdd = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [brands, setBrands] = useState(mockBrands);
    const [categories, setCategories] = useState(mockCategories);
    const [sizes, setSizes] = useState(mockSizes);
    const [colors, setColors] = useState(mockColors);
    const [variants, setVariants] = useState([]);
    const [variantErrors, setVariantErrors] = useState({});

    // Bulk variant creation states
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkForm] = Form.useForm();
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [bulkPrice, setBulkPrice] = useState(null);
    const [bulkStock, setBulkStock] = useState(0);
    const [bulkImages, setBulkImages] = useState([]);

    // Validation function
    const validateVariants = () => {
        const errors = {};
        let isValid = true;

        variants.forEach((variant, idx) => {
            const errs = [];
            if (!variant.size) errs.push("size");
            if (!variant.color) errs.push("color");
            if (!variant.price || variant.price <= 0) errs.push("price");
            if (variant.stock === null || variant.stock === undefined || variant.stock < 0) errs.push("stock");

            if (errs.length > 0) {
                errors[idx] = errs;
                isValid = false;
            }
        });

        setVariantErrors(errors);
        return isValid;
    };

    // Image validation
    const beforeUploadProductImage = (file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
        if (!isValidType) {
            message.error("Chỉ cho phép ảnh JPEG, PNG hoặc WEBP!");
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Ảnh sản phẩm phải nhỏ hơn 2MB!");
            return false;
        }

        return true;
    };

    const beforeUploadVariantImage = (file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type);
        if (!isValidType) {
            message.error("Chỉ cho phép ảnh JPEG, PNG, WEBP hoặc AVIF!");
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Ảnh biến thể phải nhỏ hơn 5MB!");
            return false;
        }

        return true;
    };

    // Handle form submission
    const onFinish = async (values) => {
        try {
            if (!validateVariants()) {
                message.error("Vui lòng nhập đầy đủ thông tin cho các biến thể!");
                return;
            }

            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            message.success("Thêm sản phẩm thành công!");
            console.log("Product data:", {
                productInfo: values,
                variants: variants,
                images: imageList
            });

        } catch (error) {
            message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Handle image changes
    const handleImageChange = (info) => {
        if (info.fileList.length > 8) {
            message.warning("Chỉ được tải tối đa 8 ảnh!");
            return;
        }
        setImageList(info.fileList);
    };

    // Manual variant functions
    const addVariant = () => {
        setVariants([
            ...variants,
            { size: "", color: "", price: null, stock: 0, image: [] },
        ]);
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleVariantImageChange = (index, fileList) => {
        const updated = [...variants];
        updated[index].image = fileList;
        setVariants(updated);
    };

    const removeVariant = (index) => {
        const updated = [...variants];
        updated.splice(index, 1);
        setVariants(updated);
    };

    // Bulk variant creation functions
    const handleBulkCreate = () => {
        if (!selectedSizes.length || !selectedColors.length) {
            message.error("Vui lòng chọn ít nhất 1 size và 1 màu!");
            return;
        }

        if (!bulkPrice || bulkPrice <= 0) {
            message.error("Vui lòng nhập giá hợp lệ!");
            return;
        }

        if (bulkStock === null || bulkStock === undefined || bulkStock < 0) {
            message.error("Vui lòng nhập số lượng tồn kho hợp lệ!");
            return;
        }

        const newVariants = [];
        selectedSizes.forEach(sizeId => {
            selectedColors.forEach(colorId => {
                const size = sizes.find(s => s._id === sizeId);
                const color = colors.find(c => c._id === colorId);

                // Check if variant already exists
                const exists = variants.some(v =>
                    v.size === size?.size_name && v.color === color?.color_name
                );

                if (!exists) {
                    newVariants.push({
                        size: size?.size_name || "",
                        color: color?.color_name || "",
                        price: bulkPrice,
                        stock: bulkStock,
                        image: [...bulkImages], // Copy bulk images
                    });
                }
            });
        });

        if (newVariants.length === 0) {
            message.warning("Tất cả biến thể đã tồn tại!");
            return;
        }

        setVariants([...variants, ...newVariants]);
        message.success(`Đã thêm ${newVariants.length} biến thể mới!`);

        // Reset bulk form
        setShowBulkModal(false);
        setSelectedSizes([]);
        setSelectedColors([]);
        setBulkPrice(null);
        setBulkStock(0);
        setBulkImages([]);
        bulkForm.resetFields();
    };

    const getVariantPreview = () => {
        if (!selectedSizes.length || !selectedColors.length) return [];

        const preview = [];
        selectedSizes.forEach(sizeId => {
            selectedColors.forEach(colorId => {
                const size = sizes.find(s => s._id === sizeId);
                const color = colors.find(c => c._id === colorId);
                preview.push({
                    size: size?.size_name,
                    color: color?.color_name,
                    price: bulkPrice,
                    stock: bulkStock
                });
            });
        });
        return preview;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg mb-8">
                    <div className="px-8 py-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                <PlusOutlined className="text-white text-lg" />
                            </div>
                            Thêm Sản Phẩm
                        </h1>
                        <p className="text-gray-600 mt-2 ml-14">
                            Điền thông tin chi tiết để thêm sản phẩm
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        className="p-8"
                        requiredMark={false}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-8">
                                {/* Basic Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                        Thông Tin Cơ Bản
                                    </h3>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Tên sản phẩm</span>}
                                        name="product_name"
                                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                                    >
                                        <Input
                                            placeholder="Nhập tên sản phẩm..."
                                            className="h-12 text-base rounded-xl"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Mô tả sản phẩm</span>}
                                        name="description"
                                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Mô tả chi tiết về sản phẩm..."
                                            className="text-base rounded-xl resize-none"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Giá cơ sở (VNĐ)</span>}
                                        name="basePrice"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập giá!" },
                                            { type: "number", min: 1000, message: "Số tiền phải lớn hơn 1000đ" }
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            className="w-full rounded-xl"
                                            size="large"
                                            style={{ height: "48px" }}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                                            placeholder="0"
                                        />
                                    </Form.Item>
                                </div>

                                {/* Category */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                        Phân Loại
                                    </h3>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Brand</span>}
                                        name="brand_id"
                                        rules={[{ required: true, message: "Vui lòng chọn brand!" }]}
                                    >
                                        <Select
                                            placeholder="Chọn brand..."
                                            size="large"
                                            className="w-full rounded-xl"
                                            showSearch
                                            style={{ height: "48px" }}
                                        >
                                            {brands.map((brand) => (
                                                <Option key={brand._id} value={brand._id}>
                                                    {brand.brand_name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Category</span>}
                                        name="category_id"
                                        rules={[{ required: true, message: "Vui lòng chọn category!" }]}
                                    >
                                        <Select
                                            placeholder="Chọn category..."
                                            size="large"
                                            className="w-full rounded-xl"
                                            showSearch
                                            style={{ height: "48px" }}
                                        >
                                            {categories.map((cat) => (
                                                <Option key={cat._id} value={cat._id}>
                                                    {cat.category_name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                {/* Product Attributes */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                                        Thuộc Tính
                                    </h3>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Giới tính</span>}
                                        name="gender"
                                        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                                    >
                                        <Select
                                            placeholder="Chọn giới tính..."
                                            size="large"
                                            className="w-full rounded-xl"
                                            style={{ height: "48px" }}
                                        >
                                            <Option value="male">Nam</Option>
                                            <Option value="female">Nữ</Option>
                                            <Option value="unisex">Unisex</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Chất liệu</span>}
                                        name="material"
                                        rules={[{ required: true, message: "Vui lòng nhập chất liệu!" }]}
                                    >
                                        <Input
                                            placeholder="Nhập chất liệu..."
                                            className="h-12 text-base rounded-xl"
                                            size="large"
                                        />
                                    </Form.Item>
                                </div>

                                {/* Product Images */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                                        Hình Ảnh Sản Phẩm
                                    </h3>

                                    <Form.Item
                                        label={<span className="text-gray-800 font-semibold text-sm">Ảnh sản phẩm</span>}
                                        name="productImage"
                                        rules={[{ required: true, message: "Vui lòng tải lên ít nhất 1 ảnh!" }]}
                                    >
                                        <Upload
                                            listType="picture-card"
                                            fileList={imageList}
                                            onChange={handleImageChange}
                                            multiple
                                            beforeUpload={beforeUploadProductImage}
                                            accept="image/*"
                                        >
                                            {imageList.length >= 8 ? null : (
                                                <div className="flex flex-col items-center justify-center p-4">
                                                    <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                                                    <div className="text-sm font-medium text-gray-600">Tải ảnh lên</div>
                                                    <div className="text-xs text-gray-400 mt-1">PNG, JPG, GIF</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>

                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs text-blue-700 flex items-start">
                                            <span className="mr-2">💡</span>
                                            <span>Có thể tải lên nhiều ảnh (tối đa 8 ảnh). Ảnh đầu tiên sẽ là ảnh chính.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="mt-8 bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                    Biến Thể Sản Phẩm ({variants.length})
                                </h3>

                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<ClusterOutlined />}
                                        onClick={() => setShowBulkModal(true)}
                                        className="bg-green-600 hover:bg-green-700 border-green-600"
                                    >
                                        Thêm nhanh biến thể
                                    </Button>
                                    <Button
                                        onClick={addVariant}
                                        icon={<PlusOutlined />}
                                        type="primary"
                                    >
                                        Thêm từng biến thể
                                    </Button>
                                </Space>
                            </div>

                            {/* Variant List */}
                            {variants.length > 0 && (
                                <div className="grid gap-4">
                                    {variants.map((variant, index) => (
                                        <Card
                                            key={index}
                                            size="small"
                                            className="border-gray-200"
                                            extra={
                                                <Button
                                                    danger
                                                    type="text"
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => removeVariant(index)}
                                                >
                                                    Xoá
                                                </Button>
                                            }
                                        >
                                            <Row gutter={16} align="middle">
                                                <Col xs={24} sm={6} md={4}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                                        <Select
                                                            className={`w-full ${variantErrors[index]?.includes("size") ? "border-red-500" : ""}`}
                                                            placeholder="Chọn size"
                                                            value={variant.size}
                                                            onChange={(value) => handleVariantChange(index, "size", value)}
                                                            size="small"
                                                        >
                                                            {sizes.map((item) => (
                                                                <Option key={item._id} value={item.size_name}>
                                                                    {item.size_name}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                        {variantErrors[index]?.includes("size") && (
                                                            <div className="text-red-500 text-xs mt-1">Chọn size</div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={6} md={4}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu</label>
                                                        <Select
                                                            className={`w-full ${variantErrors[index]?.includes("color") ? "border-red-500" : ""}`}
                                                            placeholder="Chọn màu"
                                                            value={variant.color}
                                                            onChange={(value) => handleVariantChange(index, "color", value)}
                                                            size="small"
                                                        >
                                                            {colors.map((item) => (
                                                                <Option key={item._id} value={item.color_name}>
                                                                    <div className="flex items-center">
                                                                        <div
                                                                            className="w-4 h-4 rounded-full mr-2 border"
                                                                            style={{ backgroundColor: item.color_code }}
                                                                        ></div>
                                                                        {item.color_name}
                                                                    </div>
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                        {variantErrors[index]?.includes("color") && (
                                                            <div className="text-red-500 text-xs mt-1">Chọn màu</div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={6} md={4}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                                                        <InputNumber
                                                            className={`w-full ${variantErrors[index]?.includes("price") ? "border-red-500" : ""}`}
                                                            placeholder="Giá"
                                                            value={variant.price}
                                                            onChange={(value) => handleVariantChange(index, "price", value || 0)}
                                                            min={0}
                                                            size="small"
                                                        />
                                                        {variantErrors[index]?.includes("price") && (
                                                            <div className="text-red-500 text-xs mt-1">Nhập giá</div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={6} md={4}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                                                        <InputNumber
                                                            className={`w-full ${variantErrors[index]?.includes("stock") ? "border-red-500" : ""}`}
                                                            placeholder="SL"
                                                            value={variant.stock}
                                                            onChange={(value) => handleVariantChange(index, "stock", value || 0)}
                                                            min={0}
                                                            size="small"
                                                        />
                                                        {variantErrors[index]?.includes("stock") && (
                                                            <div className="text-red-500 text-xs mt-1">Nhập SL</div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={24} md={8}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh biến thể</label>
                                                        <Upload
                                                            listType="picture"
                                                            fileList={variant.image}
                                                            onChange={(info) => handleVariantImageChange(index, info.fileList)}
                                                            beforeUpload={beforeUploadVariantImage}
                                                            maxCount={5}
                                                        >
                                                            <Button size="small" icon={<UploadOutlined />}>
                                                                Tải ảnh ({variant.image.length}/5)
                                                            </Button>
                                                        </Upload>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {variants.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <ClusterOutlined className="text-4xl mb-4" />
                                    <p>Chưa có biến thể nào. Hãy thêm biến thể cho sản phẩm!</p>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="mt-12 pt-6 pb-8 mx-5 border-t border-blue-300">
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    size="large"
                                    className="min-w-[120px] h-12 rounded-xl font-medium"
                                    onClick={() => window.history.back()}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    className="min-w-[140px] h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
                                >
                                    {loading ? "Đang tạo..." : "Thêm sản phẩm"}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Bulk Variant Creation Modal */}
            <Modal
                title={
                    <div className="flex items-center">
                        <ClusterOutlined className="mr-2 text-green-600" />
                        Thêm nhanh biến thể
                    </div>
                }
                open={showBulkModal}
                onCancel={() => {
                    setShowBulkModal(false);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setBulkPrice(null);
                    setBulkStock(0);
                    setBulkImages([]);
                    bulkForm.resetFields();
                }}
                width={800}
                footer={[
                    <Button key="cancel" onClick={() => setShowBulkModal(false)}>
                        Hủy
                    </Button>,
                    <Button key="preview" icon={<EyeOutlined />} onClick={() => { }}>
                        Xem trước ({getVariantPreview().length})
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleBulkCreate}>
                        Tạo biến thể
                    </Button>,
                ]}
            >
                <Form form={bulkForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Chọn Size"
                                name="sizes"
                                rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 size!" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn nhiều size..."
                                    value={selectedSizes}
                                    onChange={setSelectedSizes}
                                    className="w-full"
                                >
                                    {sizes.map((size) => (
                                        <Option key={size._id} value={size._id}>
                                            {size.size_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Chọn Màu"
                                name="colors"
                                rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 màu!" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn nhiều màu..."
                                    value={selectedColors}
                                    onChange={setSelectedColors}
                                    className="w-full"
                                >
                                    {colors.map((color) => (
                                        <Option key={color._id} value={color._id}>
                                            <div className="flex items-center">
                                                <div
                                                    className="w-4 h-4 rounded-full mr-2 border"
                                                    style={{ backgroundColor: color.color_code }}
                                                ></div>
                                                {color.color_name}
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giá cho tất cả biến thể (VNĐ)"
                                name="bulkPrice"
                                rules={[
                                    { required: true, message: "Vui lòng nhập giá!" },
                                    { type: "number", min: 1000, message: "Giá phải lớn hơn 1000đ" }
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full"
                                    placeholder="Nhập giá chung..."
                                    value={bulkPrice}
                                    onChange={setBulkPrice}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Số lượng tồn kho"
                                name="bulkStock"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số lượng!" },
                                    { type: "number", min: 0, message: "Số lượng phải >= 0" }
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full"
                                    placeholder="Nhập số lượng chung..."
                                    value={bulkStock}
                                    onChange={setBulkStock}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Ảnh chung cho tất cả biến thể (tùy chọn)">
                        <Upload
                            listType="picture"
                            fileList={bulkImages}
                            onChange={(info) => setBulkImages(info.fileList)}
                            beforeUpload={beforeUploadVariantImage}
                            multiple
                            maxCount={3}
                        >
                            <Button icon={<UploadOutlined />}>
                                Tải ảnh chung ({bulkImages.length}/3)
                            </Button>
                        </Upload>
                        <div className="text-xs text-gray-500 mt-2">
                            Những ảnh này sẽ được áp dụng cho tất cả biến thể được tạo
                        </div>
                    </Form.Item>

                    <Divider />

                    {/* Preview Section */}
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                            <EyeOutlined className="mr-2" />
                            Xem trước biến thể sẽ được tạo ({getVariantPreview().length})
                        </h4>

                        {getVariantPreview().length > 0 ? (
                            <div className="max-h-60 overflow-y-auto">
                                <div className="grid gap-2">
                                    {getVariantPreview().map((preview, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <Tag color="blue">{preview.size}</Tag>
                                                <Tag color="green">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full mr-1 border"
                                                            style={{
                                                                backgroundColor: colors.find(c => c.color_name === preview.color)?.color_code || '#000'
                                                            }}
                                                        ></div>
                                                        {preview.color}
                                                    </div>
                                                </Tag>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="font-semibold text-red-600">
                                                    {preview.price?.toLocaleString('vi-VN')}đ
                                                </span>
                                                <span className="text-gray-600">
                                                    SL: {preview.stock}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <ClusterOutlined className="text-3xl mb-2" />
                                <p>Chọn size và màu để xem trước biến thể</p>
                            </div>
                        )}

                        {getVariantPreview().length > 0 && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700 font-medium">
                                    ✅ Sẽ tạo {getVariantPreview().length} biến thể mới
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    Các biến thể đã tồn tại sẽ được bỏ qua
                                </p>
                            </div>
                        )}
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductAdd;

