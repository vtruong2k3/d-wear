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
    Space,
    Typography,
    Divider
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    CameraOutlined,
    GoogleOutlined,
    SaveOutlined,
    UndoOutlined,
    ArrowLeftOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../../../services/admin/userServices';
import type { ErrorType } from '../../../../types/error/IError';

const { Option } = Select;
const { Title, Text } = Typography;

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
        setAvatarFile(null);
    };

    return (
        <div style={{ padding: '24px 40px', maxWidth: 1400, margin: '0 auto', background: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/admin/users')}
                    style={{ marginRight: 16, fontSize: 16 }}
                />
                <div>
                    <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                        Thêm Người Dùng Mới
                    </Title>
                    <Text type="secondary">Tạo tài khoản và phân quyền truy cập hệ thống</Text>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Cột trái: Form nhập liệu */}
                <Col xs={24} lg={16}>
                    <Form
                        form={form}
                        layout="vertical"
                        requiredMark={false}
                        initialValues={{
                            role: 'user',
                            isActive: true,
                            isGoogleAccount: false
                        }}
                    >
                        <Card 
                            title={<><UserOutlined style={{ marginRight: 8 }}/> Thông tin cơ bản</>} 
                            bordered={false}
                            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 24 }}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="username"
                                        label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập họ tên!' },
                                            { min: 3, message: 'Ít nhất 3 ký tự!' }
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Nhập họ và tên..." size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label={<span style={{ fontWeight: 500 }}>Địa chỉ Email</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' }
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }}/>} placeholder="example@email.com" size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="phone"
                                        label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>}
                                    >
                                        <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Nhập số điện thoại..." size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="password"
                                        label={<span style={{ fontWeight: 500 }}>Mật khẩu đăng nhập</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                            { min: 6, message: 'Ít nhất 6 ký tự!' }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }}/>} placeholder="••••••••" size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card 
                            title={<><SafetyCertificateOutlined style={{ marginRight: 8 }}/> Phân quyền & Cài đặt</>}
                            bordered={false}
                            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="role"
                                        label={<span style={{ fontWeight: 500 }}>Vai trò hệ thống</span>}
                                    >
                                        <Select size="large" style={{ borderRadius: 8 }}>
                                            <Option value="user">Người dùng (User)</Option>
                                            <Option value="admin">Quản trị viên (Admin)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div style={{ padding: '16px 20px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                                        <Form.Item
                                            name="isActive"
                                            valuePropName="checked"
                                            style={{ margin: 0 }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Text strong>Trạng thái hoạt động</Text>
                                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>Cho phép đăng nhập vào hệ thống</div>
                                                </div>
                                                <Switch />
                                            </div>
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Col>

                {/* Cột phải: Avatar & Actions */}
                <Col xs={24} lg={8}>
                    <Card 
                        bordered={false}
                        style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 24, textAlign: 'center' }}
                    >
                        <Title level={5} style={{ marginBottom: 24 }}>Ảnh đại diện</Title>
                        
                        <div style={{ 
                            width: 160, height: 160, margin: '0 auto 24px', 
                            borderRadius: '50%', padding: 4,
                            border: '2px dashed #d9d9d9',
                            position: 'relative',
                            transition: 'all 0.3s'
                        }}>
                            <Avatar
                                size={148}
                                src={avatarUrl}
                                icon={<UserOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />}
                                style={{ background: '#f5f5f5' }}
                            />
                        </div>

                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                const isLt5M = file.size / 1024 / 1024 < 5;
                                if (!isLt5M) {
                                    message.error("Kích thước file phải nhỏ hơn 5MB!");
                                    return false;
                                }
                                setAvatarFile(file);
                                setAvatarUrl(URL.createObjectURL(file));
                                return false;
                            }}
                        >
                            <Button icon={<CameraOutlined />} size="large" style={{ borderRadius: 8, width: '100%' }}>
                                {avatarUrl ? "Thay đổi ảnh" : "Tải ảnh lên"}
                            </Button>
                        </Upload>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 12 }}>
                            Hỗ trợ *.png, *.jpg, *.jpeg (Max 5MB)
                        </Text>
                    </Card>

                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={loading}
                                onClick={handleSubmit}
                                size="large"
                                block
                                style={{ borderRadius: 8, height: 48 }}
                            >
                                Lưu Người Dùng
                            </Button>
                            <Button
                                icon={<UndoOutlined />}
                                onClick={handleReset}
                                size="large"
                                block
                                style={{ borderRadius: 8 }}
                            >
                                Đặt lại thông tin
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddUserForm;