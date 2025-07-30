import { Modal, Input, Form } from 'antd';
import type { ColorOption } from '../../../../types/color/IColor';

interface AddColorModalProps {
    isOpen: boolean;
    onSave: (newColor: { color_name: string }) => void;
    onCancel: () => void;
    colors: ColorOption[]; // nếu cần check trùng lặp có thể dùng
}

const AddColorModal = ({ isOpen, onSave, onCancel }: AddColorModalProps) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newColor = {
                color_name: values.color_name.trim(),
            };

            await onSave(newColor);
            form.resetFields();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal

            title="Thêm Màu Sắc"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Thêm mới"
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

export default AddColorModal;
