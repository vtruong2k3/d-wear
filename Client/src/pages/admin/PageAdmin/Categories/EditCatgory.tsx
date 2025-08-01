import { Modal, Form, Input, Button, Space, message } from "antd";
import { useEffect } from "react";
import { updateCategoryById } from "../../../../services/admin/categoryService";
import type { ICategory } from "../../../../types/category/ICategory";
import type { ErrorType } from "../../../../types/error/IError";

import { useLoading } from "../../../../contexts/LoadingContext";

interface EditCategoryProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: ICategory | null;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  visible,
  onClose,
  onSuccess,
  category,
}) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  useEffect(() => {
    if (visible && category) {
      form.setFieldsValue({
        category_name: category.category_name,
      });
    }
  }, [visible, category, form]);

  const handleSubmit = async (values: { category_name: string }) => {
    if (!category) return;
    try {
      setLoading(true);
      const { data } = await updateCategoryById(category._id, values);
      message.success(data.message);
      form.resetFields();
      onClose();
      onSuccess();
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
