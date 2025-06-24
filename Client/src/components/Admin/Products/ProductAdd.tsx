import { useState } from "react";
import api from "../../../configs/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber } from "antd";
import type { IProduct } from "../../../types/IProducts";

const ProductAdd = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: IProduct) => {
    console.log(values);
    
    try {
      setLoading(true);
      await api.post(`/products/add`, values);
      alert("Tạo thành thành công");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-xl mb-4">Thêm sản phẩm</h1>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Tên sản phẩm"
          name="title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Ảnh (URL)" name="thumbnail">
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Danh mục" name="category">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductAdd;
