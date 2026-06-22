import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser } from "../../../../redux/features/admin/userSlice";
import { useState } from "react";
import { Descriptions, Modal, Spin, Tag, Card, Tabs, Avatar, Typography, Row, Col, Space } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  InfoCircleOutlined,
  MailOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";

import type { RootState } from "../../../../redux/store";
import type { IAddress } from "../../../../types/address/IAddress";

const { Title, Text } = Typography;

const UserDetailModal = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");

  const {
    selectedUser: user,
    userAddresses,
    addressLoading,
  } = useSelector((state: RootState) => state.userAdminSlice);

  const getAvatarUrl = (path: string | undefined) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  const tabItems = [
    {
      key: "info",
      label: (
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          <InfoCircleOutlined /> Tổng quan
        </span>
      ),
      children: user ? (
        <div style={{ padding: '8px 0' }}>
          <Descriptions
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            bordered
            size="middle"
            labelStyle={{ background: '#fafafa', fontWeight: 500, width: '140px' }}
            contentStyle={{ background: '#fff' }}
          >
            <Descriptions.Item label={<><UserOutlined /> Họ và tên</>}>
              <Text strong>{user.username}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label={<><PhoneOutlined /> Điện thoại</>}>
              {user.phone || <Text type="secondary">Chưa cập nhật</Text>}
            </Descriptions.Item>
            <Descriptions.Item label={<><SafetyCertificateOutlined /> Phân quyền</>}>
              <Tag color={user?.role === "admin" ? "volcano" : "blue"} style={{ margin: 0, borderRadius: 12, padding: '2px 12px' }}>
                {user?.role?.toUpperCase() || 'USER'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<><CalendarOutlined /> Ngày tham gia</>}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                day: '2-digit', month: '2-digit', year: 'numeric'
              }) : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {user.isActive ? (
                <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: 12 }}>Đang hoạt động</Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: 12 }}>Đã bị khóa</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : null,
    },
    {
      key: "address",
      label: (
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          <EnvironmentOutlined /> Sổ địa chỉ ({userAddresses?.length || 0})
        </span>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          {addressLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: "#8c8c8c" }}>Đang tải địa chỉ...</div>
            </div>
          ) : userAddresses?.length > 0 ? (
            <Row gutter={[16, 16]}>
              {[...(userAddresses || [])]
                .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
                .map((address: IAddress, index: number) => (
                  <Col xs={24} md={12} key={address._id || index}>
                    <Card
                      hoverable
                      style={{
                        height: '100%',
                        borderRadius: 12,
                        border: address.isDefault ? "2px solid #52c41a" : "1px solid #f0f0f0",
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                      }}
                      bodyStyle={{ padding: 20 }}
                    >
                      {address.isDefault && (
                        <div style={{
                          position: "absolute",
                          top: 0, right: 0,
                          background: "#52c41a",
                          color: "white",
                          padding: "4px 16px",
                          borderRadius: "0 0 0 12px",
                          fontSize: 12,
                          fontWeight: 'bold',
                          boxShadow: '-2px 2px 5px rgba(0,0,0,0.1)'
                        }}>
                          MẶC ĐỊNH
                        </div>
                      )}
                      
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ paddingRight: address.isDefault ? 80 : 0 }}>
                          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
                            {address.name}
                          </Text>
                          <Text type="secondary">
                            <PhoneOutlined style={{ marginRight: 6 }} />
                            {address.phone}
                          </Text>
                        </div>
                        
                        <div style={{
                          background: "#f8f9fa",
                          padding: 12,
                          borderRadius: 8,
                          marginTop: 8
                        }}>
                          <Text style={{ display: 'block', marginBottom: 8, color: '#434343' }}>
                            <EnvironmentOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                            {address.fullAddress}
                          </Text>
                          <Row gutter={[8, 8]}>
                            <Col span={8}>
                              <Text type="secondary" style={{ fontSize: 11 }}>Tỉnh/TP</Text>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{address.provinceName}</div>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary" style={{ fontSize: 11 }}>Quận/Huyện</Text>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{address.districtName}</div>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary" style={{ fontSize: 11 }}>Phường/Xã</Text>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{address.wardName}</div>
                            </Col>
                          </Row>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
            </Row>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ background: '#f5f5f5', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <EnvironmentOutlined style={{ fontSize: 32, color: "#bfbfbf" }} />
              </div>
              <Title level={5} style={{ color: '#595959', margin: 0 }}>Chưa có địa chỉ</Title>
              <Text type="secondary">Người dùng này chưa lưu địa chỉ giao hàng nào.</Text>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={!!user}
      onCancel={() => dispatch(clearSelectedUser())}
      footer={null}
      width={800}
      styles={{
        body: { padding: 0 },
        content: { overflow: 'hidden', borderRadius: 16 }
      }}
      closeIcon={
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          backdropFilter: 'blur(4px)',
          borderRadius: '50%',
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white'
        }}>
          <CloseCircleOutlined style={{ fontSize: 20 }} />
        </div>
      }
    >
      {user && (
        <>
          {/* Header Cover & Avatar */}
          <div style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            padding: '40px 24px 24px',
            position: 'relative',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              <div style={{
                padding: 4,
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <Avatar
                  size={100}
                  src={getAvatarUrl(user.avatar)}
                  icon={<UserOutlined />}
                  style={{ border: '2px solid #f0f0f0' }}
                />
              </div>
              <div style={{ paddingBottom: 8 }}>
                <Title level={3} style={{ color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  {user.username}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag color={user.role === 'admin' ? 'magenta' : 'blue'} style={{ border: 0, fontWeight: 600 }}>
                    {user.role.toUpperCase()}
                  </Tag>
                  {user.isGoogleAccount && (
                    <Tag color="white" style={{ color: '#1890ff', border: 0, fontWeight: 500 }}>
                      Google Account
                    </Tag>
                  )}
                </Space>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div style={{ padding: '0 24px 24px' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
              tabBarStyle={{ marginBottom: 24, paddingTop: 8 }}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default UserDetailModal;
