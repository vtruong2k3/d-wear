import { Modal, Form, Input, Button, Space } from "antd";
import { fetchCreateCategory } from "../../../../services/categoryService"; // Cập nhật đúng path import
import type { ErrorType } from "../../../../types/error/IError";
import { toast } from "react-toastify";
import { useLoading } from "../../../../contexts/LoadingContext";

interface AddCategoryProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const handleSubmit = async (values: { category_name: string }) => {
    try {
      setLoading(true)
      const { data } = await fetchCreateCategory(values);
      toast.success(data.message)
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
