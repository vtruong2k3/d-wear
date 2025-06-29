import { Modal, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

const EditBrand = ({ visible, onClose, brand }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(brand || {});
  }, [brand, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/api/brand/${brand._id}`, values);
      message.success('Cập nhật brand thành công');
      onClose();
      form.resetFields();
    } catch {
      message.error('Cập nhật thất bại');
    }
  };

  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      title="Sửa Brand"
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="brand_name"
          label="Tên brand"
          rules={[{ required: true, message: 'Nhập tên brand' }]}
        >
          <Input placeholder="Nhập tên brand" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBrand;
