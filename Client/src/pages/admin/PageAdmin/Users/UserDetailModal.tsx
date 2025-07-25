import React from "react";
import { Modal, Descriptions, Tag, Tabs, Card, Badge, Empty } from "antd";
import { PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { clearSelectedUser } from "../../../../redux/features/admin/userSlice";

const { TabPane } = Tabs;

const AddressCard = ({ address }: { address: any }) => (
  <Card size="small" style={{ marginBottom: 12 }}>
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 500 }}>{address.name}</span>
        {address.isDefault && <Badge status="success" text="Mặc định" />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PhoneOutlined style={{ color: "#666" }} />
          <span>{address.phone}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <HomeOutlined style={{ color: "#666", marginTop: 2 }} />
          <span style={{ fontSize: 13, color: "#666", lineHeight: "1.4" }}>
            {address.fullAddress}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

const UserDetailModal = ({ user }: { user: any }) => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={!!user}
      title="Chi tiết người dùng"
      onCancel={() => dispatch(clearSelectedUser())}
      footer={null}
      width={800}
    >
      {user && (
        <Tabs defaultActiveKey="info">
          <TabPane tab="Thông tin cá nhân" key="info">
            <Descriptions column={1} bordered>
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
              <Descriptions.Item label="Ngày tạo">
                {new Date(user.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane
            tab={
              <Badge count={user.addresses?.length || 0} size="small">
                <span>Địa chỉ</span>
              </Badge>
            }
            key="addresses"
          >
            <div style={{ marginTop: 16 }}>
              {user.addresses && user.addresses.length > 0 ? (
                <div>
                  {user.addresses.map((address: any) => (
                    <AddressCard key={address._id} address={address} />
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Người dùng chưa có địa chỉ nào"
                />
              )}
            </div>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default UserDetailModal;
