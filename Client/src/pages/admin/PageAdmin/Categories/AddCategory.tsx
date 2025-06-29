import { Modal, Form, Input, Button, Space, message } from "antd";
import axios from "axios";

const AddCategory = ({ visible, onClose, onSuccess }: any) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await axios.post("/api/category", values);
      message.success("Thêm thành công");
      form.resetFields();
      onClose();
      onSuccess();
    } catch {
      message.error("Thêm thất bại");
    }
  };

  return (
    <Modal
      title="Thêm danh mục"
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
              Thêm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategory;
