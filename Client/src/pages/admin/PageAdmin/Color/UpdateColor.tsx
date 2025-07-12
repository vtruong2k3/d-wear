import { useEffect } from 'react';
import { Modal, Input, Form } from 'antd';

import type { ColorOption } from '../../../../types/color/IColor';

interface EditColorModalProps {
    isOpen: boolean;
    onSave: (updatedColor: ColorOption) => void;
    onCancel: () => void;
    editingColor: ColorOption | null;
    colors: ColorOption[]; // nếu cần check trùng tên
}

const EditColorModal = ({
    isOpen,
    onSave,
    onCancel,
    editingColor,
}: EditColorModalProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingColor) {
            form.setFieldsValue({
                color_name: editingColor.color_name,
            });
        }
    }, [editingColor, form]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const updatedColor = {
                    _id: editingColor?._id || '',
                    color_name: values.color_name.trim(),
                };
                onSave(updatedColor);
                form.resetFields();
            })
            .catch(() => { });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Cập nhật màu sắc"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên màu sắc"
                    name="color_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên màu sắc!' }]}
                >
                    <Input placeholder="Nhập tên màu sắc" maxLength={100} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditColorModal;
