import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  Card,

  Image,
  Typography,
  Row,
  Col,
  Button,

  Modal,
  Tag,
  message,
  Steps,
  Divider,
  Space,
  Avatar,

  Badge,
  Input,

} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  GiftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import type { ErrorType } from "../../../../types/error/IError";
import { cancelOrderAdmin, fetchGetOrderDetail, updateOrderStatus } from "../../../../services/admin/orderService";
import type { OrderDetailResponse, IOrder, OrderItem } from "../../../../types/order/IOrder";
import { useLoading } from "../../../../contexts/LoadingContext";
import { formatCurrency } from "../../../../utils/Format";

import socket from "../../../../sockets/socket";
import { getPaymentMethodLabel, getPaymentStatusLabel, getStatusLabel, paymentColor, paymentMethodColor } from "../../../../utils/Status";


const { Title, Text } = Typography;

const OrderDetail = () => {
  const { setLoading } = useLoading();
  const { id } = useParams();
  const [data, setData] = useState<OrderDetailResponse | null>(null);
  const cancelReasons = [
    "Sản phẩm hết hàng",
    "Thông tin giao hàng không chính xác",
    "Khách hàng không phản hồi xác nhận đơn",
    "Nghi ngờ gian lận hoặc đặt hàng giả",
    "Lỗi hệ thống khi xử lý đơn hàng",
    "Lý do khác",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");
  const handleCancelOrder = async () => {
    const reasonToSend =
      selectedReason === "Lý do khác" ? cancelReason.trim() : selectedReason;

    if (!reasonToSend) {
      message.error("Vui lòng chọn hoặc nhập lý do hủy đơn hàng");
      return;
    }

    try {
      setLoading(true);
      const reason = reasonToSend;

      const res = await cancelOrderAdmin(id, reason);

      message.success(res.message);

      setData((prev) =>
        prev ? { ...prev, order: { ...prev.order, status: "cancelled" } } : prev
      );

      setIsModalOpen(false);
      setSelectedReason("");
      setCancelReason("");
    } catch (error) {

      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);


    } finally {
      setLoading(false);
    }
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchGetOrderDetail(id);
      setData(res);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // const validTransitions: Record<IOrder["status"], IOrder["status"][]> = {
  //   pending: ["processing", "cancelled"],
  //   processing: ["shipped", "cancelled"],
  //   shipped: ["delivered"],
  //   delivered: [],
  //   cancelled: [],
  // };

  // const handleStatusChange = async (newStatus: IOrder["status"]) => {
  //   if (!order?._id) return;

  //   const currentStatus = order.status;
  //   const allowedStatuses = validTransitions[currentStatus];
  //   if (!allowedStatuses.includes(newStatus)) {
  //     message.error(
  //       `Không thể chuyển trạng thái từ "${getStatusLabel(currentStatus)}" sang "${getStatusLabel(newStatus)}"`
  //     );
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await updateOrderStatus(order._id, newStatus);
  //     setData((prev) =>
  //       prev
  //         ? {
  //           ...prev,
  //           order: {
  //             ...prev.order,
  //             status: newStatus,
  //           },
  //         }
  //         : prev
  //     );
  //     if (newStatus === "delivered") {
  //       fetchData();
  //     }
  //     message.success(`Đã cập nhật trạng thái đơn hàng thành "${getStatusLabel(newStatus)}"`);
  //   } catch (error) {
  //     const errorMessage =
  //       (error as ErrorType).response?.data?.message ||
  //       (error as ErrorType).message ||
  //       "Đã xảy ra lỗi, vui lòng thử lại.";
  //     message.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!id) return;

    socket.emit('joinRoom', id);

    socket.on('cancelOrder', (data) => {
      if (data?.orderId === id) {
        setData((prev) => prev ? {
          ...prev,
          order: { ...prev.order, status: data.status, cancellationReason: data.cancellationReason }
        } : prev);
        message.success(`Đơn hàng đã bị hủy vì lý do: ${data.cancellationReason || "Không có lý do"}`);
      }
    });

    socket.on('orderPaid', (data) => {
      if (data?.orderId === id) {
        setData((prev) => prev ? {
          ...prev,
          order: {
            ...prev.order,
            paymentStatus: data.paymentStatus,
          }
        } : prev);
        message.info(`Đơn hàng đã được thanh toán thành công.`);
      }
    });

    return () => {
      socket.emit('leaveRoom', id);
      socket.off('cancelOrder');
      socket.off('orderPaid');
    };
  }, [id]);

  const handleStatusUpdate = (newStatus: IOrder["status"]) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái",
      content: `Bạn có chắc muốn chuyển đơn sang trạng thái "${getStatusLabel(newStatus)}"?`,
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          setLoading(true);
          if (!order?._id) return;

          await updateOrderStatus(order._id, newStatus);

          setData((prev) =>
            prev
              ? {
                ...prev,
                order: {
                  ...prev.order,
                  status: newStatus,
                },
              }
              : prev
          );

          message.success(`Đã cập nhật trạng thái đơn hàng thành "${getStatusLabel(newStatus)}"`);
        } catch (error) {
          const errorMessage =
            (error as ErrorType).response?.data?.message ||
            (error as ErrorType).message ||
            "Đã xảy ra lỗi, vui lòng thử lại.";
          message.error(errorMessage);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getStatusStep = (status: IOrder["status"]) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    return steps.indexOf(status);
  };

  const getStatusColor = (status: IOrder["status"]) => {
    const colors = {
      pending: "#faad14",
      processing: "#1890ff",
      shipped: "#52c41a",
      delivered: "#389e0d",
      cancelled: "#ff4d4f",
    };
    return colors[status];
  };

  const getStatusIcon = (status: IOrder["status"]) => {
    const icons = {
      pending: <ClockCircleOutlined />,
      processing: <EditOutlined />,
      shipped: <TruckOutlined />,
      delivered: <CheckCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
    };
    return icons[status];
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product_image"],
      key: "product",
      width: 200,
      render: (item: string, record: OrderItem) => {
        const imageUrl = item
          ? item.startsWith("http")
            ? item
            : `http://localhost:5000/${item.replace(/^\/?/, "").replace(/\\/g, "/")}`
          : "/default.png";

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src={imageUrl}
              alt="product"
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 8, border: '1px solid #f0f0f0' }}
              fallback="/default.png"
              preview={false}
            />
            <div>
              <Text strong style={{ fontSize: 14 }}>{record.product_name}</Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="blue" style={{ fontSize: 12, padding: '0 6px', height: 22, lineHeight: '20px' }}>
                  {record.size}
                </Tag>
                <Tag color="purple" style={{ fontSize: 12, padding: '0 6px', height: 22, lineHeight: '20px' }}>
                  {record.color}
                </Tag>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: 'center' as const,
      render: (quantity: number) => (
        <Badge count={quantity} style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: 'right' as const,
      render: (price: number) => (
        <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 120,
      align: 'right' as const,
      render: (record: OrderItem) => (
        <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
          {formatCurrency(record.price * record.quantity)}
        </Text>
      ),
    },
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

  const { order, orderItems, user } = data;

  return (
    <div style={{ padding: 24, minHeight: '100vh' }} className="bg-gray-50">
      {/* Header */}
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

        {/* Order Status Progress */}
        {order.status !== 'cancelled' ? (
          <Steps
            current={getStatusStep(order.status)}
            status={order.status === 'delivered' ? 'finish' : 'process'}
            items={[
              {
                title: 'Chờ xử lý',
                icon: <ClockCircleOutlined />,
              },
              {
                title: 'Đang xử lý',
                icon: <EditOutlined />,
              },
              {
                title: 'Đang giao hàng',
                icon: <TruckOutlined />,
              },
              {
                title: 'Đã giao',
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f', marginRight: 8 }} />
            <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>Đơn hàng đã bị hủy</Text>
            {order.cancellationReason && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Lý do: {order.cancellationReason}</Text>
              </div>
            )}
          </div>
        )}
      </Card>

      <Row gutter={24}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Order Items */}
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Sản phẩm đã đặt ({orderItems.length} sản phẩm)</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Table
              dataSource={orderItems}
              columns={columns}
              rowKey="_id"
              pagination={false}
              style={{ border: '1px solid #f0f0f0', borderRadius: 8 }}
            />
          </Card>

          {/* Customer Information */}
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title={
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <span>Người đặt hàng</span>
                  </Space>
                }
                size="small"
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text strong>{user.username}</Text>
                  </div>
                  <div>
                    <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Text>{user.phone}</Text>
                  </div>
                  <div>
                    <MailOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                    <Text>{user.email}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <Space>
                    <HomeOutlined />
                    <span>Thông tin giao hàng</span>
                  </Space>
                }
                size="small"
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text strong>{order.receiverName}</Text>
                  </div>
                  <div>
                    <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Text>{order.phone}</Text>
                  </div>
                  <div>
                    <MailOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                    <Text>{order.email}</Text>
                  </div>
                  <div>
                    <HomeOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                    <Text>{order.shippingAddress}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Order Summary */}
          <Card
            title={
              <Space>
                <DollarOutlined />
                <span>Thông tin đơn hàng</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Ngày đặt:</Text>
                <Text strong>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Trạng thái:</Text>
                <Tag
                  icon={getStatusIcon(order.status)}
                  color={getStatusColor(order.status)}
                  style={{ fontSize: 12, padding: '4px 8px' }}
                >
                  {getStatusLabel(order.status)}
                </Tag>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Thanh toán:</Text>
                <Tag color={paymentMethodColor[order.paymentMethod]}>
                  {getPaymentMethodLabel(order.paymentMethod)}
                </Tag>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Trang Thái Thanh toán:</Text>
                <Tag color={paymentColor[order.paymentStatus]}>
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Tag>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tổng tiền hàng:</Text>
                <Text strong>{formatCurrency(order.total)}</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Giảm giá:</Text>
                <Text style={{ color: '#52c41a' }}>-{formatCurrency(order.discount)}</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Phí vận chuyển:</Text>
                <Text>{order.shippingFee ? formatCurrency(order.shippingFee) : "Miễn phí"}</Text>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', background: '#f6ffed', margin: '0 -16px', paddingLeft: 16, paddingRight: 16, borderRadius: 6 }}>
                <Text strong style={{ fontSize: 16 }}>Thành tiền:</Text>
                <Text strong style={{ fontSize: 18, color: '#52c41a' }}>{formatCurrency(order.finalAmount)}</Text>
              </div>
            </Space>
          </Card>

          {/* Status Update Actions */}
          <Card
            title={
              <Space>
                <EditOutlined />
                <span>Cập nhật trạng thái</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                block
                onClick={() => handleStatusUpdate("processing")}
                disabled={["processing", "shipped", "delivered", "cancelled"].includes(order.status)}
                style={{ background: '#fa8c16', borderColor: '#fa8c16', color: "white" }}
              >
                Xác nhận đơn hàng
              </Button>

              <Button
                type="primary"
                icon={<TruckOutlined />}
                block
                onClick={() => handleStatusUpdate("shipped")}
                disabled={["shipped", "delivered", "cancelled"].includes(order.status)}
                style={{ background: '#1890ff', borderColor: '#1890ff', color: "white" }}
              >
                Bắt đầu giao hàng
              </Button>

              <Button
                type="primary"
                icon={<GiftOutlined />}
                block
                onClick={() => handleStatusUpdate("delivered")}
                disabled={order.status !== "shipped"}
                style={{ background: '#389e0d', borderColor: '#389e0d', color: "white" }}
              >
                Đã giao thành công
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                block
                onClick={() => setIsModalOpen(true)}
                disabled={["shipped", "delivered", "cancelled"].includes(order.status)}
              >
                Hủy đơn hàng
              </Button>
              <Modal
                title="Xác nhận hủy đơn hàng"
                open={isModalOpen}
                onOk={handleCancelOrder}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedReason("");
                  setCancelReason("");
                }}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <p>Bạn có chắc chắn muốn hủy đơn hàng?</p>

                <div className="space-y-2 mt-4">
                  {cancelReasons.map((reason, index) => (
                    <div key={index}>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={(e) =>
                            setSelectedReason(e.target.value)
                          }
                          className="mr-2"
                        />
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>

                {selectedReason === "Lý do khác" && (
                  <Input.TextArea
                    rows={4}
                    className="mt-3"
                    placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                )}
              </Modal>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail;