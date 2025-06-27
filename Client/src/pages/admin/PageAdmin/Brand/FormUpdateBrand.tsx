import { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const EditBrandModal = ({ visible, brand, onUpdate, onClose }) => {
    const [form] = Form.useForm();

    // Effect để set giá trị form khi brand thay đổi
    useEffect(() => {
        if (visible && brand) {
            form.setFieldsValue({
                name: brand.name,
                description: brand.description || ''
            });
        }
    }, [visible, brand, form]);

    // Hàm xử lý cập nhật brand
    const handleSubmit = async (values) => {
        try {
            // Validate dữ liệu trước khi gửi
            const trimmedName = values.name.trim();

            if (!trimmedName) {
                message.error('Tên brand không được để trống!');
                return;
            }

            // Kiểm tra xem có thay đổi gì không
            const hasChanges = trimmedName !== brand.name ||
                (values.description || '').trim() !== (brand.description || '');

            if (!hasChanges) {
                message.info('Không có thay đổi nào để cập nhật!');
                return;
            }

            // Gọi hàm onUpdate từ parent component
            await onUpdate(brand.id, {
                ...values,
                name: trimmedName,
                description: (values.description || '').trim()
            });

        } catch (error) {
            console.error('Lỗi khi cập nhật brand:', error);
            message.error('Có lỗi xảy ra khi cập nhật brand!');
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

    // Hàm reset form về giá trị ban đầu
    const handleReset = () => {
        if (brand) {
            form.setFieldsValue({
                name: brand.name,
                description: brand.description || ''
            });
            message.info('Đã khôi phục giá trị ban đầu!');
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <EditOutlined className="text-blue-600" />
                    </div>
                    <div>
                        <span className="text-xl font-semibold text-gray-800">
                            Chỉnh Sửa Brand
                        </span>
                        {brand && (
                            <div className="text-sm text-gray-500 mt-1">
                                ID: {brand.id} - {brand.name}
                            </div>
                        )}
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={500}
            className="custom-modal"
            destroyOnClose={true}
            maskClosable={false}
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
                            placeholder="Nhập tên brand..."
                            size="large"
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            maxLength={50}
                            showCount
                            autoFocus
                        />
                    </Form.Item>



                    {/* Thông tin bổ sung */}
                    {brand && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Thông tin hiện tại:
                            </h4>
                            <div className="text-sm text-gray-600">
                                <div>• Tên: <span className="font-medium">{brand.name}</span></div>

                            </div>
                        </div>
                    )}

                    {/* Footer buttons */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="dashed"
                            onClick={handleReset}
                            className="min-w-[100px] h-10 font-medium"
                        >
                            Khôi phục
                        </Button>

                        <div className="flex gap-3">
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
                                icon={<EditOutlined />}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 min-w-[120px] h-10 font-medium shadow-lg hover:shadow-xl"
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default EditBrandModal;