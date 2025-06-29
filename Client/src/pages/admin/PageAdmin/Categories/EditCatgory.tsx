import { Modal, Form, Input, Button, Space, message } from "antd";
import axios from "axios";
import { useEffect } from "react";

const EditCategory = ({ visible, onClose, onSuccess, category }: any) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && category) {
      form.setFieldsValue(category);
    }
  }, [visible, category, form]);

  const handleSubmit = async (values: any) => {
    try {
      await axios.put(`/api/category/${category._id}`, values);
      message.success("Sửa thành công");
      form.resetFields();
      onClose();
      onSuccess();
    } catch {
      message.error("Sửa thất bại");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa danh mục"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="category_name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={onClose}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategory;
