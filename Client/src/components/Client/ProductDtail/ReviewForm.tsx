import React, { useState } from 'react';
import { Upload, message, Form, Input, Rate, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { FormValuesReview } from '../../../types/IReview';

const { TextArea } = Input;

interface Props {
    onSubmit: (values: FormValuesReview, fileList: UploadFile[]) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

const ReviewForm: React.FC<Props> = ({ onSubmit, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ được upload file ảnh!");
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Kích thước ảnh phải nhỏ hơn 5MB!");
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    const handleUploadChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleFinish = async (values: any) => {
        await onSubmit(values, fileList);
        form.resetFields();
        setFileList([]);
    };

    const handleCancelClick = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Thêm ảnh</div>
        </div>
    );

    return (
        <div className="bg-white border border-blue-100 shadow-md rounded-xl p-6 mb-8 transform transition-all duration-300 ease-in-out">
            <h4 className="text-xl font-bold mb-6 text-gray-800">Viết đánh giá của bạn</h4>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ rating: 5, comment: '' }}
            >
                <Form.Item
                    label={<span className="font-medium text-gray-700">Đánh giá sao</span>}
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
                >
                    <Rate allowHalf={false} style={{ fontSize: 28 }} className="text-yellow-400" />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">Bình luận</span>}
                    name="comment"
                    rules={[{ min: 5, message: 'Bình luận tối thiểu 5 ký tự!' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        showCount
                        maxLength={1000}
                        className="rounded-lg resize-none hover:border-blue-400 focus:border-blue-500 transition-colors"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">Hình ảnh đính kèm (tùy chọn)</span>}
                    name="images"
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                        multiple
                        maxCount={5}
                        accept="image/*"
                        className="review-upload"
                    >
                        {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                    <div className="text-xs text-gray-500 mt-2">
                        Tối đa 5 hình ảnh. Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                    </div>
                </Form.Item>

                <Form.Item className="mb-0">
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="bg-blue-600 hover:bg-blue-700 border-none px-6 h-10 font-medium rounded-lg shadow-md"
                        >
                            Gửi đánh giá
                        </Button>
                        <Button 
                            onClick={handleCancelClick}
                            className="h-10 px-6 rounded-lg font-medium hover:bg-gray-50"
                        >
                            Hủy
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ReviewForm;
