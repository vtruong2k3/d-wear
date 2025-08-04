import { useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    DatePicker,
    Switch,
    Row,
    Col
} from 'antd';
import dayjs from 'dayjs';
import type { IVoucher } from '../../../../types/voucher/IVoucher';

const { Option } = Select;
const { RangePicker } = DatePicker;
interface EditVoucherFormProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: Omit<IVoucher, "_id" | "createdAt" | "updatedAt">) => void;
    editingVoucher: IVoucher | null;
}
const EditVoucherForm = ({ open, onCancel, onSubmit, editingVoucher }: EditVoucherFormProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && editingVoucher) {
            form.setFieldsValue({
                ...editingVoucher,
                dateRange: [
                    dayjs(editingVoucher.startDate),
                    dayjs(editingVoucher.endDate)
                ]
            });
        }
    }, [open, editingVoucher, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const [startDate, endDate] = values.dateRange;

            const formattedValues = {
                ...values,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            };

            delete formattedValues.dateRange;
            onSubmit(formattedValues);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Chỉnh Sửa Voucher"
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText="Cập nhật"
            cancelText="Hủy"
            width={800}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã Voucher"
                            name="code"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã voucher!' },
                                { min: 3, message: 'Mã voucher phải có ít nhất 3 ký tự!' },
                                { pattern: /^[A-Z0-9]+$/, message: 'Mã voucher chỉ được chứa chữ hoa và số!' }
                            ]}
                        >
                            <Input
                                placeholder="Nhập mã voucher"
                                className="uppercase"
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    form.setFieldValue('code', value);
                                }}
                                disabled // Thường không cho sửa mã voucher
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Loại Giảm Giá"
                            name="discountType"
                            rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                        >
                            <Select placeholder="Chọn loại giảm giá">
                                <Option value="percentage">Phần trăm (%)</Option>
                                <Option value="fixed">Cố định (VNĐ)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Giá Trị Giảm"
                            name="discountValue"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                { type: 'number', min: 1, message: 'Giá trị phải lớn hơn 0!' },
                                { type: 'number', min: 100, message: 'Giá trị phải nhỏ hơn 100!' }
                            ]}
                        >
                            <InputNumber<number>
                                placeholder="Nhập giá trị giảm"
                                className="w-full"
                                min={1}
                                formatter={(value) =>
                                    form.getFieldValue('discountType') === 'percentage'
                                        ? `${value}%`
                                        : `${value}`?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={(value) => (value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0)}
                            />

                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Đơn Hàng Tối Thiểu"
                            name="minOrderValue"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu!' },
                                { type: 'number', min: 10000, message: 'Giá trị phải lớn hơn hoặc bằng 10.000đ!' },

                            ]}
                        >
                            <InputNumber<number>
                                placeholder="0 = Không giới hạn"
                                className="w-full"
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => (value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0)}
                            />

                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Giảm Giá Tối Đa"
                            name="maxDiscountValue"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị đơn hàng tối đa!' },
                                { type: 'number', min: 10000, message: 'Giá trị phải lớn hơn hoặc bằng 10.000đ!' }
                            ]}
                        >
                            <InputNumber<number>
                                className="w-full"
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => (value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0)}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Số User Tối Đa"
                            name="maxUser"
                            rules={[
                                { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber
                                placeholder="Nhập số user tối đa"
                                className="w-full"
                                min={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Thời Gian Hiệu Lực"
                    name="dateRange"
                    rules={[
                        { required: true, message: 'Vui lòng chọn thời gian hiệu lực!' }
                    ]}
                >
                    <RangePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    />
                </Form.Item>

                <Form.Item
                    label="Trạng Thái"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Không hoạt động"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditVoucherForm;