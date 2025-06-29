// Modal chỉnh sửa biến thể sản phẩm
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import type { IVariants } from '../../../../types/IVariants';
import { COLOR_OPTIONS, SIZE_OPTIONS } from '../../../../utils/constants/variant';

interface EditVariantModalProps {
  visible: boolean;
  initialValues: IVariants | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const EditVariantModal: React.FC<EditVariantModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  // Khi mở modal, gán giá trị ban đầu vào form
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  // Khi người dùng nhấn OK
  const handleOk = () => {
    form.submit();
  };

  // Khi form hợp lệ và submit
  const onFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Chỉnh Sửa Biến Thể"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="product_id"
          label="Mã sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
        >
          <Input placeholder="VD: PROD001" />
        </Form.Item>

        <Form.Item
          name="size"
          label="Kích thước"
          rules={[{ required: true, message: 'Chọn kích thước' }]}
        >
          <Select placeholder="Chọn size">
            {SIZE_OPTIONS.map(size => (
              <Select.Option key={size} value={size}>
                {size}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="color"
          label="Màu sắc"
          rules={[{ required: true, message: 'Chọn màu sắc' }]}
        >
          <Select placeholder="Chọn màu">
            {COLOR_OPTIONS.map(color => (
              <Select.Option key={color} value={color}>
                {color}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="stock"
          label="Số lượng tồn kho"
          rules={[{ required: true, message: 'Nhập số lượng' }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá bán"
          rules={[{ required: true, message: 'Nhập giá bán' }]}
        >
          <InputNumber
            min={1000}
            step={1000}
            className="w-full"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|,*/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditVariantModal;
