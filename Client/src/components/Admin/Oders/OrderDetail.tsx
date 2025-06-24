import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  Card,
  Descriptions,
  Image,
  Typography,
  Row,
  Col,
  Spin,
  Button,
  Modal,
  message,
} from "antd";

const { Title, Text } = Typography;

const Orderdetail = () => {
  const [hoaDon, setHoaDon] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fakeOrder = {
      _id: id || "HD123456",
      createdAt: "2025-06-20T10:00:00Z",
      paymentMethod: "COD",
      total: 850000,
      paymentStatus: "Chờ xử lý",
      checkPayment: "Chưa Thanh Toán",
      deliveryDate: null,
      transactionDate: null,
      shippingInfo: {
        name: "Trần Thị B",
        phone: "0987654321",
        address: "456 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      },
      products: [
        {
          name: "Áo thun nam Basic",
          size: "L",
          color: "Trắng",
          quantity: 2,
          price: 150000,
          image: "https://picsum.photos/300/200?random=1",
        },
        {
          name: "Quần jean nữ co giãn",
          size: "M",
          color: "Xanh đậm",
          quantity: 1,
          price: 250000,
          image: "https://picsum.photos/300/200?random=2",
        },
      ],
    };

    setTimeout(() => {
      setHoaDon(fakeOrder);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleStatusUpdate = (newStatus) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái",
      content: `Bạn có chắc muốn chuyển sang trạng thái \"${newStatus}\"?`,
      onOk: () => {
        setHoaDon((prev) => ({
          ...prev,
          paymentStatus: newStatus,
          deliveryDate:
            newStatus === "Giao Hàng Thành Công" ? new Date().toISOString() : prev.deliveryDate,
          checkPayment:
            newStatus === "Giao Hàng Thành Công" && prev.paymentMethod === "COD"
              ? "Đã Thanh Toán"
              : prev.checkPayment,
        }));
        message.success("Cập nhật trạng thái thành công!");
      },
    });
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (src) => <Image src={src} alt="product" width={60} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Màu",
      dataIndex: "color",
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
      render: (price) => `${price.toLocaleString()}đ`,
    },
  ];

  const renderActionButtons = () => {
    const status = hoaDon.paymentStatus;
    const buttons = [];

    if (status === "Chờ xử lý") {
      buttons.push(
        <Button type="primary" onClick={() => handleStatusUpdate("Đã Xác Nhận")}>✅ Xác Nhận</Button>,
        <Button danger onClick={() => handleStatusUpdate("Huỷ Đơn")}>❌ Huỷ Đơn</Button>
      );
    }

    if (status === "Đã Xác Nhận") {
      buttons.push(
        <Button onClick={() => handleStatusUpdate("Đang Giao")}>🚚 Đang Giao</Button>,
        <Button danger onClick={() => handleStatusUpdate("Huỷ Đơn")}>❌ Huỷ Đơn</Button>
      );
    }

    if (status === "Đang Giao") {
      buttons.push(
        <Button type="primary" onClick={() => handleStatusUpdate("Giao Hàng Thành Công")}>✅ Giao Hàng Thành Công</Button>,
        <Button danger onClick={() => handleStatusUpdate("Giao Hàng Thất Bại")}>❌ Giao Hàng Thất Bại</Button>
      );
    }

    if (status === "Giao Hàng Thất Bại") {
      buttons.push(
        <Button onClick={() => handleStatusUpdate("Giao Hàng Lại")}>🔁 Giao Hàng Lại</Button>,
        <Button danger onClick={() => handleStatusUpdate("Huỷ Đơn")}>❌ Huỷ Đơn</Button>
      );
    }

    if (status === "Giao Hàng Lại") {
      buttons.push(
        <Button type="primary" onClick={() => handleStatusUpdate("Giao Hàng Thành Công")}>✅ Giao Hàng Thành Công</Button>
      );
    }

    return <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>{buttons}</div>;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (!hoaDon) {
    return (
      <Card>
        <Title level={4} type="danger">Không tìm thấy hóa đơn</Title>
        <Link to="/admin/orders">← Quay lại danh sách đơn hàng</Link>
      </Card>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Chi tiết đơn hàng #{hoaDon._id}</Title>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Descriptions title="Thông tin khách hàng" bordered size="small" column={1} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Tên">{hoaDon.shippingInfo.name}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{hoaDon.shippingInfo.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{hoaDon.shippingInfo.address}</Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} md={12}>
            <Descriptions title="Thông tin hóa đơn" bordered size="small" column={1} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Ngày đặt">
                {new Date(hoaDon.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="PT Thanh toán">{hoaDon.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái giao hàng">{hoaDon.paymentStatus}</Descriptions.Item>
              <Descriptions.Item label="Thanh toán">{hoaDon.checkPayment}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong>{hoaDon.total.toLocaleString()}đ</Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Card title="Sản phẩm trong đơn hàng" style={{ marginTop: 24 }} bodyStyle={{ padding: 0 }}>
          <Table dataSource={hoaDon.products} columns={columns} pagination={false} rowKey={(record, index) => index} />
        </Card>

        <Card title="Cập nhật trạng thái" style={{ marginTop: 24 }}>
          {renderActionButtons()}
        </Card>

        <div style={{ marginTop: 24 }}>
          <Link to="/admin/orders" className="ant-btn ant-btn-default">← Quay lại danh sách</Link>
        </div>
      </Card>
    </div>
  );
};

export default Orderdetail;
