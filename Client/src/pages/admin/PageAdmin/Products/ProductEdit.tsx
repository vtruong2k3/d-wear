import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import {api} from "../../../../configs/AxiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, Select, Upload, Modal } from "antd";
import { PlusOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import type { IProducts } from "../../../../types/IProducts";
import type { Category } from "../../../../types/IProducts";
import type { Brand } from "../../../../types/IProducts";
import "../../../../styles/addProduct.css";
const { Option } = Select;
const { TextArea } = Input;

const ProductEdit = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();

  //Load brands và categories 
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/brand"),
          axios.get("http://localhost:5000/api/category"),
        ]);

        setBrands(brandRes.data.data || []);
        setCategories(categoryRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy brand/category:", error);
      }
    };

    fetchSelectOptions();
  }, []);

  //call api theo id sản phẩm
  //Load sản phẩm sau khi đã có brand/category
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${id}`);
        const product = res.data.product;

        form.setFieldsValue({
          product_name: product.product_name,
          description: product.description,
          basePrice: product.basePrice,
          brand_id: product.brand_id?._id || product.brand_id,
          category_id: product.category_id?._id || product.category_id,
          gender: product.gender,
          material: product.material,
        });

        // const BASE_IMAGE_URL = "http://localhost:5000/";
        setCurrentImages(
          (product.imageUrls || []).map((url:string, index:number) => {
            const isFullUrl = url.startsWith("http");
            const fullUrl = isFullUrl
              ? url
              : `http://localhost:5000/${url.replace(/\\/g, "/")}`;

            return {
              uid: `current-${index}`,
              name: `image-${index}`,
              url: fullUrl,
            };
          })
        );
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      }
    };

    if (brands.length > 0 && categories.length > 0 && id) {
      fetchProduct();
    }
  }, [brands, categories, id]);

  // Submit form để cập nhật sản phẩm
  const onFinish = async (values: IProducts) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Gửi các trường thông tin sản phẩm
      formData.append("product_name", values.product_name);
      formData.append("description", values.description);
      formData.append("basePrice", String(values.basePrice));
      formData.append("brand_id", values.brand_id);
      formData.append("category_id", values.category_id);
      formData.append("gender", values.gender);
      formData.append("material", values.material);

      // Gửi ảnh cũ dưới key `existingImageUrls`
      currentImages.forEach((img) => {
        formData.append("existingImageUrls", img.url);
      });

      //Gửi ảnh mới dưới key `productImage`
      imageList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("productImage", file.originFileObj);
        }
      });

      await axios.put(`http://localhost:5000/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Chi tiết lỗi:", err.response?.data);
        alert(
          err.response?.data?.errors?.join("\n") ||
            "Có lỗi khi cập nhật sản phẩm"
        );
      } else {
        console.error("Lỗi không xác định:", err);
        alert("Có lỗi không xác định khi cập nhật sản phẩm");
      }
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
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
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
    setPreviewTitle("Ảnh sản phẩm hiện tại");
    setPreviewOpen(true);
  };

  // Hàm xóa ảnh hiện tại
  const handleRemoveCurrentImage = (index) => {
    const newCurrentImages = [...currentImages];
    newCurrentImages.splice(index, 1);
    setCurrentImages(newCurrentImages);
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
              Sửa Sản Phẩm
            </h1>
            <p className="text-gray-600 mt-2 ml-14">
              Điền thông tin chi tiết để sửa sản phẩm
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
              {/* Cột trái */}
              <div className="space-y-8">
                {/* Thông tin cơ bản */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    Thông Tin Cơ Bản
                  </h3>

                  <Form.Item
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Tên sản phẩm
                      </span>
                    }
                    name="product_name"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên sản phẩm!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên sản phẩm..."
                      className="h-12 text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Mô tả sản phẩm
                      </span>
                    }
                    name="description"
                    rules={[
                      { required: true, message: "Vui lòng nhập mô tả!" },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      className="text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Giá bán (VNĐ)
                      </span>
                    }
                    name="basePrice"
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                  >
                    <InputNumber
                      min={0}
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      size="large"
                      style={{ height: "48px" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Brand
                      </span>
                    }
                    name="brand_id"
                    rules={[
                      { required: true, message: "Vui lòng chọn brand!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn brand..."
                      size="large"
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      showSearch
                      optionFilterProp="children"
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
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Category
                      </span>
                    }
                    name="category_id"
                    rules={[
                      { required: true, message: "Vui lòng chọn category!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn category..."
                      size="large"
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      showSearch
                      optionFilterProp="children"
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

              {/* Cột phải */}
              <div className="space-y-8">
                {/* Thuộc tính sản phẩm */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    Thuộc Tính
                  </h3>

                  <Form.Item
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Giới tính
                      </span>
                    }
                    name="gender"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn giới tính..."
                      size="large"
                      className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      style={{ height: "48px" }}
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="unisex">Unisex</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Chất liệu
                      </span>
                    }
                    name="material"
                    rules={[
                      { required: true, message: "Vui lòng nhập chất liệu!" },
                    ]}
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
                      <div className="text-gray-800 font-semibold text-sm mb-3">
                        Ảnh hiện tại
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {currentImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all duration-200">
                              <img
                                src={image.url} // `url` dùng để hiển thị ảnh
                                alt={`Current product ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={() =>
                                  handleCurrentImagePreview(image.url)
                                }
                              />
                            </div>

                            {/* Overlay buttons */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCurrentImagePreview(image.url)
                                  }
                                  className="bg-white text-gray-700 hover:text-orange-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <EyeOutlined className="text-lg" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveCurrentImage(index)
                                  }
                                  className="bg-white text-gray-700 hover:text-red-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
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
                    label={
                      <span className="text-gray-800 font-semibold text-sm">
                        Thêm ảnh mới
                      </span>
                    }
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
                              <div className="text-sm font-medium text-gray-600">
                                Tải ảnh lên
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                PNG, JPG, GIF
                              </div>
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
                          : "Có thể tải lên nhiều ảnh (tối đa 8 ảnh). Ảnh đầu tiên sẽ là ảnh chính."}
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
                  {loading ? "Đang tạo..." : "Sửa sản phẩm"}
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
              width: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
            src={previewImage}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProductEdit;
