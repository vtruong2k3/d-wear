import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import { fetchCreateBrand } from "../../../../services/admin/brandService"; // service đã tách
import type { FC } from "react";
import { toast } from "react-toastify";
import type { ErrorType } from "../../../../types/error/IError";
import { useLoading } from "../../../../contexts/LoadingContext";

interface AddBrandProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddBrand: FC<AddBrandProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const res = await fetchCreateBrand(values);
      message.success(res.data?.message || "Thêm brand thành công");
      onClose();
      onSuccess(); // gọi lại để fetch brand list
      form.resetFields();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!visible) form.resetFields(); // reset form mỗi khi đóng
  }, [visible, form]);

  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      title="Thêm Brand"
      okText="Thêm"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="brand_name"
          label="Tên brand"
          rules={[{ required: true, message: "Nhập tên brand" }]}
        >
          <Input placeholder="Nhập tên brand" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBrand;
