import React, { useEffect, useState } from 'react';
import {
    Form, Input, Select, Switch, Button, Upload, Avatar,
    Row, Col, message, Card, Spin, Space, Tag, Alert, Typography
} from 'antd';
import {
    UserOutlined, MailOutlined, PhoneOutlined, LockOutlined,
    CameraOutlined, GoogleOutlined, SaveOutlined,
    HistoryOutlined, ArrowLeftOutlined, SafetyCertificateOutlined,
    CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { IUsersDetail } from '../../../../types/IUser';
import { fetchUserById, updateUser } from '../../../../services/admin/userServices';
import type { ErrorType } from '../../../../types/error/IError';

const { Option } = Select;
const { Title, Text } = Typography;

const EditUserForm: React.FC = () => {
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [userData, setUserData] = useState<IUsersDetail | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            if (!id) return;
            try {
                setUserLoading(true);
                const res = await fetchUserById(id);
                setUserData(res.user);
                setAvatarUrl(res.user.avatar?.startsWith('http') ? res.user.avatar : `http://localhost:5000${res.user.avatar}`);
                form.setFieldsValue({
                    username: res.user.username,
                    email: res.user.email,
                    phone: res.user.phone,
                    role: res.user.role,
                    isActive: res.user.isActive,
                    isGoogleAccount: res.user.isGoogleAccount,
                });
            } catch (error) {
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
            message.success(res.message || "Cập nhật thành công!");
            navigate('/admin/users');
        } catch (error) {
            const errorMessage = (error as ErrorType).response?.data?.message || (error as ErrorType).message || "Lỗi cập nhật.";
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
        });
        setAvatarUrl(userData.avatar?.startsWith('http') ? userData.avatar : `http://localhost:5000${userData.avatar}`);
        form.setFieldValue('password', '');
    };

    if (userLoading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" tip={<div style={{ marginTop: 12 }}>Đang tải hồ sơ...</div>} />
            </div>
        );
    }

    if (!userData) return null;

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
                        Cập Nhật Thông Tin
                    </Title>
                    <Space size="middle" style={{ marginTop: 4 }}>
                        <Text type="secondary">ID: <Text strong>{userData._id}</Text></Text>
                        <Text type="secondary">Cập nhật lúc: {new Date(userData.updatedAt).toLocaleDateString('vi-VN')}</Text>
                    </Space>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Form Col */}
                <Col xs={24} lg={16}>
                    <Form form={form} layout="vertical" requiredMark={false}>
                        <Card 
                            title={<><UserOutlined style={{ marginRight: 8 }}/> Thông tin cá nhân</>} 
                            bordered={false}
                            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 24 }}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="username"
                                        label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }, { min: 3, message: 'Ít nhất 3 ký tự!' }]}
                                    >
                                        <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }}/>} size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label={
                                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 500 }}>Email</span>
                                                <Tag color="error" style={{ border: 0 }}>Cố định</Tag>
                                            </Space>
                                        }
                                    >
                                        <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }}/>} size="large" disabled style={{ borderRadius: 8, color: '#8c8c8c' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="phone" label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>}>
                                        <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }}/>} size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="password" label={<span style={{ fontWeight: 500 }}>Đổi mật khẩu</span>}>
                                        <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Để trống nếu không đổi" size="large" style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card 
                            title={<><SafetyCertificateOutlined style={{ marginRight: 8 }}/> Phân quyền & Trạng thái</>}
                            bordered={false}
                            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="role" label={<span style={{ fontWeight: 500 }}>Vai trò hệ thống</span>}>
                                        <Select size="large" style={{ borderRadius: 8 }}>
                                            <Option value="user">Người dùng (User)</Option>
                                            <Option value="admin">Quản trị viên (Admin)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div style={{ padding: '16px 20px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                                        <Form.Item name="isActive" valuePropName="checked" style={{ margin: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Text strong>Trạng thái truy cập</Text>
                                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{form.getFieldValue('isActive') ? 'Đang hoạt động' : 'Bị khóa'}</div>
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

                {/* Sidebar Col */}
                <Col xs={24} lg={8}>
                    {/* User Profile Summary */}
                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 24, textAlign: 'center' }}>
                        <div style={{ 
                            width: 140, height: 140, margin: '0 auto 20px', 
                            borderRadius: '50%', padding: 4,
                            border: '2px dashed #d9d9d9',
                        }}>
                            <Avatar size={128} src={avatarUrl} icon={<UserOutlined />} style={{ background: '#f5f5f5' }} />
                        </div>

                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setAvatarFile(file);
                                setAvatarUrl(URL.createObjectURL(file));
                                return false;
                            }}
                        >
                            <Button icon={<CameraOutlined />} size="middle" style={{ borderRadius: 8 }}>
                                Thay ảnh đại diện
                            </Button>
                        </Upload>
                        
                        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0', textAlign: 'left' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Nguồn tài khoản</Text>
                                    {userData.isGoogleAccount ? (
                                        <Tag icon={<GoogleOutlined />} color="blue" style={{ border: 0 }}>Google</Tag>
                                    ) : (
                                        <Tag color="default" style={{ border: 0 }}>Mặc định</Tag>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Đăng ký ngày</Text>
                                    <Text strong>{new Date(userData.createdAt).toLocaleDateString('vi-VN')}</Text>
                                </div>
                            </Space>
                        </div>
                    </Card>

                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSubmit} size="large" block style={{ borderRadius: 8, height: 48 }}>
                                Lưu Thay Đổi
                            </Button>
                            <Button icon={<HistoryOutlined />} onClick={handleReset} size="large" block style={{ borderRadius: 8 }}>
                                Khôi phục bản gốc
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EditUserForm;