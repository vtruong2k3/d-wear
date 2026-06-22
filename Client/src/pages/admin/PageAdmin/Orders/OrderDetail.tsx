import { Card, Typography, Row, Col, Button, Modal, Input, Divider, Space, Tag } from "antd";
import { ArrowLeftOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useOrderDetail } from "../../../../hooks/admin/useOrderDetail";
import OrderStatusTimeline from "../../../../components/Admin/Orders/OrderStatusTimeline";
import OrderInfo from "../../../../components/Admin/Orders/OrderInfo";
import OrderItemsTable from "../../../../components/Admin/Orders/OrderItemsTable";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { setLoading } = useLoading();
  const { id } = useParams();

  const {
    data,
    isModalOpen, setIsModalOpen,
    selectedReason, setSelectedReason,
    cancelReason, setCancelReason,
    handleCancelOrder,
    handleStatusUpdate
  } = useOrderDetail(id, setLoading);

  const cancelReasons = [
    "Sản phẩm hết hàng",
    "Thông tin giao hàng không chính xác",
    "Khách hàng không phản hồi xác nhận đơn",
    "Nghi ngờ gian lận hoặc đặt hàng giả",
    "Lỗi hệ thống khi xử lý đơn hàng",
    "Lý do khác",
  ];

  if (!data || !data.order || !data.orderItems) {
    return (
      <div style={{ padding: 24 }}>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
          <Title level={4} type="danger">Không tìm thấy đơn hàng</Title>
          <Link to="/admin/orders">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Quay lại danh sách đơn hàng
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { order, orderItems } = data;

  return (
    <div style={{ padding: 24, minHeight: '100vh' }} className="bg-gray-50">
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <Link to="/admin/orders">
              <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
                Quay lại
              </Button>
            </Link>
            <Title level={3} style={{ margin: 0, display: 'inline-block' }}>
              Chi tiết đơn hàng
            </Title>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text type="secondary">Mã đơn hàng</Text>
            <br />
            <Text strong style={{ fontSize: 18, color: '#1890ff' }}>#{order.order_code}</Text>
          </div>
        </div>

        <OrderStatusTimeline status={order.status} />
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Danh sách sản phẩm" bordered={false} style={{ marginBottom: 24 }}>
            <OrderItemsTable orderItems={orderItems} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <OrderInfo data={data} setIsModalOpen={setIsModalOpen} handleStatusUpdate={handleStatusUpdate} />
        </Col>
      </Row>

      <Modal
        title="Hủy đơn hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCancelOrder}
        okText="Xác nhận hủy"
        cancelText="Bỏ qua"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Lý do hủy:</Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {cancelReasons.map((reason) => (
              <Tag.CheckableTag
                key={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "4px 12px",
                  fontSize: 14,
                }}
              >
                {reason}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>

        {selectedReason === "Lý do khác" && (
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do hủy đơn hàng của bạn..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        )}
      </Modal>
    </div>
  );
};

export default OrderDetail;