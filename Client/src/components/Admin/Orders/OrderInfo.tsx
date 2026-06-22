import { Card, Typography, Row, Col, Space, Button, Divider, Tag, Avatar } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, DollarOutlined, EditOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { OrderDetailResponse, IOrder } from "../../../types/order/IOrder";
import { formatCurrency } from "../../../utils/Format";
import { getPaymentMethodLabel, getPaymentStatusLabel, getStatusLabel, paymentColor, paymentMethodColor } from "../../../utils/Status";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface OrderInfoProps {
  data: OrderDetailResponse;
  setIsModalOpen: (v: boolean) => void;
  handleStatusUpdate: (status: IOrder["status"]) => void;
}

const OrderInfo = ({ data, setIsModalOpen, handleStatusUpdate }: OrderInfoProps) => {
  const { order, user } = data;

  return (
    <Card title="Thông tin khách hàng & Thanh toán" bordered={false} style={{ height: '100%' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Thông tin người đặt</Text>
              <Space align="center" style={{ marginBottom: 12 }}>
                <Avatar size={40} icon={<UserOutlined />} src={user?.avatar} />
                <div>
                  <Text strong>{user?.username || order.receiverName}</Text>
                  {user && <Tag color="blue" style={{ marginLeft: 8, border: 0 }}>Thành viên</Tag>}
                </div>
              </Space>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text><PhoneOutlined style={{ marginRight: 8, color: '#8c8c8c' }} /> {order.phone}</Text>
                <Text><MailOutlined style={{ marginRight: 8, color: '#8c8c8c' }} /> {user?.email || "Không có"}</Text>
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Địa chỉ giao hàng</Text>
              <Text>
                <HomeOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
                {order.shippingAddress}
              </Text>
            </div>
          </Space>
        </Col>

        <Col xs={24} md={12}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Thông tin thanh toán</Text>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Phương thức:</Text><br />
                  <Tag color={paymentMethodColor[order.paymentMethod]} style={{ marginTop: 4, padding: '2px 8px', borderRadius: 12 }}>
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Trạng thái TT:</Text><br />
                  <Tag color={paymentColor[order.paymentStatus] || "default"} style={{ marginTop: 4, padding: '2px 8px', borderRadius: 12 }}>
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Ngày đặt:</Text><br />
                  <Text><CalendarOutlined style={{ marginRight: 4 }} /> {dayjs(order.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
                </Col>
                {order.paymentStatus === 'paid' && order.paidAt && (
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 13 }}>Ngày TT:</Text><br />
                    <Text><DollarOutlined style={{ marginRight: 4 }} /> {dayjs(order.paidAt).format('HH:mm DD/MM/YYYY')}</Text>
                  </Col>
                )}
              </Row>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Tạm tính:</Text>
                <Text strong>{formatCurrency(order.total)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Phí vận chuyển:</Text>
                <Text>{formatCurrency(order.shippingFee || 0)}</Text>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Giảm giá:</Text>
                  <Text type="danger">-{formatCurrency(order.discount)}</Text>
                </div>
              )}
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 18, color: '#f5222d' }}>{formatCurrency(order.finalAmount)}</Text>
              </div>
            </div>

            {order.status !== "cancelled" && order.status !== "delivered" && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Cập nhật trạng thái</Text>
                <Space wrap>
                  {order.status === "pending" && (
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleStatusUpdate("processing")}>
                      Xác nhận đơn
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button type="primary" style={{ background: '#52c41a' }} onClick={() => handleStatusUpdate("shipped")}>
                      Giao cho ĐVVC
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button type="primary" style={{ background: '#1890ff' }} onClick={() => handleStatusUpdate("delivered")}>
                      Xác nhận đã giao
                    </Button>
                  )}
                  <Button danger icon={<CloseCircleOutlined />} onClick={() => setIsModalOpen(true)}>
                    Hủy đơn hàng
                  </Button>
                </Space>
              </div>
            )}
            
            {order.status === 'cancelled' && order.cancellationReason && (
              <div style={{ marginTop: 16, padding: 12, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8 }}>
                <Text type="danger" strong>Lý do hủy:</Text>
                <p style={{ margin: '4px 0 0', color: '#cf1322' }}>{order.cancellationReason}</p>
              </div>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderInfo;
