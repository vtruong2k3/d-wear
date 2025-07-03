import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { updateBrandById } from "../../../../services/brandService";
import type { IBrand } from "../../../../types/brand/IBrand";
import type { ErrorType } from "../../../../types/error/IError";
import { toast } from "react-toastify";
import { useLoading } from "../../../../contexts/LoadingContext";

interface EditBrandProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand: IBrand | null;
}

const EditBrand: React.FC<EditBrandProps> = ({ visible, onClose, onSuccess, brand }) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  useEffect(() => {
    if (visible && brand) {
      form.setFieldsValue({ brand_name: brand.brand_name });
    }
  }, [visible, brand, form]);

  const handleOk = async () => {
    if (!brand) return;

    try {
      setLoading(true)
      const values = await form.validateFields();
      const res = await updateBrandById(brand._id, values);
      toast.success(res.data?.message || "Cập nhật brand thành công");
      onClose();
      onSuccess();
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

  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      title="Sửa Brand"
      okText="Lưu"
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

export default EditBrand;
