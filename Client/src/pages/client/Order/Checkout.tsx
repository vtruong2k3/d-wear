"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Divider,
  Typography,
  Image,
  Input,
  Space,
  Tag,
  Descriptions,
  List,
  Radio,
  Form,
} from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Checkout = () => {
  const [addressOption, setAddressOption] = useState("existing");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const cart = [
    {
      id: 1,
      name: "Áo thun nam basic",
      image: "/shirt1.jpg",
      size: "L",
      color: "Blue",
      quantity: 2,
      price: 250000,
    },
    {
      id: 2,
      name: "Quần jean nữ dáng ôm",
      image: "/jeans1.jpg",
      size: "M",
      color: "Black",
      quantity: 1,
      price: 450000,
    },
  ];

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 50000;
  const finalTotal = total - discount;

  const isOverFiveProducts =
    cart.reduce((sum, item) => sum + item.quantity, 0) > 4;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div className="container mt-4">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Link to="/shopping-cart">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              Quay lại giỏ hàng
            </Button>
          </Link>
        </Col>

        <Col xs={24} lg={16}>
          <Card title={<Title level={3}>Thông tin giao hàng</Title>}>
            <Radio.Group
              onChange={(e) => setAddressOption(e.target.value)}
              value={addressOption}
              style={{ marginBottom: 16 }}
            >
              <Radio value="existing">Sử dụng địa chỉ tài khoản</Radio>
              <Radio value="new">Nhập địa chỉ mới</Radio>
            </Radio.Group>

            {addressOption === "existing" ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và tên">
                  Nguyễn Văn A
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  0123456789
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  123 Đường ABC, Quận XYZ
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Form layout="vertical">
                <Form.Item label="Họ và tên" required>
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item label="Số điện thoại" required>
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Địa chỉ" required>
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Form>
            )}
          </Card>

          <Card
            title={<Title level={3}>Danh sách sản phẩm</Title>}
            className="mt-3"
          >
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        preview={false}
                      />
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <Text>Kích thước (Size): </Text>
                          <Tag color="blue">{item.size}</Tag>
                        </div>
                        <div>
                          <Text>Màu sắc: </Text>
                          <Tag
                            style={{
                              backgroundColor: item.color.toLowerCase(),
                              color: "#fff",
                              border: "1px solid #d9d9d9",
                            }}
                          >
                            {item.color}
                          </Tag>
                        </div>
                        <div>
                          <Text>Số lượng: </Text>
                          <Text strong>{item.quantity}</Text>
                        </div>
                      </Space>
                    }
                  />
                  <div>
                    <Text strong type="danger">
                      {formatCurrency(item.price)}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Card
            title={<Title level={3}>Ghi chú đơn hàng</Title>}
            className="mt-3"
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú cho đơn hàng (nếu có)..."
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<Title level={3}>Tổng thanh toán</Title>}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Tổng tiền">
                  <Text>{formatCurrency(total)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá">
                  <Text type="success">-{formatCurrency(discount)}</Text>
                </Descriptions.Item>
                <Divider />
                <Descriptions.Item label="Tổng thanh toán">
                  <Title level={4} type="success">
                    {formatCurrency(finalTotal)}
                  </Title>
                </Descriptions.Item>
              </Descriptions>

              {isOverFiveProducts && (
                <Text type="warning">
                  Đơn hàng có hơn 5 sản phẩm. Vui lòng thanh toán qua VNPay.
                </Text>
              )}

              <Button
                type={paymentMethod === "COD" ? "primary" : "default"}
                size="large"
                block
                onClick={() => setPaymentMethod("COD")}
                disabled={isOverFiveProducts}
              >
                Thanh toán khi nhận hàng (COD)
              </Button>

              <Button
                type={paymentMethod === "VNPay" ? "primary" : "default"}
                size="large"
                block
                onClick={() => setPaymentMethod("VNPay")}
              >
                Thanh toán online với VNPay
              </Button>

              <Button
                type="primary"
                size="large"
                block
                icon={<CheckOutlined />}
              >
                {paymentMethod === "COD"
                  ? "Xác nhận đặt hàng"
                  : "Thanh toán với VNPay"}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
