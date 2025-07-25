import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser, fetchUserAddresses, type UserType } from "../../../../redux/features/admin/userSlice";
import { useEffect } from "react";
import { 
  Descriptions, 
  Modal, 
  Space, 
  Spin, 
  Tag
} from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

// Mock RootState cho TypeScript
interface RootState {
  userAdminSlice: UserState;
}

// Component UserDetailModal với danh sách địa chỉ
const UserDetailModal = ({ user }: { user: UserType | null }) => {
  const dispatch = useDispatch();
  const { userAddresses, addressLoading } = useSelector(
    (state: RootState) => state.userAdminSlice
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchUserAddresses(user._id) as any);
    }
  }, [user, dispatch]);

  return (
    <Modal
      open={!!user}
      title="Chi tiết người dùng"
      onCancel={() => dispatch(clearSelectedUser())}
      footer={null}
      width={800}
    >
      {user && (
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Thông tin cơ bản */}
          <Descriptions column={1} bordered title="Thông tin cơ bản">
            <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {user.phone || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={user.role === "admin" ? "volcano" : "blue"}>
                {user.role}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={user.status === "active" ? "green" : "red"}>
                {user.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tình trạng tài khoản">
              <Tag color={user.isDeleted ? "red" : "green"}>
                {user.isDeleted ? "Đã xóa" : "Hoạt động"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(user.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>

          {/* Địa chỉ của người dùng */}
          <Descriptions column={1} bordered title={
            <span>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              Địa chỉ
            </span>
          }>
            {addressLoading ? (
              <Descriptions.Item label="Đang tải...">
                <Spin size="small" />
              </Descriptions.Item>
            ) : userAddresses.length > 0 ? (
              <>
                <Descriptions.Item label="Tên người nhận">
                  {userAddresses[0].name}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {userAddresses[0].phone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ đầy đủ">
                  {userAddresses[0].fullAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ chi tiết">
                  {userAddresses[0].detailAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Tỉnh/Thành phố">
                  {userAddresses[0].provinceName}
                </Descriptions.Item>
                <Descriptions.Item label="Quận/Huyện">
                  {userAddresses[0].districtName}
                </Descriptions.Item>
                <Descriptions.Item label="Phường/Xã">
                  {userAddresses[0].wardName}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(userAddresses[0].createdAt).toLocaleString("vi-VN")}
                </Descriptions.Item>
              </>
            ) : (
              <Descriptions.Item label="Trạng thái">
                <Tag color="orange">Chưa có địa chỉ</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Space>
      )}
    </Modal>
  );
};

export default UserDetailModal