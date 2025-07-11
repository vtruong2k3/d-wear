import { Modal, Input, Form } from 'antd';
import type { SizeOption } from '../../../../types/size/ISize';

interface AddSizeModalProps {
    isOpen: boolean;
    onSave: (newSize: { size_name: string }) => void;
    onCancel: () => void;
    sizes: SizeOption[]; // optional nếu không dùng
}

const AddSizeModal = ({ isOpen, onSave, onCancel }: AddSizeModalProps) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newSize = {
                size_name: values.size_name.trim(),
            };

            await onSave(newSize); // ✅ chờ hàm onSave xử lý (thường là gọi API)
            form.resetFields();
        } catch (err) {
            // validate lỗi thì catch vào đây
            console.error(err);
        }
    };


    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Thêm Kích Thước"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Thêm mới"
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

export default AddSizeModal;
