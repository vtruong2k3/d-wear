import React, { useEffect } from 'react';
import {
    Modal, Form, Input, Select, InputNumber, DatePicker, Switch, Row, Col, Typography
} from 'antd';
import dayjs from 'dayjs';
import { TagOutlined } from '@ant-design/icons';
import type { IVoucher } from '../../../../types/voucher/IVoucher';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface Props {
    mode: 'add' | 'edit';
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: Omit<IVoucher, "_id" | "createdAt" | "updatedAt">) => void;
    initialValues?: IVoucher | null;
}

const VoucherFormModal: React.FC<Props> = ({ mode, open, onCancel, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    dateRange: [
                        dayjs(initialValues.startDate),
                        dayjs(initialValues.endDate)
                    ]
                });
            } else {
                form.setFieldsValue({
                    discountType: 'percentage',
                    minOrderValue: 0,
                    maxDiscountValue: 0,
                    maxUser: 0,
                    isActive: true
                });
            }
        }
    }, [open, mode, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (values.discountType === 'fixed') {
                values.maxDiscountValue = 0;
            }
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
            title={
                <div className="flex items-center gap-3 text-blue-600">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <TagOutlined className="text-lg" />
                    </div>
                    <span className="text-lg font-bold">
                        {mode === 'add' ? 'Thêm Voucher Mới' : 'Chỉnh Sửa Voucher'}
                    </span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText={<span className="font-medium">{mode === 'add' ? 'Thêm mới' : 'Cập nhật'}</span>}
            cancelText="Hủy"
            width={800}
            destroyOnClose
            className="voucher-form-modal"
            centered
        >
            <div className="bg-gray-50/50 p-6 rounded-xl mt-4 border border-gray-100">
                <Form form={form} layout="vertical" className="mb-0">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Mã Voucher</span>}
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã voucher!' },
                                    { min: 3, message: 'Mã voucher phải có ít nhất 3 ký tự!' },
                                    { pattern: /^[A-Z0-9]+$/, message: 'Mã voucher chỉ được chứa chữ hoa và số!' }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập mã voucher (VD: SALE2024)"
                                    className="uppercase font-bold tracking-wider rounded-lg h-10"
                                    onChange={(e) => form.setFieldValue('code', e.target.value.toUpperCase())}
                                    disabled={mode === 'edit'} // Thường không cho sửa mã khi đã tạo
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Loại Giảm Giá</span>}
                                name="discountType"
                                rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                            >
                                <Select className="h-10">
                                    <Option value="percentage">Phần trăm (%)</Option>
                                    <Option value="fixed">Cố định (VNĐ)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prev, current) => prev.discountType !== current.discountType}
                            >
                                {({ getFieldValue }) => {
                                    const discountType = getFieldValue('discountType');

                                    if (discountType === 'percentage') {
                                        return (
                                            <Form.Item
                                                label={<span className="font-semibold text-gray-700">Giá Trị Giảm</span>}
                                                name="discountValue"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                                    { type: 'number', min: 1, max: 100, message: 'Từ 1% đến 100%!' }
                                                ]}
                                            >
                                                <InputNumber<number>
                                                    placeholder="Ví dụ: 10"
                                                    className="w-full rounded-lg h-10"
                                                    min={1}
                                                    max={100}
                                                    formatter={(value) => value != null ? `${value}%` : ''}
                                                    parser={(value) => value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0}
                                                />
                                            </Form.Item>
                                        );
                                    }

                                    return (
                                        <Form.Item
                                            label={<span className="font-semibold text-gray-700">Giá Trị Giảm</span>}
                                            name="discountValue"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                                { type: 'number', min: 1000, message: 'Tối thiểu 1000đ!' }
                                            ]}
                                        >
                                            <InputNumber<number>
                                                placeholder="Ví dụ: 50,000"
                                                className="w-full rounded-lg h-10"
                                                min={1000}
                                                formatter={(value) => value != null ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                                parser={(value) => value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0}
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Đơn Hàng Tối Thiểu</span>}
                                name="minOrderValue"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá trị!' },
                                    { type: 'number', min: 0, message: 'Giá trị phải >= 0!' }
                                ]}
                            >
                                <InputNumber<number>
                                    placeholder="0 = Không yêu cầu"
                                    className="w-full rounded-lg h-10"
                                    min={0}
                                    formatter={(value) => value != null ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                    parser={(value) => value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.discountType !== cur.discountType}>
                                {({ getFieldValue }) =>
                                    getFieldValue("discountType") === "percentage" ? (
                                        <Form.Item
                                            label={<span className="font-semibold text-gray-700">Giảm Giá Tối Đa</span>}
                                            name="maxDiscountValue"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập giá trị!' },
                                                { type: 'number', min: 0, message: 'Giá trị phải >= 0!' }
                                            ]}
                                        >
                                            <InputNumber<number>
                                                placeholder="0 = Không giới hạn"
                                                className="w-full rounded-lg h-10"
                                                min={0}
                                                formatter={(value) => value != null ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                                parser={(value) => value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0}
                                            />
                                        </Form.Item>
                                    ) : null
                                }
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Số Lượt Dùng Tối Đa</span>}
                                name="maxUser"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lượng!' },
                                    { type: 'number', min: 0, message: 'Phải >= 0!' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="0 = Không giới hạn lượt"
                                    className="w-full rounded-lg h-10"
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Thời Gian Áp Dụng</span>}
                                name="dateRange"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                            >
                                <RangePicker
                                    className="w-full rounded-lg h-10"
                                    format="DD/MM/YYYY"
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Trạng Thái Kích Hoạt</span>}
                                name="isActive"
                                valuePropName="checked"
                                className="mb-0"
                            >
                                <Switch
                                    checkedChildren="Hoạt động"
                                    unCheckedChildren="Tắt"
                                    className="scale-110 ml-2 shadow-sm"
                                />
                            </Form.Item>
                            <Text type="secondary" className="text-xs ml-2">Bật để khách hàng có thể nhập mã này</Text>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
};

export default VoucherFormModal;
