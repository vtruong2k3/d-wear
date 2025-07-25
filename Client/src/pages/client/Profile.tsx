import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Select,
  message,
  Avatar,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CameraOutlined,
  SaveOutlined,
} from "@ant-design/icons";

// Xoá Text vì không dùng
const { Title } = Typography;

interface ProfileFormValues {
  username: string;
  email: string;
  phone: string;
  role: string;
}

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      // TODO: Gọi API thực tế ở đây
      console.log("Dữ liệu cập nhật:", values);
      message.success("Cập nhật thông tin thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <div className="flex flex-col items-center mb-6">
        <Avatar size={100} icon={<UserOutlined />} className="mb-4" />
        <Upload showUploadList={false}>
          <Button icon={<CameraOutlined />}>Thay ảnh đại diện</Button>
        </Upload>
      </div>

      <Title level={3} className="text-center mb-6">
        Thông tin tài khoản
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        initialValues={{
          username: "truongvtiu",
          email: "email@example.com",
          phone: "0912345678",
          role: "user",
        }}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Tên đăng nhập"
            className="h-10"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            className="h-10"
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Số điện thoại"
            className="h-10"
          />
        </Form.Item>

        <Form.Item label="Vai trò" name="role">
          <Select
            placeholder="Chọn vai trò"
            className="h-10"
            options={[
              { value: "user", label: "Người dùng" },
              { value: "admin", label: "Quản trị viên" },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            className="w-full h-10"
          >
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
