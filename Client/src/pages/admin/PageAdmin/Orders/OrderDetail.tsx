import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  Card,
  Descriptions,
  Image,
  Typography,
  Row,
  Col,
  Button,
  Select,
  Modal,
  Tag,
  message,
} from "antd";

import type { ErrorType } from "../../../../types/error/IError";
import { fetchGetOrderDetail, updateOrderStatus } from "../../../../services/admin/orderService";
import type { OrderDetailResponse, IOrder } from "../../../../types/order/IOrder";
import { useLoading } from "../../../../contexts/LoadingContext";
import { formatCurrency } from "../../../../utils/Format";
import { Option } from "antd/es/mentions";
import socket from "../../../../sockets/socket";
import { getPaymentMethodLabel, getPaymentStatusLabel, getStatusLabel, paymentColor, paymentMethodColor } from "../../../../utils/Status";


const { Title } = Typography;

const OrderDetail = () => {
  const { setLoading } = useLoading()
  const { id } = useParams();
  const [data, setData] = useState<OrderDetailResponse | null>(null);

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


  const validTransitions: Record<IOrder["status"], IOrder["status"][]> = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };
  const handleStatusChange = async (newStatus: IOrder["status"]) => {
    if (!order?._id) return;

    const currentStatus = order.status;

    //  Validate trạng thái
    const allowedStatuses = validTransitions[currentStatus];
    if (!allowedStatuses.includes(newStatus)) {
      message.error(
        `Không thể chuyển trạng thái từ "${getStatusLabel(currentStatus)}" sang "${getStatusLabel(newStatus)}"`
      );
      return;
    }

    try {
      setLoading(true);

      // Gọi API cập nhật trạng thái đơn hàng
      await updateOrderStatus(order._id, newStatus);

      // Cập nhật lại state
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
      if (newStatus === "delivered") {
        fetchData()
      }
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
  };

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
        message.info(` Đơn hàng đã được thanh toán thành công.`);
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

          // Gọi API cập nhật trạng thái
          await updateOrderStatus(order._id, newStatus);

          // Cập nhật lại state (local)
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



  const columns = [
    {
      title: "Ảnh",
      dataIndex: ["product_image"],
      key: "image",
      render: (item: string) => {
        console.log("Image item:", item);
        const imageUrl = item
          ? item.startsWith("http")
            ? item
            : `http://localhost:5000/${item.replace(/^\/?/, "").replace(/\\/g, "/")}`
          : "/default.png";

        return (
          <Image
            src={imageUrl}
            alt="product"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
            fallback="/default.png" // fallback nếu ảnh lỗi
            preview={false} // tắt phóng to khi click
          />
        );
      }


    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["product_name"],
      key: "product_name",
    },
    {
      title: "Size",
      dataIndex: ["size"],
      key: "size",
    },
    {
      title: "Màu",
      dataIndex: ["color"],
      key: "color",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrency(price),
    },
  ];



  if (!data || !data.order || !data.orderItems) {
    return (
      <Card>
        <Title level={4} type="danger">Không tìm thấy đơn hàng</Title>
        <Link to="/admin/orders">← Quay lại danh sách đơn hàng</Link>
      </Card>
    );
  }

  const { order, orderItems } = data;

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Chi tiết đơn hàng #{order._id}</Title>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Descriptions title="Thông tin người nhận" bordered size="small" column={1}>
              <Descriptions.Item label="Tên">{order.receiverName}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{order.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{order.shippingAddress}</Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} md={12}>
            <Descriptions title="Thông tin đơn hàng" bordered size="small" column={1}>
              <Descriptions.Item label="Ngày đặt">
                {new Date(order.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán"><Tag color={paymentMethodColor[order.paymentMethod]}>{getPaymentMethodLabel(order.paymentMethod)}</Tag></Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán"><Tag color={paymentColor[order.paymentStatus]}>{getPaymentStatusLabel(order.paymentStatus)}</Tag></Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng">
                <Select
                  value={order.status}
                  style={{ width: 120 }}
                  onChange={(value) => handleStatusChange(value)}
                  size="small"
                  bordered={false}
                >
                  <Option
                    value="pending"
                    disabled={["shipped", "delivered", "cancelled"].includes(order.status)}
                  >
                    <span style={{ color: "#d9d9d9" }}>Chờ xử lý</span>
                  </Option>

                  <Option
                    value="processing"
                    disabled={["shipped", "delivered", "cancelled"].includes(order.status)}
                  >
                    <span style={{ color: "#fa8c16" }}>Đang xử lý</span>
                  </Option>

                  <Option value="shipped"
                    disabled={["delivered", "cancelled"].includes(order.status)}>
                    <span style={{ color: "#52c41a" }}>Đang giao hàng</span>
                  </Option>

                  <Option value="delivered"
                    disabled={["cancelled"].includes(order.status)}>
                    <span style={{ color: "#1890ff" }}>Đã giao</span>
                  </Option>

                  <Option
                    value="cancelled"
                    disabled={["processing", "shipped", "delivered", "cancelled"].includes(order.status)}
                  >
                    <span style={{ color: "#ff4d4f" }}>Đã hủy</span>
                  </Option>
                </Select>

              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">{formatCurrency(order.total)}</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">{formatCurrency(order.discount)}</Descriptions.Item>
              <Descriptions.Item label="Phí vận chuyển">{order.shippingFee ? formatCurrency(order.shippingFee) : "Miễn phí"}</Descriptions.Item>
              <Descriptions.Item label="Thành tiền">{formatCurrency(order.finalAmount)}</Descriptions.Item>

              {order.status === "cancelled" && order.cancellationReason && (
                <Descriptions.Item label="Lý do hủy">
                  <span style={{ color: "#ff4d4f" }}>{order.cancellationReason}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
        </Row>

        <Card
          title="Danh sách sản phẩm"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            dataSource={orderItems}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </Card>

        <Card title="Cập nhật trạng thái" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button
              onClick={() => handleStatusUpdate("processing")}
              disabled={["processing", "shipped", "delivered", "cancelled"].includes(order.status)}
            >
              ✅ Xác nhận
            </Button>

            <Button
              onClick={() => handleStatusUpdate("shipped")}
              disabled={["shipped", "delivered", "cancelled"].includes(order.status)}
            >
              🚚 Đang giao
            </Button>

            <Button
              onClick={() => handleStatusUpdate("delivered")}
              disabled={order.status !== "shipped"}
            >
              📦 Đã giao
            </Button>

            <Button
              danger
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={["shipped", "delivered", "cancelled"].includes(order.status)}
            >
              ❌ Hủy đơn
            </Button>
          </div>
        </Card>


        <div style={{ marginTop: 24 }}>
          <Link to="/admin/orders" className="ant-btn ant-btn-default">
            ← Quay lại danh sách
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;
