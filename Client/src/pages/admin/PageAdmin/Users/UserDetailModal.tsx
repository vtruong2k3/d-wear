import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser, fetchUserAddresses, type UserType } from "../../../../redux/features/admin/userSlice";
import { useEffect } from "react";
import { Collapse, Descriptions, List, Modal, Space, Spin, Tag } from "antd";
import Panel from "antd/es/splitter/Panel";

// Mock RootState cho TypeScript
interface RootState {
  userAdminSlice: UserState;
}

// Component UserDetailModal với địa chỉ
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

          {/* Danh sách địa chỉ */}
          <Collapse defaultActiveKey={['1']}>
            <Panel 
              header={`Danh sách địa chỉ (${userAddresses.length})`} 
              key="1"
            >
              {addressLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Spin />
                </div>
              ) : userAddresses.length > 0 ? (
                <List
                  dataSource={userAddresses}
                  renderItem={(address:any) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <strong>{address.name}</strong>
                          {address.isDefault && <Tag color="green">Mặc định</Tag>}
                        </div>
                        <div style={{ color: '#666', marginBottom: 4 }}>
                          📞 {address.phone}
                        </div>
                        <div style={{ color: '#666' }}>
                          📍 {address.fullAddress}
                        </div>
                        <div style={{ color: '#ccc', fontSize: '12px', marginTop: 4 }}>
                          Tạo lúc: {new Date(address.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                  Người dùng chưa có địa chỉ nào
                </div>
              )}
            </Panel>
          </Collapse>
        </Space>
      )}
    </Modal>
  );
};
export default UserDetailModal;