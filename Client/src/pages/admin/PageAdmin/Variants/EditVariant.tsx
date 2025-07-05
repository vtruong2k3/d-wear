import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Upload,
  Button
} from 'antd';
import type { IProductOption, IVariants, VariantFormValues } from '../../../../types/IVariants';
import { SIZE_OPTIONS } from '../../../../utils/constants/variant';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';


interface EditVariantProps {
  visible: boolean;
  initialValues: IVariants | null;
  onCancel: () => void;
  onSubmit: (values: VariantFormValues, imageFiles: File[] | null) => void;
  products: IProductOption[];
}

const EditVariantModal: React.FC<EditVariantProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  products
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);

      //  Hiển thị ảnh cũ nếu có
      if (initialValues.image && Array.isArray(initialValues.image)) {
        const defaultFiles: UploadFile[] = initialValues.image.map((url, index) => ({
          uid: `old-${index}`,
          name: `Ảnh ${index + 1}`,
          status: 'done',
          url: url,
        }));
        setFileList(defaultFiles);
      } else {
        setFileList([]);
      }
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values: IVariants) => {
    const realFiles = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f);

    // ✅ Nếu không có ảnh mới => giữ nguyên ảnh cũ bằng null
    const imageFiles = realFiles.length > 0 ? realFiles : null;

    onSubmit(values, imageFiles);
    form.resetFields();
    setFileList([]);
  };

  return (
    <Modal
      title="Chỉnh Sửa Biến Thể"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Cập nhật"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="product_id"
          label="Sản phẩm"
          rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
            }
          >
            {products.map(product => (
              <Select.Option key={product._id} value={product._id}>
                {product.product_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>

          <Col span={12}>
            <Form.Item
              name="color"
              label="Màu sắc"
              rules={[{ required: true, message: 'Nhập màu sắc' }]}
            >
              <Input placeholder="VD: Đỏ, Xanh, Vàng..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="stock"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Nhập số lượng' }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá bán (VNĐ)"
              rules={[{ required: true, message: 'Nhập giá bán' }]}
            >
              <InputNumber<number>
                min={0}
                className="w-full"
                placeholder="Nhập giá..."
                formatter={(value) =>
                  value != null ? value.toLocaleString('vi-VN') : ''
                }
                parser={(value) =>
                  value ? parseInt(value.replace(/\D/g, '')) : 0
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Hình ảnh biến thể">
          <Upload
            name="imageVariant"
            listType="picture"
            beforeUpload={() => false}
            multiple
            maxCount={5}
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh (Tối đa 5 ảnh)</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditVariantModal;
