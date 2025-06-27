import { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddBrandModal = ({ visible, onAdd, onClose }) => {
    const [form] = Form.useForm();

    // Effect để reset form khi modal mở
    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible, form]);

    // Hàm xử lý thêm brand mới
    const handleSubmit = async (values) => {
        try {
            // Validate dữ liệu trước khi gửi
            const trimmedName = values.name.trim();

            if (!trimmedName) {
                message.error('Tên brand không được để trống!');
                return;
            }

            // Gọi hàm onAdd từ parent component
            await onAdd({ ...values, name: trimmedName });

            // Reset form sau khi thêm thành công
            form.resetFields();
        } catch (error) {
            console.error('Lỗi khi thêm brand:', error);
            message.error('Có lỗi xảy ra khi thêm brand!');
        }
    };

    // Hàm xử lý đóng modal
    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    // Hàm validate tên brand
    const validateBrandName = async (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject(new Error('Vui lòng nhập tên brand!'));
        }

        const trimmedValue = value.trim();

        if (trimmedValue.length < 2) {
            return Promise.reject(new Error('Tên brand phải có ít nhất 2 ký tự!'));
        }

        if (trimmedValue.length > 50) {
            return Promise.reject(new Error('Tên brand không được quá 50 ký tự!'));
        }

        // Kiểm tra ký tự đặc biệt (tùy chọn)
        const specialCharRegex = /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/;
        if (!specialCharRegex.test(trimmedValue)) {
            return Promise.reject(new Error('Tên brand chỉ được chứa chữ cái, số và khoảng trắng!'));
        }

        return Promise.resolve();
    };

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <PlusOutlined className="text-green-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-800">
                        Thêm Brand Mới
                    </span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={500}
            className="custom-modal"
            destroyOnClose={true}
            maskClosable={false} // Không cho phép đóng khi click ra ngoài
        >
            <div className="mt-6">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    preserve={false}
                    autoComplete="off"
                >
                    <Form.Item
                        label={
                            <span className="text-gray-800 font-semibold text-base">
                                Tên Brand <span className="text-red-500">*</span>
                            </span>
                        }
                        name="name"
                        rules={[
                            { validator: validateBrandName }
                        ]}
                        hasFeedback
                    >
                        <Input
                            placeholder="Ví dụ: Nike, Adidas, Puma..."
                            size="large"
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            maxLength={50}
                            showCount
                            autoFocus
                        />
                    </Form.Item>




                    {/* Footer buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            size="large"
                            onClick={handleClose}
                            className="min-w-[100px] h-10 font-medium"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<PlusOutlined />}
                            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 min-w-[120px] h-10 font-medium shadow-lg hover:shadow-xl"
                        >
                            Thêm Brand
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddBrandModal;