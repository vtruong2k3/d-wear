import { useEffect } from 'react';
import { Modal, Input, Form } from 'antd';

import type { SizeOption } from '../../../../types/size/ISize';

interface EditSizeModalProps {
    isOpen: boolean;
    onSave: (updatedSize: SizeOption) => void;
    onCancel: () => void;
    editingSize: SizeOption | null;
    sizes: SizeOption[]; // Nếu không dùng thì có thể bỏ
}

const EditSizeModal = ({
    isOpen,
    onSave,
    onCancel,
    editingSize,
}: EditSizeModalProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingSize) {
            form.setFieldsValue({
                size_name: editingSize.size_name,
            });
        }
    }, [editingSize, form]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const updatedSize = {
                    _id: editingSize?._id || '',
                    size_name: values.size_name.trim(),
                };
                onSave(updatedSize);
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
            title="Cập nhật kích thước"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên kích thước"
                    name="size_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên kích thước!' }]}
                >
                    <Input placeholder="Nhập tên kích thước" maxLength={100} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditSizeModal;
