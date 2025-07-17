import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  DatePicker,

  Pagination,
  Tag,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { IOrder } from "../../../../types/order/IOrder";
import { fetchGetAllOrder, updateOrderStatus } from "../../../../services/admin/orderService";
import { formatCurrency } from "../../../../utils/Format";
import type { ColumnsType } from "antd/es/table";
import socket from "../../../../sockets/socket";
import { toast } from "react-toastify";
import { useLoading } from "../../../../contexts/LoadingContext";
import type { ErrorType } from "../../../../types/error/IError";


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
  const [showHidden, setShowHidden] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortTotal, setSortTotal] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useLoading()
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetchGetAllOrder();
        console.log("Dữ liệu trả về từ API:", response);
        const all = response.orders || [];
        const hidden = JSON.parse(localStorage.getItem("hiddenOrders") || "[]");
        setHiddenOrders(hidden);
        setOrders(all);
        filterOrders(all, hidden);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, [setLoading]);
  useEffect(() => {

    // Tham gia phòng admin để nhận đơn mới
    socket.emit("joinRoom", "admin");

    // Nhận đơn hàng mới
    socket.on("newOrder", ({ orders: newOrder }) => {
      const isCod = newOrder.paymentMethod === "cod";
      const isMomo = newOrder.paymentMethod === "momo" && newOrder.paymentStatus === "paid";
      if (isCod) {
        setOrders((prev) => [newOrder, ...prev]);
        toast.success("Có đơn hàng mới!");
      }
      if (isMomo) {
        setOrders((prev) => [newOrder, ...prev]);
        toast.success("Có đơn hàng mới với thanh toán MoMo!");
      }
      console.log("Nhận đơn hàng mới từ server:", newOrder);

    });

    return () => {
      socket.off("newOrder");
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
          toast.success(`Đơn hàng ${updatedOrder.order_code} đã bị hủy`);
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

  const filterOrders = (data: IOrder[], hidden: string[]) => {
    let filtered = [...data];

    filtered = showHidden
      ? filtered.filter((o) => hidden.includes(o._id))
      : filtered.filter((o) => !hidden.includes(o._id));

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
  };
  useEffect(() => {
    filterOrders(orders, hiddenOrders);
  }, [orders, hiddenOrders, showHidden, statusFilter, dateFilter, sortTotal]);

  const handleHide = (id: string) => {
    if (hiddenOrders.includes(id)) {
      toast.info("Đơn hàng này đã được ẩn trước đó.");
      return;
    }

    const updated = [...hiddenOrders, id];
    setHiddenOrders(updated);
    localStorage.setItem("hiddenOrders", JSON.stringify(updated));
    toast.success("Đã ẩn đơn hàng");
  };


  const handleRestore = (id: string) => {
    const updated = hiddenOrders.filter((i) => i !== id);
    setHiddenOrders(updated);
    localStorage.setItem("hiddenOrders", JSON.stringify(updated));
    toast.success("Đã khôi phục đơn hàng");
  };

  // Hàm xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId: string, newStatus: IOrder["status"]) => {
    try {
      // Gọi API để cập nhật trạng thái (cần thêm service này)
      await updateOrderStatus(orderId, newStatus);

      // Cập nhật state local
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      toast.success(`Đã cập nhật trạng thái đơn hàng thành "${getStatusLabel(newStatus)}"`);
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  //   // Hàm xử lý thay đổi trạng thái thanh toán
  //   const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
  //   try {
  //     // Gọi API backend để cập nhật
  //     await updateOrderStatus(orderId, newStatus);

  //     // Cập nhật state local
  //     const updatedOrders = orders.map(order =>
  //       order._id === orderId ? { ...order, status: newStatus } : order
  //     );
  //     setOrders(updatedOrders);

  //     message.success(`Đã cập nhật trạng thái đơn hàng thành "${getStatusLabel(newStatus)}"`);
  //   } catch (error) {
  //     message.error("Lỗi khi cập nhật trạng thái đơn hàng");
  //     console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
  //   }
  // };

  // Hàm lấy label cho trạng thái đơn hàng
  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đã giao hàng",
      delivered: "Đã giao",
      cancelled: "Đã hủy"
    };
    return statusLabels[status] || status;
  };

  // Hàm lấy label cho trạng thái thanh toán
  const getPaymentStatusLabel = (paymentStatus: string) => {
    const paymentLabels: Record<string, string> = {
      unpaid: "Chưa thanh toán",
      paid: "Đã thanh toán"
    };
    return paymentLabels[paymentStatus] || paymentStatus;
  };

  // const statusColor: Record<string, string> = {
  //   pending: "default",
  //   processing: "orange",
  //   shipped: "green",
  //   delivered: "blue",
  //   cancelled: "red",
  // };

  const paymentColor: Record<string, string> = {
    unpaid: "volcano",
    paid: "green",
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
        const isHidden = hiddenOrders.includes(String(record._id));
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

            {/* Nếu không phải danh sách đơn đã ẩn và đơn chưa bị ẩn mới hiện nút Ẩn */}
            {!showHidden && !isHidden && (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleHide(record._id)}
                danger
                size="small"
              >
                Ẩn
              </Button>
            )}

            {/* Nếu đang xem danh sách đơn đã ẩn thì hiện nút Khôi phục */}
            {showHidden && isHidden && (
              <Button
                icon={<RollbackOutlined />}
                onClick={() => handleRestore(record._id)}
                type="dashed"
                size="small"
              >
                Khôi phục
              </Button>
            )}
          </>
        );
      },
    }

  ];

  return (
    <div>
      <h2>📦 Danh sách đơn hàng</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <Select
          placeholder="Lọc theo trạng thái đơn"
          style={{ width: 180 }}
          allowClear
          onChange={setStatusFilter}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="processing">Đang xử lý</Option>
          <Option value="shipped">Đã giao hàng</Option>
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

        <Button type="default" onClick={() => setShowHidden(!showHidden)}>
          {showHidden ? " Danh sách chính" : " Đơn đã ẩn"}
        </Button>
      </div>

      <Table<IOrder>
        columns={columns}
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
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default OrderList;