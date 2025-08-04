import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  DatePicker,

  Pagination,
  Tag,
  message,
} from "antd";
import {
  EyeOutlined,

} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { IOrder } from "../../../../types/order/IOrder";
import { fetchGetAllOrder, updateOrderStatus } from "../../../../services/admin/orderService";
import { formatCurrency } from "../../../../utils/Format";
import type { ColumnsType } from "antd/es/table";
import socket from "../../../../sockets/socket";


import type { ErrorType } from "../../../../types/error/IError";
import { getPaymentStatusLabel, getStatusLabel, paymentColor } from "../../../../utils/Status";
import Title from "antd/es/typography/Title";


const { Option } = Select;

const formatDate = (dateString: string) => {
  if (!dateString) return "Không có";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

const normalizeString = (str: string) => {
  if (!str) return "";
  return str.trim().normalize("NFC").replace(/\s+/g, " ").toLowerCase();
};

const OrderList = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [hiddenOrders, setHiddenOrders] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortTotal, setSortTotal] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(10);
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetchGetAllOrder();

      const all = response.orders || [];
      const hidden = JSON.parse(localStorage.getItem("hiddenOrders") || "[]");
      setHiddenOrders(hidden);
      setOrders(all);
      filterOrders(all);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {

    fetchData();
  }, []);
  useEffect(() => {
    socket.emit("joinRoom", "admin");

    socket.on("newOrder", ({ orders: newOrder }) => {



      setOrders((prev) => [newOrder, ...prev]);
      message.success(` Có đơn hàng mới ${newOrder.order_code}`);
    });

    socket.on("orderPaid", ({ orderId, paymentStatus }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus } : order
        )
      );
      message.info(` Đơn hàng ${orderId} đã được thanh toán thành công.`);
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderPaid");
    };
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    orders.forEach((order) => {
      socket.emit('joinRoom', order._id);
    });

    socket.on('cancelOrder', ({ orderId, status }) => {
      setOrders((prevOrders) => {
        const updated = prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        );

        const updatedOrder = updated.find(order => order._id === orderId);
        if (updatedOrder) {
          message.success(`Đơn hàng ${updatedOrder.order_code} đã bị hủy`);
        }

        return updated;
      });
    });


    return () => {
      orders.forEach((order) => {
        socket.emit('leaveRoom', order._id);
      });
      socket.off('cancelOrder');
    };
  }, [orders]);



  const filterOrders = useCallback((data: IOrder[]) => {
    let filtered = [...data];



    if (statusFilter) {
      const normalized = normalizeString(statusFilter);
      filtered = filtered.filter(
        (o) => normalizeString(o.status) === normalized
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (o) => formatDate(o.createdAt) === dateFilter
      );
    }

    if (sortTotal === "low-to-high") {
      filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
    } else if (sortTotal === "high-to-low") {
      filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [statusFilter, dateFilter, sortTotal]);

  useEffect(() => {
    filterOrders(orders);
  }, [orders, hiddenOrders, filterOrders]);



  // Hàm xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId: string, newStatus: IOrder["status"]) => {
    setLoading(true);
    try {
      // Gọi API để cập nhật trạng thái (cần thêm service này)
      await updateOrderStatus(orderId, newStatus);

      // Cập nhật state local
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
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






  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      render: (_: unknown, __: IOrder, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Người nhận",
      dataIndex: ["shippingAddress", "name"],
      render: (_: IOrder, record: IOrder) =>
        record.receiverName || "Không có",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["shippingAddress", "phone"],
      render: (_: IOrder, record: IOrder) =>
        record.phone || "Không có",
    },
    {
      title: "Địa chỉ",
      dataIndex: ["shippingAddress", "address"],
      render: (_: IOrder, record: IOrder) =>
        record.shippingAddress || "Không có",
    },
    {
      title: "Tổng tiền",
      render: (_: IOrder, record: IOrder) =>
        formatCurrency(record.total),
    },
    {
      title: "Giảm giá",
      render: (_: IOrder, record: IOrder) =>
        formatCurrency(record.discount),
    },
    {
      title: "Thành tiền",
      dataIndex: "finalAmount",
      render: (_: IOrder, record: IOrder) =>
        formatCurrency(record.finalAmount),
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
          <Option
            value="pending"
            disabled={["shipped", "delivered", "cancelled"].includes(record.status)}
          >
            <span style={{ color: "#d9d9d9" }}>Chờ xử lý</span>
          </Option>

          <Option
            value="processing"
            disabled={["shipped", "delivered", "cancelled"].includes(record.status)}
          >
            <span style={{ color: "#fa8c16" }}>Đang xử lý</span>
          </Option>

          <Option value="shipped"
            disabled={["delivered", "cancelled"].includes(record.status)}
          >
            <span style={{ color: "#52c41a" }}>Đang giao hàng</span>
          </Option>

          <Option value="delivered"
            disabled={["cancelled"].includes(record.status)}
          >
            <span style={{ color: "#1890ff" }}>Đã giao</span>
          </Option>

          <Option
            value="cancelled"
            disabled={["shipped", "delivered"].includes(record.status)}
          >
            <span style={{ color: "#ff4d4f" }}>Đã hủy</span>
          </Option>
        </Select>
      )


    },
    {
      title: "Thanh toán",
      render: (_: IOrder, record: IOrder) => (
        <Tag color={paymentColor[record.paymentStatus] || "default"}>{getPaymentStatusLabel(record.paymentStatus)}</Tag>
      ),
    },
    {
      title: "Hành động",
      render: (record: IOrder) => {

        return (
          <>
            <Link to={`/admin/orders/${record._id}`}>
              <Button
                icon={<EyeOutlined />}
                type="primary"
                size="small"
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                Xem
              </Button>
            </Link>

          </>
        );
      },
    }

  ];

  return (
    <div>
      <Title
        level={2}
        style={{
          textAlign: "center",
          margin: "0 0 24px 0",
          color: "#262626",

        }}
      >
        Danh sách đơn hàng
      </Title>
      {/* <h2 className="text-3xl !p-3">Danh sách đơn hàng</h2> */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <Select
          placeholder="Lọc theo trạng thái đơn"
          style={{ width: 180 }}
          allowClear
          onChange={setStatusFilter}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="processing">Đang xử lý</Option>
          <Option value="shipped">Đang giao hàng</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>

        <DatePicker
          format="DD/MM/YYYY"
          onChange={(_, dateStrings) => {
            if (Array.isArray(dateStrings)) {
              setDateFilter(dateStrings[0]); // hoặc ghép lại nếu cần
            } else {
              setDateFilter(dateStrings);
            }
          }}
          placeholder="Lọc theo ngày"
        />

        <Select
          placeholder="Sắp xếp tổng tiền"
          style={{ width: 180 }}
          allowClear
          onChange={setSortTotal}
        >
          <Option value="low-to-high">Thấp → Cao</Option>
          <Option value="high-to-low">Cao → Thấp</Option>
        </Select>


      </div>

      <Table<IOrder>
        columns={columns}
        loading={loading}
        dataSource={filteredOrders.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        rowKey="_id"
        pagination={false}
      />

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredOrders.length}
          onChange={(page, pageSize) => {
            setLoading(true); //  Bắt đầu loading
            setCurrentPage(page);
            setPageSize(pageSize);


            setTimeout(() => {
              setLoading(false); //  Kết thúc loading
            }, 300);
          }}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
        />

      </div>
    </div>
  );
};

export default OrderList;