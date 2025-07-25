import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser, fetchUserAddresses, type UserType } from "../../../../redux/features/admin/userSlice";
import { useEffect, useState } from "react";
import { 
  Descriptions, 
  Modal, 
  Spin, 
  Tag,
  Card,
  Tabs
} from "antd";
import { EnvironmentOutlined, PhoneOutlined, UserOutlined, InfoCircleOutlined } from "@ant-design/icons";

// Mock RootState cho TypeScript
interface RootState {
  userAdminSlice: UserState;
}

// Component UserDetailModal với tabs
const UserDetailModal = ({ user }: { user: UserType | null }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");
  const { userAddresses, addressLoading } = useSelector(
    (state: RootState) => state.userAdminSlice
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchUserAddresses(user._id) as any);
    }
  }, [user, dispatch]);

  const tabItems = [
    {
      key: "info",
      label: (
        <span>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          Thông tin cá nhân
        </span>
      ),
      children: user ? (
        <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="Tên" span={1}>{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email" span={1}>{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={1}>
            {user.phone || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò" span={1}>
            <Tag color={user.role === "admin" ? "volcano" : "blue"}>
              {user.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={1}>
            <Tag color={user.status === "active" ? "green" : "red"}>
              {user.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tình trạng tài khoản" span={1}>
            <Tag color={user.isDeleted ? "red" : "green"}>
              {user.isDeleted ? "Đã xóa" : "Hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={2}>
            {new Date(user.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      ) : null
    },
    {
      key: "address",
      label: (
        <span>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          Địa chỉ ({userAddresses.length})
        </span>
      ),
      children: (
        <div style={{ marginTop: 16 }}>
          {addressLoading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: '#666', fontSize: 16 }}>
                Đang tải địa chỉ...
              </div>
            </div>
          ) : userAddresses.length > 0 ? (
            <div style={{ display: 'grid', gap: 16 }}>
              {userAddresses.map((address: any, index: number) => (
                <Card
                  key={address._id || index}
                  size="small"
                  style={{
                    background: address.isDefault ? '#f6ffed' : '#fafafa',
                    border: address.isDefault ? '2px solid #52c41a' : '1px solid #e8e8e8',
                    borderRadius: 12,
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  {/* Badge mặc định */}
                  {address.isDefault && (
                    <div style={{
                      position: 'absolute',
                      top: -1,
                      right: 16,
                      background: '#52c41a',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '0 0 8px 8px',
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      Địa chỉ mặc định
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Tên và số điện thoại */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ 
                          fontSize: 16, 
                          fontWeight: 600, 
                          color: '#262626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4
                        }}>
                          <UserOutlined />
                          {address.name}
                        </div>
                        <div style={{ 
                          color: '#666', 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8 
                        }}>
                          <PhoneOutlined />
                          {address.phone}
                        </div>
                      </div>
                    </div>

                    {/* Địa chỉ đầy đủ */}
                    <div style={{
                      background: 'white',
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid #f0f0f0'
                    }}>
                      <div style={{ 
                        fontSize: 14, 
                        lineHeight: 1.6,
                        color: '#595959',
                        marginBottom: 8
                      }}>
                        <EnvironmentOutlined style={{ marginRight: 8 }} />
                        {address.fullAddress}
                      </div>
                      
                      {/* Chi tiết địa chỉ theo cấp */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 12 }}>
                        <div>
                          <span style={{ color: '#8c8c8c' }}>Tỉnh/TP:</span>
                          <div style={{ fontWeight: 500 }}>{address.provinceName}</div>
                        </div>
                        <div>
                          <span style={{ color: '#8c8c8c' }}>Quận/Huyện:</span>
                          <div style={{ fontWeight: 500 }}>{address.districtName}</div>
                        </div>
                        <div>
                          <span style={{ color: '#8c8c8c' }}>Phường/Xã:</span>
                          <div style={{ fontWeight: 500 }}>{address.wardName}</div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin thêm */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12,
                      color: '#8c8c8c',
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: 8
                    }}>
                      <span>Địa chỉ #{index + 1}</span>
                      <span>Tạo lúc: {new Date(address.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ textAlign: 'center', padding: 60, background: '#fafafa' }}>
              <EnvironmentOutlined 
                style={{ 
                  fontSize: 64, 
                  color: '#d9d9d9', 
                  marginBottom: 20,
                  display: 'block'
                }} 
              />
              <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
                Người dùng chưa có địa chỉ nào
              </div>
              <div style={{ fontSize: 14, color: '#999' }}>
                Người dùng có thể thêm địa chỉ từ ứng dụng của họ
              </div>
            </Card>
          )}
        </div>
      )
    }
  ];

  return (
    <Modal
      open={!!user}
      title="Chi tiết người dùng"
      onCancel={() => dispatch(clearSelectedUser())}
      footer={null}
      width={900}
    >
      {user && (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: '1px solid #f0f0f0'
          }}
        />
      )}
    </Modal>
  );
};

export default UserDetailModal;