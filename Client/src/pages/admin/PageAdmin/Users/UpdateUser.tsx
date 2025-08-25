import React, { useEffect, useState } from 'react';
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
    Spin,
    Space,
    Tag,
    Alert
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    CameraOutlined,
    GoogleOutlined,
    SaveOutlined,

    HistoryOutlined,
    EditOutlined
} from '@ant-design/icons';

import { useNavigate, useParams } from 'react-router-dom';

import type { IUsersDetail } from '../../../../types/IUser';

const { Option } = Select;
import { Typography } from 'antd';
const { Title, Text } = Typography;

import { fetchUserById, updateUser } from '../../../../services/admin/userServices';
import type { ErrorType } from '../../../../types/error/IError';

const EditUserForm: React.FC = () => {
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [userData, setUserData] = useState<IUsersDetail | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Load user data
    useEffect(() => {
        const loadUserData = async () => {
            if (!id) return;
            console.log('Loading user data for ID:', id);
            try {
                setUserLoading(true);
                const res = await fetchUserById(id)
                setUserData(res.user);
                setAvatarUrl(`http://localhost:5000${res.user.avatar}`);
                form.setFieldsValue({
                    username: res.user.username,
                    email: res.user.email,
                    phone: res.user.phone,
                    role: res.user.role,
                    isActive: res.user.isActive,
                    isGoogleAccount: res.user.isGoogleAccount,
                });


            } catch (error) {
                console.error('Error loading user data:', error);
                message.error('Không thể tải thông tin người dùng!');
                navigate('/admin/users');
            } finally {
                setUserLoading(false);
            }
        };

        loadUserData();
    }, [id, form, navigate]);

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
            const res = await updateUser(id, formdata);
            message.success(res.message || "Cập nhật người dùng thành công!");
            console.log('Updating user:', { id, data: formdata });


            navigate('/admin/users');

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
        if (!userData) return;

        form.setFieldsValue({
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            isActive: userData.isActive,
            isGoogleAccount: userData.isGoogleAccount,
        });
        setAvatarUrl(`http://localhost:5000${userData.avatar}`);
        form.setFieldValue('password', '');
    };

    const handleCancel = () => {
        navigate('/admin/users');
    };





    if (userLoading) {
        return (
            <div style={{
                padding: 24,
                textAlign: 'center',
                minHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Spin size="large" />
                <div style={{ marginLeft: 16 }}>Đang tải thông tin người dùng...</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Không tìm thấy người dùng"
                    description="Người dùng không tồn tại hoặc đã bị xóa"
                    type="error"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/admin/users')}>
                            Quay lại danh sách
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>
                    <EditOutlined /> Chỉnh sửa người dùng
                </Title>
                <Space>
                    <Text type="secondary">ID: {userData._id}</Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">
                        Tạo ngày: {new Date(userData.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">
                        Cập nhật: {new Date(userData.updatedAt).toLocaleDateString('vi-VN')}
                    </Text>
                </Space>
            </div>

            <Row gutter={24}>
                {/* Form chính */}
                <Col span={16}>
                    <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
                        <Form
                            form={form}
                            layout="vertical"
                            requiredMark={false}
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

                                        label={
                                            <Space>
                                                Email
                                                <Tag color="orange" style={{ fontSize: 12, padding: '0 6px', lineHeight: '20px', height: 20 }} >Không thể thay đổi</Tag>
                                            </Space>
                                        }

                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Email"
                                            size="large"
                                            disabled
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
                                label="Mật khẩu mới"
                                help="Để trống nếu không muốn thay đổi mật khẩu"
                                rules={[
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu mới"
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

                    {/* User Status */}
                    <Card title="Trạng thái tài khoản" style={{ marginBottom: 24 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>Trạng thái:</Text>
                                <Tag color={userData.isActive ? 'green' : 'red'}>
                                    {userData.isActive ? 'Kích hoạt' : 'Đã khóa'}
                                </Tag>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>Loại tài khoản:</Text>
                                <Tag color={userData.isGoogleAccount ? 'blue' : 'default'}>
                                    {userData.isGoogleAccount ? 'Google' : 'Thường'}
                                </Tag>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>Vai trò:</Text>
                                <Tag color={userData.role === 'admin' ? 'volcano' : 'blue'}>
                                    {userData.role}
                                </Tag>
                            </div>
                        </Space>
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
                                Lưu thay đổi
                            </Button>

                            <Button
                                icon={<HistoryOutlined />}
                                onClick={handleReset}
                                size="large"
                                block
                            >
                                Hoàn tác thay đổi
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

                    {/* Warning */}
                    <Alert
                        message="Lưu ý"
                        description="Email không thể thay đổi. Để trống mật khẩu nếu không muốn thay đổi."
                        type="warning"
                        showIcon
                        style={{ marginTop: 16, padding: 8, fontSize: 12 }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default EditUserForm;