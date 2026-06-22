import { useState } from "react";

// import {api} from "../../../../configs/AxiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
  type UploadFile,
  Card,
  Table,
  Space,
  Divider,
} from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { IProductAdd } from "../../../../types/IProducts";
import type { Category } from "../../../../types/IProducts";
import type { Brand } from "../../../../types/IProducts";
import { useEffect } from "react";
import "../../../../styles/addProduct.css";
import type { UploadChangeParam } from "antd/es/upload";
import type { ErrorType } from "../../../../types/error/IError";

import { createProduct } from "../../../../services/admin/productService";
import type { VariantForm } from "../../../../types/IVariants";
import type { SizeOption } from "../../../../types/size/ISize";
import type { ColorOption } from "../../../../types/color/IColor";

const { Option } = Select;
const { TextArea } = Input;

const ProductAdd = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [variantErrors, setVariantErrors] = useState<{
    [index: number]: string[];
  }>({});
  const [variants, setVariants] = useState<VariantForm[]>([]);

  // Bulk Generator State
  const [bulkColors, setBulkColors] = useState<string[]>([]);
  const [bulkSizes, setBulkSizes] = useState<string[]>([]);
  const [bulkPrice, setBulkPrice] = useState<number | null>(null);
  const [bulkStock, setBulkStock] = useState<number | null>(null);

  // check validate variant
  const validateVariants = () => {
    if (variants.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 biến thể!");
      return false;
    }
    const errors: { [index: number]: string[] } = {};
    let isValid = true;

    variants.forEach((variant, idx) => {
      const errs: string[] = [];

      if (!variant.size) errs.push("size");
      if (!variant.color) errs.push("color");
      if (
        variant.price === null ||
        variant.price === undefined ||
        variant.price <= 0
      )
        errs.push("price");
      if (
        variant.stock === null ||
        variant.stock === undefined ||
        variant.stock < 0
      )
        errs.push("stock");

      if (errs.length > 0) {
        errors[idx] = errs;
        isValid = false;
      }
    });

    setVariantErrors(errors); // Cập nhật lỗi vào state
    return isValid;
  };

  // Validate ảnh sản phẩm
  const beforeUploadProductImage = (file: File) => {
    const isValidType =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";

    if (!isValidType) {
      message.error("Chỉ cho phép ảnh JPEG, PNG hoặc WEBP!");
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh sản phẩm phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // Validate ảnh biến thể
  const beforeUploadVariantImage = (file: File) => {
    const isValidType =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp" ||
      file.type === "image/avif";

    if (!isValidType) {
      message.error("Chỉ cho phép ảnh JPEG, PNG hoặc WEBP!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh biến thể phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  //call api cata và brand, size and color
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const [brandRes, categoryRes, sizeRes, colorRes] = await Promise.all([
          axios.get("/api/brand"),
          axios.get("/api/category"),
          axios.get("/api/sizes/items"),
          axios.get("/api/colors/items"),
        ]);

        const brandsData = Array.isArray(brandRes.data.data)
          ? brandRes.data.data
          : [];
        const categoriesData = Array.isArray(categoryRes.data.data)
          ? categoryRes.data.data
          : [];
        const sizesData = Array.isArray(sizeRes.data.data)
          ? sizeRes.data.data
          : [];
        const colorsData = Array.isArray(colorRes.data.data)
          ? colorRes.data.data
          : [];

        setBrands(brandsData);
        setCategories(categoriesData);
        setSizes(sizesData);
        setColors(colorsData);
      } catch (error) {
        console.error("Lỗi khi lấy brand/category/size/color/:", error);
        setBrands([]);
        setCategories([]);
        setSizes([]);
        setColors([]);
      }
    };

    fetchSelectOptions();
  }, []);

  const onFinish = async (values: IProductAdd) => {
    try {
      if (!validateVariants()) {
        message.error("Vui lòng kiểm tra lại thông tin các biến thể!");
        return;
      }

      setLoading(true);
      const formData = new FormData();

      //  Thông tin sản phẩm
      formData.append("product_name", values.product_name);
      formData.append("description", values.description);
      formData.append("basePrice", String(values.basePrice));
      formData.append("brand_id", values.brand_id);
      formData.append("category_id", values.category_id);
      formData.append("gender", values.gender);
      formData.append("material", values.material);

      //  Ảnh sản phẩm
      imageList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("productImage", file.originFileObj);
        }
      });

      //  Biến thể JSON (KHÔNG có ảnh)
      const plainVariants = variants.map((variant) => ({
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        price: variant.price,
      }));
      formData.append("variants", JSON.stringify(plainVariants));

      //  Ảnh biến thể — KÈM INDEX để backend biết ảnh nào của biến thể nào
      variants.forEach((variant, idx) => {
        if (variant.image && variant.image.length > 0) {
          variant.image.forEach((imgFile) => {
            if (imgFile.originFileObj) {
              formData.append(`imageVariant_${idx}[]`, imgFile.originFileObj);
            }
          });
        }
      });

      // Gửi request
      const data = await createProduct(formData);
      message.success(data.message);
      navigate("/admin/products");
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (info: UploadChangeParam<UploadFile<unknown>>) => {
    if (info.fileList.length > 8) {
      message.warning("Chỉ được tải tối đa 8 ảnh!");
      return;
    }
    setImageList(info.fileList);
  };

  // Variant generator
  const generateBulkVariants = () => {
    if (bulkColors.length === 0 || bulkSizes.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 màu và 1 size!");
      return;
    }
    if (!bulkPrice || bulkPrice <= 0) {
      message.warning("Vui lòng nhập giá chung hợp lệ!");
      return;
    }
    if (bulkStock === null || bulkStock < 0) {
      message.warning("Vui lòng nhập tồn kho chung hợp lệ!");
      return;
    }

    const newVariants: VariantForm[] = [];
    bulkColors.forEach((c) => {
      bulkSizes.forEach((s) => {
        const exists = variants.find((v) => v.color === c && v.size === s);
        if (!exists) {
          newVariants.push({
            size: s,
            color: c,
            price: bulkPrice,
            stock: bulkStock,
            image: [],
          });
        }
      });
    });

    if (newVariants.length > 0) {
      setVariants([...variants, ...newVariants]);
      message.success(`Đã tạo thành công ${newVariants.length} biến thể!`);
    } else {
      message.info("Các biến thể này đã tồn tại!");
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", color: "", price: undefined, stock: 0, image: [] },
    ]);
  };

  const handleVariantChange = <K extends keyof VariantForm>(
    index: number,
    field: K,
    value: VariantForm[K]
  ) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImageChange = (index: number, fileList: UploadFile[]) => {
    const updated = [...variants];
    updated[index].image = fileList;
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  // Table columns for variants
  const columns = [
    {
      title: "Màu",
      dataIndex: "color",
      width: 150,
      render: (_: any, record: VariantForm, index: number) => (
        <Select
          className={`w-full ${variantErrors[index]?.includes("color") ? "border-red-500" : ""}`}
          placeholder="Chọn màu"
          value={record.color || undefined}
          onChange={(value) => handleVariantChange(index, "color", value)}
          showSearch
          optionFilterProp="children"
        >
          {colors.map((item) => (
            <Option key={item._id} value={item.color_name}>
              {item.color_name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      width: 150,
      render: (_: any, record: VariantForm, index: number) => (
        <Select
          className={`w-full ${variantErrors[index]?.includes("size") ? "border-red-500" : ""}`}
          placeholder="Chọn size"
          value={record.size || undefined}
          onChange={(value) => handleVariantChange(index, "size", value)}
          showSearch
          optionFilterProp="children"
        >
          {sizes.map((item) => (
            <Option key={item._id} value={item.size_name}>
              {item.size_name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      width: 150,
      render: (_: any, record: VariantForm, index: number) => (
        <InputNumber
          className={`w-full ${variantErrors[index]?.includes("price") ? "border-red-500" : ""}`}
          value={record.price}
          onChange={(value) => handleVariantChange(index, "price", value || 0)}
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
        />
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      width: 120,
      render: (_: any, record: VariantForm, index: number) => (
        <InputNumber
          className={`w-full ${variantErrors[index]?.includes("stock") ? "border-red-500" : ""}`}
          value={record.stock}
          onChange={(value) => handleVariantChange(index, "stock", value || 0)}
          min={0}
        />
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (_: any, record: VariantForm, index: number) => (
        <Upload
          listType="picture-card"
          fileList={record.image}
          onChange={(info) => handleVariantImageChange(index, info.fileList)}
          beforeUpload={beforeUploadVariantImage}
          maxCount={5}
        >
          {record.image && record.image.length >= 5 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh</div>
            </div>
          )}
        </Upload>
      ),
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeVariant(index)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <PlusOutlined className="text-white text-lg" />
            </div>
            Thêm Sản Phẩm Mới
          </h1>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cột trái (Chiếm 2/3) */}
            <div className="xl:col-span-2 flex flex-col gap-8">
              {/* Card: Thông tin cơ bản */}
              <Card bordered={false} className="shadow-sm rounded-xl" title={<span className="text-lg font-bold text-gray-800">Thông Tin Cơ Bản</span>}>
                <Form.Item
                  label={<span className="font-semibold">Tên sản phẩm</span>}
                  name="product_name"
                  rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                >
                  <Input placeholder="Nhập tên sản phẩm..." size="large" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold">Mô tả chi tiết</span>}
                  name="description"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    className="rounded-lg resize-none"
                  />
                </Form.Item>
              </Card>

              {/* Card: Hình ảnh sản phẩm */}
              <Card bordered={false} className="shadow-sm rounded-xl" title={<span className="text-lg font-bold text-gray-800">Hình Ảnh Sản Phẩm (Tối đa 8 ảnh)</span>}>
                <Form.Item
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
                      <div className="flex flex-col items-center">
                        <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                        <div className="text-sm font-medium text-gray-600">Tải ảnh lên</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Card>

              {/* Card: Sinh biến thể nhanh */}
              <Card bordered={false} className="shadow-sm rounded-xl border-t-4 border-t-blue-500" title={
                <span className="text-lg font-bold text-blue-700 flex items-center">
                  <ThunderboltOutlined className="mr-2" /> Sinh Biến Thể Nhanh
                </span>
              }>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800">
                  Chọn nhiều Màu và Size, sau đó nhập giá và tồn kho để hệ thống tự động tạo hàng loạt biến thể.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Chọn Màu sắc</label>
                    <Select
                      mode="multiple"
                      allowClear
                      className="w-full"
                      placeholder="VD: Đen, Trắng..."
                      value={bulkColors}
                      onChange={setBulkColors}
                      size="large"
                    >
                      {colors.map(c => <Option key={c._id} value={c.color_name}>{c.color_name}</Option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Chọn Size</label>
                    <Select
                      mode="multiple"
                      allowClear
                      className="w-full"
                      placeholder="VD: S, M, L..."
                      value={bulkSizes}
                      onChange={setBulkSizes}
                      size="large"
                    >
                      {sizes.map(s => <Option key={s._id} value={s.size_name}>{s.size_name}</Option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Giá chung (VNĐ)</label>
                    <InputNumber
                      className="w-full"
                      size="large"
                      min={0}
                      value={bulkPrice}
                      onChange={setBulkPrice}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tồn kho chung</label>
                    <InputNumber
                      className="w-full"
                      size="large"
                      min={0}
                      value={bulkStock}
                      onChange={setBulkStock}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="primary" className="bg-blue-600" size="large" icon={<ThunderboltOutlined />} onClick={generateBulkVariants}>
                    Tạo Hàng Loạt
                  </Button>
                </div>
              </Card>

              {/* Card: Danh sách biến thể */}
              <Card bordered={false} className="shadow-sm rounded-xl" title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Danh Sách Biến Thể</span>
                  <Button onClick={addVariant} icon={<PlusOutlined />} type="dashed">
                    Thêm thủ công
                  </Button>
                </div>
              }>
                {variants.length > 0 ? (
                  <Table 
                    dataSource={variants.map((v, i) => ({ ...v, key: i }))}
                    columns={columns}
                    pagination={false}
                    bordered
                    scroll={{ x: 800 }}
                  />
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    Chưa có biến thể nào. Hãy sử dụng công cụ Sinh Biến Thể Nhanh ở trên.
                  </div>
                )}
              </Card>

            </div>

            {/* Cột phải (Chiếm 1/3) */}
            <div className="flex flex-col gap-8">
              {/* Card: Trạng thái & Giá cơ bản */}
              <Card bordered={false} className="shadow-sm rounded-xl" title={<span className="text-lg font-bold text-gray-800">Mức Giá Cơ Bản</span>}>
                <Form.Item
                  label={<span className="font-semibold">Giá bán (VNĐ)</span>}
                  name="basePrice"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá!" },
                    { type: "number", min: 1000, message: "Số tiền phải lớn hơn 1000đ" }
                  ]}
                >
                  <InputNumber<number>
                    min={0}
                    className="w-full rounded-lg"
                    size="large"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                    placeholder="VD: 250,000"
                  />
                </Form.Item>
              </Card>

              {/* Card: Phân loại */}
              <Card bordered={false} className="shadow-sm rounded-xl" title={<span className="text-lg font-bold text-gray-800">Phân Loại</span>}>
                <Form.Item
                  label={<span className="font-semibold">Thương hiệu (Brand)</span>}
                  name="brand_id"
                  rules={[{ required: true, message: "Vui lòng chọn brand!" }]}
                >
                  <Select
                    placeholder="Chọn thương hiệu..."
                    size="large"
                    className="rounded-lg"
                    showSearch
                    optionFilterProp="children"
                  >
                    {brands.map((brand) => (
                      <Option key={brand._id} value={brand._id}>
                        {brand.brand_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold">Danh mục (Category)</span>}
                  name="category_id"
                  rules={[{ required: true, message: "Vui lòng chọn category!" }]}
                >
                  <Select
                    placeholder="Chọn danh mục..."
                    size="large"
                    className="rounded-lg"
                    showSearch
                    optionFilterProp="children"
                  >
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.category_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>

              {/* Card: Thuộc tính */}
              <Card bordered={false} className="shadow-sm rounded-xl" title={<span className="text-lg font-bold text-gray-800">Thuộc Tính Bổ Sung</span>}>
                <Form.Item
                  label={<span className="font-semibold">Giới tính</span>}
                  name="gender"
                  rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                >
                  <Select placeholder="Chọn giới tính..." size="large" className="rounded-lg">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="unisex">Unisex</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold">Chất liệu</span>}
                  name="material"
                  rules={[{ required: true, message: "Vui lòng nhập chất liệu!" }]}
                >
                  <Input placeholder="VD: Cotton 100%, Polyester..." size="large" className="rounded-lg" />
                </Form.Item>
              </Card>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 flex justify-end gap-4 px-8 xl:px-32">
            <Button
              size="large"
              className="min-w-[120px] rounded-lg font-medium"
              onClick={() => navigate("/admin/products")}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="min-w-[150px] bg-blue-600 rounded-lg font-semibold shadow-lg"
            >
              {loading ? "Đang xử lý..." : "Lưu Sản Phẩm"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProductAdd;
