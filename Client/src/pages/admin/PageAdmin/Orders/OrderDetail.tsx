import { useEffect, useState } from "react";
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
  Modal,
  message,
  Tag,
} from "antd";
import { toast } from "react-toastify";
import type { ErrorType } from "../../../../types/error/IError";
import { fetchGetOrderDetail } from "../../../../services/admin/orderService";
import type { OrderDetailResponse, IOrder } from "../../../../types/order/IOrder";
import { useLoading } from "../../../../contexts/LoadingContext";


const { Title } = Typography;

const OrderDetail = () => {
  const { setLoading } = useLoading()
  const { id } = useParams();
  const [data, setData] = useState<OrderDetailResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetchGetOrderDetail(id);
        setData(res);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setLoading]);
  // Màu sắc tương ứng với trạng thái
  const statusColor: Record<string, string> = {
    pending: "default",
    processing: "orange",
    shipped: "blue",
    delivered: "green",
    cancelled: "red",
  };

  // Tiếng Việt cho trạng thái
  const statusLabel: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã huỷ",
  };


  const handleStatusUpdate = (newStatus: IOrder["status"]) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái",
      content: `Bạn có chắc muốn chuyển đơn sang trạng thái "${newStatus}"?`,
      onOk: async () => {
        try {
          // Gọi API cập nhật trạng thái ở đây nếu cần
          message.success("Cập nhật trạng thái thành công!");
        } catch (error) {
          const errorMessage =
            (error as ErrorType).response?.data?.message ||
            (error as ErrorType).message ||
            "Đã xảy ra lỗi, vui lòng thử lại.";
          toast.error(errorMessage);
        }
      },
    });
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: ["product_id", "imageUrls"],
      key: "image",
      render: (item: string) => {
        const rawImagePath = item?.[0];

        const imageUrl = rawImagePath
          ? rawImagePath.startsWith("http")
            ? rawImagePath
            : `http://localhost:5000/${rawImagePath.replace(/^\/?/, "").replace(/\\/g, "/")}`
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
      dataIndex: ["product_id", "product_name"],
      key: "product_name",
    },
    {
      title: "Size",
      dataIndex: ["variant_id", "size"],
      key: "size",
    },
    {
      title: "Màu",
      dataIndex: ["variant_id", "color"],
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
      render: (price: number) => `${price.toLocaleString()}đ`,
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
              <Descriptions.Item label="Địa chỉ">{order.shippingAddress}</Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} md={12}>
            <Descriptions title="Thông tin đơn hàng" bordered size="small" column={1}>
              <Descriptions.Item label="Ngày đặt">
                {new Date(order.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">{order.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">{order.paymentStatus}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng">
                <Tag color={statusColor[order.status]}>
                  {statusLabel[order.status] || order.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">{order.total.toLocaleString()}đ</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">{order.discount.toLocaleString()}đ</Descriptions.Item>
              <Descriptions.Item label="Thành tiền">{order.finalAmount.toLocaleString()}đ</Descriptions.Item>
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
            <Button onClick={() => handleStatusUpdate("processing")}>✅ Xác nhận</Button>
            <Button onClick={() => handleStatusUpdate("shipped")}>🚚 Đang giao</Button>
            <Button onClick={() => handleStatusUpdate("delivered")}>📦 Đã giao</Button>
            <Button danger onClick={() => handleStatusUpdate("cancelled")}>❌ Hủy đơn</Button>
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
