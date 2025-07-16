"use client";

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
  Form,
} from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import axios from "axios";
import { useCallback } from "react";
import { fetCheckVoucher } from "../../../services/client/apiVoucherService";
import type { ErrorType } from "../../../types/error/IError";
import { createOrder } from "../../../services/client/orderAPI";
import type { OrderData } from "../../../types/order/IOrder";
import type { IVoucher } from "../../../types/voucher/IVoucher";
import toast from "react-hot-toast";

import { removeOrderedItems } from "../../../redux/features/client/cartSlice";

const { Title, Text } = Typography;
const { TextArea } = Input;
export type VoucherPreview = Pick<
  IVoucher,
  "_id" | "code" | "discountType" | "discountValue" | "maxDiscountValue"
>;
const Checkout = () => {
  const location = useLocation();
  const selectedItems: string[] = location.state?.selectedItems || [];
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(
    (state: RootState) => state.cartSlice.cartItems
  );
  const { user, token } = useSelector((state: RootState) => state.authenSlice);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherPreview | null>(
    null
  );
  const [form] = Form.useForm();
  // Thêm state note
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Memo lấy các sản phẩm được chọn
  const itemsToCheckout = useMemo(() => {
    return cartItems.filter((item) => selectedItems.includes(item._id));
  }, [cartItems, selectedItems]);

  // Tính tổng đơn hàng
  const rawTotal = useMemo(() => {
    return itemsToCheckout.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [itemsToCheckout]);

  //  Hàm kiểm tra voucher
  const checkVoucher = useCallback(
    async (code: string) => {
      if (!code || code.trim() === "") {
        toast.error("Vui lòng nhập mã voucher");
        return;
      }
      try {
        setIsLoading(true);
        if (!user?._id) {
          toast.error("Không tìm thấy thông tin người dùng");
          return;
        }

        const res = await fetCheckVoucher({
          code,
          total: rawTotal,
          user_id: user._id,
        });

        const data = res.data;
        setSelectedVoucher({
          _id: data.voucher_id,
          code: code,
          discountValue:
            data.discountType === "percentage"
              ? rawTotal > 0
                ? (data.discount * 100) / rawTotal
                : 0
              : data.discount,
          discountType: data.discountType,
          maxDiscountValue:
            data.discountType === "percentage" ? data.discount : data.discount,
        });

        toast.success("Áp dụng mã thành công!");
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
        setSelectedVoucher(null);
      } finally {
        setIsLoading(false);
      }
    },
    [rawTotal, token, user?._id]
  );

  // Tính giảm giá
  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.discountType === "percentage") {
      const percentage = (rawTotal * selectedVoucher.discountValue) / 100;
      return Math.min(percentage, selectedVoucher.maxDiscountValue);
    }
    return selectedVoucher.discountValue;
  }, [selectedVoucher, rawTotal]);

  const finalTotal = rawTotal - discount;
  const isOverFiveProducts =
    itemsToCheckout.reduce((sum, item) => sum + item.quantity, 0) > 4;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  // Trong handleSubmit, dùng note từ state để gửi
  // const handleSubmit = async () => {
  //   try {
  //     const values = await form.validateFields();

  //     if (!user || !user._id) {
  //       toast.error("Không tìm thấy thông tin người dùng");
  //       return;
  //     }

  //     const payment = paymentMethod.toLowerCase();
  //     if (!["cod", "momo", "vnpay"].includes(payment)) {
  //       toast.error("Phương thức thanh toán không hợp lệ");
  //       return;
  //     }

  //     const orderData: OrderData = {
  //       user_id: user._id,
  //       email: values.email,
  //       receiverName: values.name,
  //       shippingAddress: values.address,
  //       phone: values.phone,
  //       paymentMethod: payment as "cod" | "momo" | "vnpay",
  //       voucher_id: selectedVoucher?._id ?? null,
  //       items: itemsToCheckout.map((item) => ({
  //         product_id: item.product_id._id,
  //         variant_id:
  //           typeof item.variant_id === "string"
  //             ? item.variant_id
  //             : item.variant_id._id,
  //         quantity: item.quantity,
  //         price: item.price,
  //       })),
  //       note: note ?? "",
  //     };

  //     // console.log("ORDER DATA gửi đi:", JSON.stringify(orderData, null, 2));
  //     setIsLoading(true);

  //     const res = await createOrder(orderData);

  //     toast.success(res.data.message || "Đặt hàng thành công!");
  //     const orderedItemIds = itemsToCheckout.map((item) => item._id);

  //     dispatch(removeOrderedItems(orderedItemIds));

  //     navigate("/orders");

  //   } catch (error) {
  //     const errorMessage =
  //       (error as ErrorType).response?.data?.message ||
  //       (error as ErrorType).message ||
  //       "Đã xảy ra lỗi, vui lòng thử lại.";
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
  
      if (!user || !user._id) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }
  
      const payment = paymentMethod.toLowerCase();
      if (!["cod", "momo", "vnpay"].includes(payment)) {
        toast.error("Phương thức thanh toán không hợp lệ");
        return;
      }
  
      const orderData: OrderData = {
        user_id: user._id,
        email: values.email,
        receiverName: values.name,
        shippingAddress: values.address,
        phone: values.phone,
        paymentMethod: payment as "cod" | "momo" | "vnpay",
        voucher_id: selectedVoucher?._id ?? null,
        items: itemsToCheckout.map((item) => ({
          product_id: item.product_id._id,
          variant_id:
            typeof item.variant_id === "string"
              ? item.variant_id
              : item.variant_id._id,
          quantity: item.quantity,
          price: item.price,
        })),
        note: note ?? "",
      };
  
      console.log("📝 Dữ liệu gửi lên BE:", orderData);
  
      setIsLoading(true);
  
      const res = await createOrder(orderData);
  
      console.log("📦 createOrder response:", res.data);
  
      // ✅ Nếu COD thì chỉ hiển thị thông báo
      if (payment === "cod") {
        toast.success(res.data.message || "Đặt hàng thành công!");
        dispatch(removeOrderedItems(itemsToCheckout.map((i) => i._id)));
        navigate("/orders");
        return;
      }
  
      // ✅ Nếu MoMo thì chuyển hướng ngay
      if (payment === "momo") {
        const { order_id, finalAmount, payUrl } = res.data;
  
        if (!order_id || !finalAmount || !payUrl) {
          console.error("❌ Thiếu dữ liệu MoMo:", { order_id, finalAmount, payUrl });
          toast.error("Không tạo được đơn hàng MoMo");
          return;
        }
  
        window.location.href = payUrl;
        return;
      }
  
      // ✅ Tạm thời chưa hỗ trợ VNPay
      toast.error("Phương thức thanh toán chưa được hỗ trợ");
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

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
            <Form layout="vertical" form={form}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không đúng định dạng" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Form>
          </Card>

          {/* Danh sách sản phẩm */}
          <Card
            title={<Title level={3}>Danh sách sản phẩm</Title>}
            className="mt-3"
          >
            <List
              itemLayout="horizontal"
              dataSource={itemsToCheckout}
              renderItem={(item) => (
                <List.Item key={item._id}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        src={
                          item.product_id.imageUrls?.[0]?.startsWith("http")
                            ? item.product_id.imageUrls[0]
                            : `http://localhost:5000/${item.product_id.imageUrls?.[0]?.replace(
                                /\\/g,
                                "/"
                              )}`
                        }
                        alt={item.product_id.product_name}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        preview={false}
                      />
                    }
                    title={<Text strong>{item.product_id.product_name}</Text>}
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <Text>Kích thước: </Text>
                          <Tag>{item.variant_id.size || "M"}</Tag>
                        </div>
                        <div>
                          <Text>Màu sắc: </Text>
                          <Tag>{item.variant_id.color || "Đen"}</Tag>
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

          {/* Ghi chú */}
          <Card
            title={<Title level={3}>Ghi chú đơn hàng</Title>}
            className="mt-3"
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú cho đơn hàng (nếu có)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Card>
        </Col>

        {/* Tổng thanh toán và Voucher */}
        <Col xs={24} lg={8}>
          <Card title={<Title level={3}>Tổng thanh toán</Title>}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Tạm tính">
                  <Text>{formatCurrency(rawTotal)}</Text>
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
                type={paymentMethod === "MoMo" ? "primary" : "default"}
                size="large"
                block
                onClick={() => setPaymentMethod("MoMo")}
              >
                Thanh toán online với MoMo
              </Button>

              <Button
                type="primary"
                size="large"
                block
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                loading={isLoading}
              >
                {paymentMethod === "COD"
                  ? "Xác nhận đặt hàng"
                  : paymentMethod === "MoMo"
                  ? "Thanh toán với MoMo"
                  : "Thanh toán"}
              </Button>
            </Space>
          </Card>

          {/* Voucher - Đã di chuyển xuống dưới */}
          <Card
            title={<Title level={3}>Mã giảm giá (Voucher)</Title>}
            className="mt-3"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {selectedVoucher ? (
                <>
                  <Text strong>Mã đã chọn:</Text>
                  <Tag color="green">{selectedVoucher.code}</Tag>
                  <Text type="success">
                    {selectedVoucher.discountType === "percentage"
                      ? `Giảm ${selectedVoucher.discountValue.toFixed(2)}%`
                      : `Giảm ${formatCurrency(selectedVoucher.discountValue)}`}
                  </Text>
                  <Button onClick={() => setSelectedVoucher(null)}>
                    Hủy mã
                  </Button>
                </>
              ) : (
                <Text type="secondary">Bạn chưa chọn mã giảm giá nào</Text>
              )}

              <Input.Search
                placeholder="Nhập mã giảm giá"
                enterButton="Áp dụng"
                onSearch={checkVoucher}
                allowClear
                loading={isLoading}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
