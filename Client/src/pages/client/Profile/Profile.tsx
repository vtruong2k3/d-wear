import { useEffect, useMemo, useState } from 'react';
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

  EnvironmentOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { fetchUserProfile } from '../../../redux/features/client/thunks/authUserThunk';
import type { ErrorType } from '../../../types/error/IError';
import toast from 'react-hot-toast';
import type { User } from '../../../types/auth/IAuth';
import { fetchUpdateUserProfile } from '../../../services/client/userApi';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.authAdminSlice.user)

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<User | null>(user);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);


  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(user);
    setUserData(user);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("phone", values.phone);



      if (userData?.avatar && typeof userData.avatar !== "string" && userData.avatar instanceof File) {
        formData.append("avatar", userData.avatar);
      }





      const result = await fetchUpdateUserProfile(formData);
      dispatch(fetchUserProfile());
      toast.success(result.message || 'Cập nhật thành công!');
      setUserData(result.user);
      setIsEditing(false);
    } catch (error) {
      const err = error as ErrorType;
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi cập nhật';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };


  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        message.error('Chỉ hỗ trợ tệp ảnh');
        return Upload.LIST_IGNORE;
      }
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB');
        return Upload.LIST_IGNORE;
      }

      // Lưu file vào state
      setUserData((prev) => ({ ...prev!, avatar: file }));
      return false; // Ngăn AntD upload tự động
    }
  };




  const avatarSrc = useMemo(() => {
    const avatar = userData?.avatar;

    if (!avatar) return undefined;

    if (avatar instanceof File) {
      return URL.createObjectURL(avatar);
    }

    if (typeof avatar === 'string') {
      if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
        return avatar;
      }

      const normalizedPath = avatar.startsWith("/")
        ? avatar
        : `/${avatar}`;
      return `http://localhost:5000${normalizedPath.replace(/\\/g, "/")}`;
    }

    return undefined;
  }, [userData?.avatar]);




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
                  src={avatarSrc}
                  className="mr-3 ring-2 ring-white shadow-xl transition-all duration-300 group-hover:ring-blue-400"
                >
                  {!avatarSrc && (userData?.username?.charAt(0)?.toUpperCase() || '?')}
                </Avatar>


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
                {user?.username}
              </Title>
              <Space direction="vertical" size="small">
                <Text className="text-blue-100 flex items-center gap-2">
                  <MailOutlined /> {user?.email}
                </Text>

                <Space>
                  <Badge
                    status={user?.isActive ? "success" : "error"}
                    text={user?.isActive ? "Hoạt động" : "Không hoạt động"}
                    className="text-blue-100"
                  />
                  {user?.isGoogleAccount && (
                    <Tag icon={<GoogleOutlined />} color="blue">
                      Google Account
                    </Tag>
                  )}
                  <Tag color={user?.role === 'admin' ? 'gold' : 'green'}>
                    {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
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
                <Descriptions column={1} size="default">
                  <Descriptions.Item label="Tên người dùng">
                    <Text strong>{user?.username}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text copyable>{user?.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Text>{user?.phone || "N/A"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại tài khoản">
                    {user?.isGoogleAccount ? (
                      <Tag icon={<GoogleOutlined />} color="blue">
                        Tài khoản Google
                      </Tag>
                    ) : (
                      <Tag color="default">Tài khoản thường</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    <Tag color={user?.role === 'admin' ? 'gold' : 'green'}>
                      {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={user?.isActive ? "success" : "error"}
                      text={user?.isActive ? "Đang hoạt động" : "Không hoạt động"}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tham gia">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : "Chưa cập nhật"}

                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={userData ?? undefined}
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
                      value={user?.email}
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
                      checked={user?.isActive}
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
                  <Link to={'/orders'}>
                    <Button
                      type="primary"
                      icon={<ShoppingOutlined />}

                      block
                      size="large"
                      className="bg-indigo-600 hover:bg-indigo-700 border-0"
                    >
                      Lịch sử đơn hàng
                    </Button>
                  </Link>
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