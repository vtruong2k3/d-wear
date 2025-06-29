import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const AddBrand = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('/api/brand', values);
      message.success('Thêm brand thành công');
      onClose();
      form.resetFields();
    } catch {
      message.error('Thêm brand thất bại');
    }
  };

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
          rules={[{ required: true, message: 'Nhập tên brand' }]}
        >
          <Input placeholder="Nhập tên brand" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBrand;
