import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  message,
  Descriptions,
  Badge,
  Row,
  Col,

  Space,
  Typography,
  Tag
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CameraOutlined,
  GoogleOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0123456789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isGoogleAccount: false,
    role: 'user',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userData);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Only update allowed fields: username, phone, avatar
      const allowedUpdates = {
        username: values.username,
        phone: values.phone,
        avatar: userData.avatar // Keep current avatar (can be updated via upload)
      };

      // Simulate API call
      setTimeout(() => {
        setUserData({ ...userData, ...allowedUpdates });
        setIsEditing(false);
        setLoading(false);
        message.success('Cập nhật thông tin thành công!');
      }, 1000);
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Simulate successful upload - in real app, get URL from response
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUserData(prev => ({
          ...prev,
          avatar: reader.result
        }));
        setLoading(false);
        message.success('Cập nhật avatar thành công!');
      });
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error('Tải ảnh thất bại!');
    }
  };

  const uploadProps = {
    name: 'avatar',
    action: '/api/upload',
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Chỉ có thể tải lên file JPG/PNG!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return false;
      }
      return false; // Prevent auto upload, handle manually
    },
    onChange: handleAvatarChange,
    customRequest: ({ file, onSuccess }) => {
      // Simulate upload success immediately for demo
      setTimeout(() => {
        onSuccess("ok");
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Card */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6 text-white">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r  rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative">
                <Avatar
                  size={120}
                  src={userData.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white/30"
                />
                {isEditing && (
                  <Upload {...uploadProps}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 border-0"
                      size="small"
                    />
                  </Upload>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <Title level={2} className="text-white mb-2">
                {userData.username}
              </Title>
              <Space direction="vertical" size="small">
                <Text className="text-blue-100 flex items-center gap-2">
                  <MailOutlined /> {userData.email}
                </Text>

                <Space>
                  <Badge
                    status={userData.isActive ? "success" : "error"}
                    text={userData.isActive ? "Hoạt động" : "Không hoạt động"}
                    className="text-blue-100"
                  />
                  {userData.isGoogleAccount && (
                    <Tag icon={<GoogleOutlined />} color="blue">
                      Google Account
                    </Tag>
                  )}
                  <Tag color={userData.role === 'admin' ? 'gold' : 'green'}>
                    {userData.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </Tag>
                </Space>
              </Space>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size="large"
                  className="!bg-black !text-white !border-0 hover:!opacity-80 transition"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={loading}
                    className="!bg-black !text-white border-0 hover:opacity-80 transition"
                  >
                    Lưu
                  </Button>
                  <Button
                    type="primary"
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    className="!bg-white !text-black border-black hover:opacity-80"
                  >
                    Hủy
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Profile Information */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <UserOutlined className="text-indigo-600" />
                  <span>Thông tin cá nhân</span>
                </Space>
              }
              className="shadow-lg border-0 bg-white/80 backdrop-blur-sm"
            >
              {!isEditing ? (
                <Descriptions column={1} size="large">
                  <Descriptions.Item label="Tên người dùng">
                    <Text strong>{userData.username}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text copyable>{userData.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Text>{userData.phone}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại tài khoản">
                    {userData.isGoogleAccount ? (
                      <Tag icon={<GoogleOutlined />} color="blue">
                        Tài khoản Google
                      </Tag>
                    ) : (
                      <Tag color="default">Tài khoản thường</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    <Tag color={userData.role === 'admin' ? 'gold' : 'green'}>
                      {userData.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={userData.isActive ? "success" : "error"}
                      text={userData.isActive ? "Đang hoạt động" : "Không hoạt động"}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tham gia">
                    {new Date(userData.createdAt).toLocaleDateString('vi-VN')}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={userData}
                  className="space-y-4"
                >
                  <Form.Item
                    name="username"
                    label="Tên người dùng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nhập tên người dùng"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                  >
                    <Input
                      prefix={<MailOutlined />}
                      value={userData.email}
                      size="large"
                      disabled
                      className="bg-gray-50"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                      { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item name="role" label="Vai trò">
                    <Select size="large" disabled className="bg-gray-50">
                      <Option value="user">Người dùng</Option>
                      <Option value="admin">Quản trị viên</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="isActive" label="Trạng thái hoạt động">
                    <Switch
                      checked={userData.isActive}
                      checkedChildren="Hoạt động"
                      unCheckedChildren="Tạm khóa"
                      disabled
                    />
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" className="w-full">
              <Card
                title="Thao tác nhanh"
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm"
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <Button
                    type="primary"
                    icon={<ShoppingOutlined />}
                    block
                    size="large"
                    className="bg-indigo-600 hover:bg-indigo-700 border-0"
                  >
                    Lịch sử đơn hàng
                  </Button>
                  <Button
                    type="default"
                    icon={<HeartOutlined />}
                    block
                    size="large"
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    Sản phẩm yêu thích
                  </Button>
                  <Button
                    type="default"
                    icon={<EnvironmentOutlined />}
                    block
                    size="large"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Địa chỉ
                  </Button>
                </Space>
              </Card>

              <Card
                title="Thống kê"
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg text-white">
                      <Title level={3} className="text-white mb-0">12</Title>
                      <Text className="text-blue-100">Đơn hàng</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-center p-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg text-white">
                      <Title level={3} className="text-white mb-0">8</Title>
                      <Text className="text-pink-100">Yêu thích</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserProfile;