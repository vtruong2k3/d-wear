import { useState, useEffect } from "react";
import api from "../../../../configs/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, Select, Upload, Modal } from "antd";
import { PlusOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import type { IProduct } from "../../../../types/IProducts";
import "../../../../styles/addProduct.css"
const { Option } = Select;
const { TextArea } = Input;

const ProductAdd = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [currentImages, setCurrentImages] = useState([]);

  const onFinish = async (values: IProduct) => {
    console.log(values);

    try {
      setLoading(true);
      // Xử lý mảng ảnh từ upload component
      const productData = {
        ...values,
        productImage: [
          ...currentImages, // Giữ lại ảnh cũ
          ...imageList.map(img => img.url || img.response?.url).filter(Boolean) // Thêm ảnh mới
        ]
      };

      await api.post(`/products/add`, productData);
      alert("Tạo sản phẩm thành công");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("Có lỗi xảy ra khi tạo sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = ({ fileList }) => {
    setImageList(fileList);
  };

  // Hàm xử lý preview ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewOpen(true);
  };

  // Hàm chuyển đổi file thành base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  // Hàm xử lý preview ảnh hiện tại từ database
  const handleCurrentImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewTitle('Ảnh sản phẩm hiện tại');
    setPreviewOpen(true);
  };

  // Hàm xóa ảnh hiện tại
  const handleRemoveCurrentImage = (index) => {
    const newCurrentImages = [...currentImages];
    newCurrentImages.splice(index, 1);
    setCurrentImages(newCurrentImages);
  };

  // Giả lập data ảnh hiện tại từ database (thay thế bằng API call thực tế)
  useEffect(() => {
    // Gọi API để lấy thông tin sản phẩm hiện tại
    // const fetchProductData = async () => {
    //   const response = await api.get(`/products/${productId}`);
    //   setCurrentImages(response.data.productImage || []);
    // };
    // fetchProductData();

    // Demo data - để test khung ảnh
    setCurrentImages([
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop'
    ]);
  }, []);

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
              Sửa Sản Phẩm
            </h1>
            <p className="text-gray-600 mt-2 ml-14">Điền thông tin chi tiết để sửa sản phẩm</p>
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
              {/* Cột trái */}
              <div className="space-y-8">
                {/* Thông tin cơ bản */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    Thông Tin Cơ Bản
                  </h3>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Tên sản phẩm</span>}
                    name="product_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                  >
                    <Input
                      placeholder="Nhập tên sản phẩm..."
                      className="h-12 text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Mô tả sản phẩm</span>}
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      className="text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Giá bán (VNĐ)</span>}
                    name="basePrice"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                  >
                    <InputNumber
                      min={0}
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      size="large"
                      style={{ height: '48px' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      placeholder="0"
                    />
                  </Form.Item>
                </div>

                {/* Phân loại */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    Phân Loại
                  </h3>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Brand</span>}
                    name="brand_id"
                    rules={[{ required: true, message: 'Vui lòng chọn brand!' }]}
                  >
                    <Select
                      placeholder="Chọn brand..."
                      size="large"
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      showSearch
                      optionFilterProp="children"
                      style={{ height: '48px' }}
                    >
                      <Option value="brand1">Nike</Option>
                      <Option value="brand2">Adidas</Option>
                      <Option value="brand3">Puma</Option>
                      <Option value="brand4">Converse</Option>
                      <Option value="brand5">Vans</Option>
                      <Option value="brand6">New Balance</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Category</span>}
                    name="category_id"
                    rules={[{ required: true, message: 'Vui lòng chọn category!' }]}
                  >
                    <Select
                      placeholder="Chọn category..."
                      size="large"
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      showSearch
                      optionFilterProp="children"
                      style={{ height: '48px' }}
                    >
                      <Option value="cat1">Giày thể thao</Option>
                      <Option value="cat2">Giày chạy bộ</Option>
                      <Option value="cat3">Giày bóng đá</Option>
                      <Option value="cat4">Giày casual</Option>
                      <Option value="cat5">Giày hiking</Option>
                      <Option value="cat6">Giày tennis</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-8">
                {/* Thuộc tính sản phẩm */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    Thuộc Tính
                  </h3>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Giới tính</span>}
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Select
                      placeholder="Chọn giới tính..."
                      size="large"
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      style={{ height: '48px' }}
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="unisex">Unisex</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Chất liệu</span>}
                    name="material"
                    rules={[{ required: true, message: 'Vui lòng nhập chất liệu!' }]}
                  >
                    <Input
                      placeholder="Nhập chất liệu..."
                      className="h-12 text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      size="large"
                    />
                  </Form.Item>
                </div>

                {/* Hình ảnh sản phẩm - With Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    Hình Ảnh Sản Phẩm
                  </h3>

                  {/* Hiển thị ảnh hiện tại từ database */}
                  {currentImages.length > 0 && (
                    <div className="mb-6">
                      <div className="text-gray-800 font-semibold text-sm mb-3">Ảnh hiện tại</div>
                      <div className="grid grid-cols-2 gap-3">
                        {currentImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all duration-200">
                              <img
                                src={imageUrl}
                                alt={`Current product ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={() => handleCurrentImagePreview(imageUrl)}
                              />
                            </div>

                            {/* Overlay buttons */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCurrentImagePreview(imageUrl)}
                                  className="bg-white text-gray-700 hover:text-orange-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <EyeOutlined className="text-lg" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCurrentImage(index)}
                                  className="bg-white text-gray-700 hover:text-red-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Indicator for main image */}
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Ảnh chính
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Form.Item
                    label={<span className="text-gray-800 font-semibold text-sm">Thêm ảnh mới</span>}
                    name="productImage"
                  >
                    <div className="ant-upload-wrapper">
                      <Upload
                        listType="picture-card"
                        fileList={imageList}
                        onChange={handleImageChange}
                        onPreview={handlePreview}
                        multiple
                        beforeUpload={() => false}
                        className="product-image-upload"
                        accept="image/*"
                      >
                        {imageList.length >= 8 ? null : (
                          <div className="ant-upload-select">
                            <div className="flex flex-col items-center justify-center p-4">
                              <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                              <div className="text-sm font-medium text-gray-600">Tải ảnh lên</div>
                              <div className="text-xs text-gray-400 mt-1">PNG, JPG, GIF</div>
                            </div>
                          </div>
                        )}
                      </Upload>
                    </div>
                  </Form.Item>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-start">
                      <span className="mr-2">💡</span>
                      <span>
                        {currentImages.length > 0
                          ? "Bạn có thể giữ ảnh cũ hoặc thêm ảnh mới. Ảnh mới sẽ được thêm vào danh sách ảnh hiện tại."
                          : "Có thể tải lên nhiều ảnh (tối đa 8 ảnh). Ảnh đầu tiên sẽ là ảnh chính."
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Buttons Section */}
            <div className="mt-12 pt-6 pb-8 mx-5 border-t border-blue-300">
              <div className="flex items-center justify-end gap-4">
                <Button
                  size="large"
                  className="min-w-[120px] h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-xl font-medium"
                  onClick={() => navigate("/admin/products")}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="min-w-[140px] h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? 'Đang tạo...' : 'Sửa sản phẩm'}
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Modal Preview Image */}
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
          centered
          width={800}
          className="image-preview-modal"
        >
          <img
            alt="preview"
            style={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
            }}
            src={previewImage}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProductAdd;