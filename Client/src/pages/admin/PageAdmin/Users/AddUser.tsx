import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    Switch,
    Button,
    Upload,
    Avatar,
    Row,
    Col,
    message,
    Card,

    Space
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    CameraOutlined,
    GoogleOutlined,
    SaveOutlined,
    UndoOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';


const { Option } = Select;
const { Title } = Typography;
import { Typography } from 'antd';
import { createUser } from '../../../../services/admin/userServices';
import type { ErrorType } from '../../../../types/error/IError';

const AddUserForm: React.FC = () => {
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const formdata = new FormData();
            formdata.append("username", values.username);
            formdata.append("email", values.email);
            if (values.password) formdata.append("password", values.password);
            if (values.phone) formdata.append("phone", values.phone);
            formdata.append("role", values.role);
            formdata.append("isActive", String(values.isActive));


            if (avatarFile) {
                formdata.append("avatar", avatarFile, avatarFile.name);
            }

            const res = await createUser(formdata);
            message.success(res.message || "Thêm người dùng thành công!");
            navigate("/admin/users");
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const handleReset = () => {
        form.resetFields();
        setAvatarUrl('');
        form.setFieldsValue({
            role: 'user',
            isActive: true,
            isGoogleAccount: false
        });
    };

    const handleCancel = () => {
        navigate('/admin/users');
    };





    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>
                    <UserOutlined /> Thêm người dùng mới
                </Title>
                <p style={{ color: '#666', marginBottom: 0 }}>
                    Tạo tài khoản mới cho hệ thống
                </p>
            </div>

            <Row gutter={24}>
                {/* Form chính */}
                <Col span={16}>
                    <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
                        <Form
                            form={form}
                            layout="vertical"
                            requiredMark={false}
                            initialValues={{
                                role: 'user',
                                isActive: true,
                                isGoogleAccount: false
                            }}
                            onFinish={handleSubmit}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="username"
                                        label="Tên người dùng"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên người dùng!' },
                                            { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
                                            { max: 50, message: 'Tên người dùng không được quá 50 ký tự!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Nhập tên người dùng"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Nhập email"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[
                                            { pattern: /^[0-9+\-\s()]*$/, message: 'Số điện thoại không hợp lệ!' },
                                            { min: 10, message: 'Số điện thoại phải có ít nhất 10 số!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="Nhập số điện thoại"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="role"
                                        label="Vai trò"
                                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                                    >
                                        <Select placeholder="Chọn vai trò" size="large">
                                            <Option value="user">
                                                <UserOutlined /> Người dùng
                                            </Option>
                                            <Option value="admin">
                                                <UserOutlined /> Quản trị viên
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu"
                                    size="large"
                                />
                            </Form.Item>
                        </Form>
                    </Card>

                    {/* Cài đặt tài khoản */}
                    <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
                        <Card title="Cài đặt tài khoản">
                            <Row gutter={32}>
                                <Col span={12}>
                                    <Form.Item
                                        name="isActive"
                                        label="Trạng thái hoạt động"
                                        valuePropName="checked"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Switch
                                            checkedChildren="Kích hoạt"
                                            unCheckedChildren="Khóa"

                                        />
                                    </Form.Item>
                                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                        Tài khoản có thể đăng nhập và sử dụng hệ thống
                                    </p>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="isGoogleAccount"
                                        label="Tài khoản Google"
                                        valuePropName="checked"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Switch
                                            checkedChildren={<GoogleOutlined />}
                                            unCheckedChildren="Thường"
                                            disabled
                                        />
                                    </Form.Item>
                                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                        Tài khoản được liên kết với Google
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Col>

                {/* Sidebar */}
                <Col span={8}>
                    <Card title="Ảnh đại diện" style={{ marginBottom: 24 }}>
                        <div style={{ textAlign: 'center' }}>
                            <Avatar
                                size={150}
                                src={avatarUrl}
                                icon={<UserOutlined />}
                                style={{ marginBottom: 16 }}
                            />

                            <br />

                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const okType = /^image\/(jpeg|png|webp|gif)$/.test(file.type);
                                    if (!okType) {
                                        message.error("Chỉ chấp nhận ảnh JPG/PNG/WebP/GIF");
                                        return false;
                                    }
                                    const isLt5M = file.size / 1024 / 1024 < 5;
                                    if (!isLt5M) {
                                        message.error("Kích thước file phải nhỏ hơn 5MB!");
                                        return false;
                                    }
                                    setAvatarFile(file);                    // lưu file để submit
                                    setAvatarUrl(URL.createObjectURL(file)); // preview
                                    return false; // CHẶN auto-upload
                                }}
                                onRemove={() => {
                                    setAvatarFile(null);
                                    setAvatarUrl("");
                                }}
                            >
                                <Button icon={<CameraOutlined />} loading={loading} block>
                                    {avatarUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                                </Button>
                            </Upload>

                            <p style={{
                                fontSize: '12px',
                                color: '#666',
                                marginTop: 8,
                                marginBottom: 0
                            }}>
                                Định dạng: JPG, PNG, GIF<br />
                                Kích thước tối đa: 5MB
                            </p>
                        </div>
                    </Card>

                    {/* Actions */}
                    <Card title="Hành động">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={loading}
                                onClick={handleSubmit}
                                size="large"
                                block
                            >
                                Tạo người dùng
                            </Button>

                            <Button
                                icon={<UndoOutlined />}
                                onClick={handleReset}
                                size="large"
                                block
                            >
                                Làm mới form
                            </Button>

                            <Button
                                onClick={handleCancel}
                                size="large"
                                block
                            >
                                Hủy và quay lại
                            </Button>
                        </Space>
                    </Card>

                    {/* Tips */}
                    <Card
                        title="💡 Gợi ý"
                        size="small"
                        style={{ marginTop: 16 }}
                    >
                        <ul style={{
                            fontSize: '12px',
                            color: '#666',
                            paddingLeft: '16px',
                            margin: 0
                        }}>
                            <li>Email sẽ được sử dụng để đăng nhập</li>
                            <li>Mật khẩu nên chứa ít nhất 6 ký tự</li>
                            <li>Vai trò Admin có quyền quản lý hệ thống</li>
                            <li>Ảnh đại diện giúp nhận diện người dùng</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddUserForm;