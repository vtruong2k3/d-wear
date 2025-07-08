// import React, { useState } from 'react';
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   InputNumber,
//   Row,
//   Col,
//   Upload,
//   Button
// } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { SIZE_OPTIONS } from '../../../../utils/constants/variant';
// import type { IProductOption, IVariants } from '../../../../types/IVariants';
// import type { RcFile, UploadFile } from 'antd/es/upload/interface';
// import { toast } from 'react-toastify';

// interface AddVariantModalProps {
//   visible: boolean;
//   onCancel: () => void;
//   onSubmit: (values: IVariants, fileList: File[]) => void;
//   products: IProductOption[];
// }

// const AddVariant: React.FC<AddVariantModalProps> = ({
//   visible,
//   onCancel,
//   onSubmit,
//   products
// }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   const handleOk = () => {
//     form.submit();
//   };

//   const onFinish = (values: IVariants) => {
//     const realFiles = fileList
//       .map((f) => f.originFileObj)
//       .filter((f): f is RcFile => !!f); // ✅ an toàn cho cả File & RcFile

//     if (!realFiles.length) {
//       toast.error("Vui lòng chọn ít nhất 1 ảnh!");
//       return;
//     }

//     onSubmit(values, realFiles);
//     form.resetFields();
//     setFileList([]);
//   };



//   return (
//     <Modal
//       title="Thêm Biến Thể"
//       open={visible}
//       onCancel={onCancel}
//       onOk={handleOk}
//       okText="Thêm"
//       cancelText="Hủy"
//       width={600}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         initialValues={{ stock: 0, price: 0 }}
//       >
//         <Form.Item
//           name="product_id"
//           label="Sản phẩm"
//           rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
//         >
//           <Select
//             placeholder="Chọn sản phẩm"
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
//             }


//           >
//             {products.map((product) => (
//               <Select.Option key={product._id} value={product._id}>
//                 {product.product_name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="size"
//               label="Kích thước"
//               rules={[{ required: true, message: 'Chọn kích thước' }]}
//             >
//               <Select placeholder="Chọn size">
//                 {SIZE_OPTIONS.map((size) => (
//                   <Select.Option key={size} value={size}>
//                     {size}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="color"
//               label="Màu sắc"
//               rules={[{ required: true, message: 'Nhập màu sắc' }]}
//             >
//               <Input placeholder="VD: Đỏ, Xanh, Vàng..." />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="stock"
//               label="Số lượng tồn kho"
//               rules={[{ required: true, message: 'Nhập số lượng tồn kho' }]}
//             >
//               <InputNumber min={0} className="w-full" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="price"
//               label="Giá bán (VNĐ)"
//               rules={[{ required: true, message: 'Nhập giá bán' }]}
//             >
//               <InputNumber<number>
//                 min={0}
//                 className="w-full"
//                 formatter={(value) =>
//                   value ? value.toLocaleString('vi-VN') : ''
//                 }
//                 parser={(value) =>
//                   value ? parseInt(value.replace(/\D/g, '')) : 0
//                 }
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item label="Hình ảnh biến thể">
//           <Upload
//             name="imageVariant" // ✅ Tên phải đúng với Multer bên backend
//             listType="picture"
//             beforeUpload={() => false} // ✅ Rất quan trọng, để Ant Design không auto upload
//             multiple
//             maxCount={5}
//             fileList={fileList}
//             onChange={({ fileList: newFileList }) => setFileList(newFileList)}
//           >
//             <Button icon={<UploadOutlined />}>Chọn ảnh (Tối đa 5 ảnh)</Button>
//           </Upload>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AddVariant;
