import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  DatePicker,
  Pagination,
  Tag,
  message,
  Input,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { IOrder } from "../../../../types/order/IOrder";
import { fetchGetAllOrder, updateOrderStatus } from "../../../../services/admin/orderService";
import { formatCurrency } from "../../../../utils/Format";
import type { ColumnsType } from "antd/es/table";
import socket from "../../../../sockets/socket";
import type { ErrorType } from "../../../../types/error/IError";
import { getPaymentMethodLabel, getPaymentStatusLabel, getStatusLabel, paymentColor, paymentMethodColor } from "../../../../utils/Status";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";

const { Option } = Select;

const formatDate = (dateString: string) => {
  if (!dateString) return "Không có";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const OrderList = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortTotal, setSortTotal] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchGetAllOrder({
        page: currentPage,
        limit: pageSize,
        q: searchText || undefined,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
        sort: sortTotal || undefined,
      });
      console.log('tiem kiếm', searchText)
      setOrders(response.orders || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter, currentPage, pageSize, searchText, sortTotal, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    socket.emit("joinRoom", "admin");

    socket.on("newOrder", ({ orders: newOrder }) => {
      setOrders((prev) => [newOrder, ...prev]);
      message.success(`Có đơn hàng mới ${newOrder.order_code}`);
    });

    socket.on("orderPaid", ({ orderId, paymentStatus }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus } : order
        )
      );
      message.info(`Đơn hàng ${orderId} đã được thanh toán thành công.`);
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderPaid");
    };
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    orders.forEach((order) => {
      socket.emit("joinRoom", order._id);
    });

    socket.on("cancelOrder", ({ orderId, status }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      const updatedOrder = orders.find((order) => order._id === orderId);
      if (updatedOrder) {
        message.success(`Đơn hàng ${updatedOrder.order_code} đã bị hủy`);
      }
    });

    return () => {
      orders.forEach((order) => {
        socket.emit("leaveRoom", order._id);
      });
      socket.off("cancelOrder");
    };
  }, [orders]);

  const handleStatusChange = async (orderId: string, newStatus: IOrder["status"]) => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      if (newStatus === "delivered") {
        fetchData();
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

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      render: (_: unknown, __: IOrder, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Người nhận",
      dataIndex: ["shippingAddress", "name"],
      render: (_: IOrder, record: IOrder) => record.receiverName || "Không có",
    },
    {
      title: "Số điện thoại",
      render: (_: IOrder, record: IOrder) => record.phone || "Không có",
    },
    {
      title: "Địa chỉ",
      render: (_: IOrder, record: IOrder) => record.shippingAddress || "Không có",
    },
    {
      title: "Tổng tiền",
      dataIndex: "finalAmount",
      render: (_: IOrder, record: IOrder) => formatCurrency(record.finalAmount),
    },
    {
      title: "Trạng thái đơn",
      render: (_: IOrder, record: IOrder) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          size="small"
          bordered={false}
        >
          <Option value="pending" disabled={["shipped", "delivered", "cancelled"].includes(record.status)}><span style={{ color: "#d9d9d9" }}>Chờ xử lý</span></Option>
          <Option value="processing" disabled={["shipped", "delivered", "cancelled"].includes(record.status)}><span style={{ color: "#fa8c16" }}>Đang xử lý</span></Option>
          <Option value="shipped" disabled={["delivered", "cancelled"].includes(record.status)}><span style={{ color: "#52c41a" }}>Đang giao hàng</span></Option>
          <Option value="delivered" disabled={["cancelled"].includes(record.status)}><span style={{ color: "#1890ff" }}>Đã giao</span></Option>
          <Option value="cancelled" disabled={["shipped", "delivered"].includes(record.status)}><span style={{ color: "#ff4d4f" }}>Đã hủy</span></Option>
        </Select>
      ),
    },
    {
      title: "Phương thức thanh toán",
      render: (_: IOrder, record: IOrder) => (
        <Tag color={paymentMethodColor[record.paymentMethod]}>
          {getPaymentMethodLabel(record.paymentMethod)}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      render: (_: IOrder, record: IOrder) => (
        <Tag color={paymentColor[record.paymentStatus] || "default"}>
          {getPaymentStatusLabel(record.paymentStatus)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (record: IOrder) => (
        <Link to={`/admin/orders/${record._id}`}>
          <Button icon={<EyeOutlined />} type="primary" size="small">
            Chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ textAlign: "center", margin: "0 0 24px", color: "#262626" }}>
        Danh sách đơn hàng
      </Title>

      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <Select placeholder="Lọc theo trạng thái đơn" style={{ width: 180 }} allowClear onChange={setStatusFilter}>
          <Option value="pending">Chờ xử lý</Option>
          <Option value="processing">Đang xử lý</Option>
          <Option value="shipped">Đang giao hàng</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>

        <DatePicker
          format="DD/MM/YYYY"
          onChange={(date) => {
            setDateFilter(date ? dayjs(date).format("YYYY-MM-DD") : "");
          }}
          placeholder="Lọc theo ngày"
        />

        <Select placeholder="Sắp xếp tổng tiền" style={{ width: 180 }} allowClear onChange={setSortTotal}>
          <Option value="low-to-high">Thấp → Cao</Option>
          <Option value="high-to-low">Cao → Thấp</Option>
        </Select>

        <Input.Search
          placeholder="Tìm theo mã đơn / tên người nhận"
          onSearch={(value) => setSearchText(value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table<IOrder>
        columns={columns}
        loading={loading}
        dataSource={orders}
        rowKey="_id"
        pagination={false}
      />

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </div>
    </div>
  );
};

export default OrderList;
