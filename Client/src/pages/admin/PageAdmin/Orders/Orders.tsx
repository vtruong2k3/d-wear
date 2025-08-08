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
  Card,
  Space,
  Row,
  Col,
  Statistic,

  Tooltip,
  Typography,
  Divider,
} from "antd";
import {
  EyeOutlined,

  FilterOutlined,
  SortAscendingOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
// import '../../../../styles/orderAdmin.css'
import { Link } from "react-router-dom";
import type { IOrder } from "../../../../types/order/IOrder";
import { fetchGetAllOrder, updateOrderStatus } from "../../../../services/admin/orderService";
import { formatCurrency } from "../../../../utils/Format";
import type { ColumnsType } from "antd/es/table";
import socket from "../../../../sockets/socket";
import type { ErrorType } from "../../../../types/error/IError";
import { getPaymentMethodLabel, getPaymentStatusLabel, getStatusLabel, paymentColor, paymentMethodColor } from "../../../../utils/Status";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

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

  const handleRefresh = () => {
    fetchData();
    message.success("Đã làm mới dữ liệu");
  };

  const clearAllFilters = () => {
    setStatusFilter("");
    setDateFilter("");
    setSortTotal("");
    setSearchText("");
    setCurrentPage(1);
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.finalAmount, 0),
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      render: (_: unknown, __: IOrder, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 50,
      align: 'center',
    },
    {
      title: "Mã đơn",
      dataIndex: "order_code",
      width: 90,
      render: (orderCode: string) => (
        <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
          {orderCode || "N/A"}
        </Text>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      width: 80,
      render: (date: string) => (
        <Text style={{ fontSize: '11px' }}>{formatDate(date)}</Text>
      ),
    },
    {
      title: "Khách hàng",
      width: 140,
      render: (_: IOrder, record: IOrder) => (
        <div>
          <Text strong style={{ fontSize: '12px' }}>
            {record.receiverName?.substring(0, 20) || "N/A"}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '10px' }}>
            {record.phone || "N/A"}
          </Text>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      width: 120,
      render: (_: IOrder, record: IOrder) => (
        <Tooltip title={record.shippingAddress}>
          <Text ellipsis style={{ fontSize: '11px' }}>
            {record.shippingAddress?.substring(0, 30) || "N/A"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "finalAmount",
      width: 90,
      align: 'right',
      render: (_: IOrder, record: IOrder) => (
        <Text strong style={{ color: '#52c41a', fontSize: '12px' }}>
          {window.innerWidth <= 768
            ? `${Math.round(record.finalAmount / 1000)}K`
            : formatCurrency(record.finalAmount)
          }
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      width: 110,
      render: (_: IOrder, record: IOrder) => (
        <Select
          value={record.status}
          style={{ width: '100%' }}
          bordered={false}
          onChange={(value) => handleStatusChange(record._id, value)}
          size="small"
        >
          <Option value="pending" disabled={["shipped", "delivered", "cancelled"].includes(record.status)}>
            <span style={{ color: "#d9d9d9" }}>Chờ xử lý</span>
          </Option>
          <Option value="processing" disabled={["shipped", "delivered", "cancelled"].includes(record.status)}>
            <span style={{ color: "#fa8c16" }}>Đang xử lý</span>
          </Option>
          <Option value="shipped" disabled={["delivered", "cancelled"].includes(record.status)}>
            <span style={{ color: "#52c41a" }}>Đang giao hàng</span>
          </Option>
          <Option value="delivered" disabled={["cancelled"].includes(record.status)}>
            <span style={{ color: "#1890ff" }}>Đã giao</span>
          </Option>
          <Option value="cancelled" disabled={["shipped", "delivered"].includes(record.status)}>
            <span style={{ color: "#ff4d4f" }}>Đã hủy</span>
          </Option>
        </Select>
      ),
    },
    {
      title: "Thanh toán",
      width: 100,
      render: (_: IOrder, record: IOrder) => (
        <Space direction="vertical" size={2}>
          <Tag color={paymentMethodColor[record.paymentMethod]} style={{ margin: 0, fontSize: '10px' }}>
            {getPaymentMethodLabel(record.paymentMethod)}
          </Tag>
          <Tag color={paymentColor[record.paymentStatus] || "default"} style={{ margin: 0, fontSize: '10px' }}>
            {getPaymentStatusLabel(record.paymentStatus)}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      width: 80,
      align: 'center',
      render: (record: IOrder) => (
        <Link to={`/admin/orders/${record._id}`}>
          <Tooltip title="Chi tiết">
            <Button
              icon={<EyeOutlined />}
              type="primary"
              size="small"
              style={{ borderRadius: '4px' }}
            />
          </Tooltip>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }} className="bg-gray-50">
      <Card
        style={{
          marginBottom: 24,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Title level={2} style={{
          textAlign: "center",
          margin: "0 0 24px",
          color: "#262626",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <ShoppingCartOutlined style={{ color: '#1890ff' }} />
          Quản lý đơn hàng
        </Title>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Tổng đơn hàng"
                value={stats.total}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Chờ xử lý"
                value={stats.pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Đang xử lý"
                value={stats.processing}
                prefix={<SortAscendingOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Đã giao"
                value={stats.delivered}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Đã hủy"
                value={stats.cancelled}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Doanh thu"
                value={stats.totalRevenue}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: '16px' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        {/* Filter Controls */}
        <Card
          size="small"
          title={
            <Space size="small">
              <FilterOutlined style={{ fontSize: '14px' }} />
              <span style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px' }}>
                Bộ lọc
              </span>
            </Space>
          }
          extra={
            <Space size="small">
              <Button
                onClick={clearAllFilters}
                size="small"
                style={{ borderRadius: '4px', fontSize: '12px' }}
              >
                Xóa
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                size="small"
                style={{ borderRadius: '4px', fontSize: '12px' }}
              >
                {window.innerWidth <= 768 ? '' : 'Làm mới'}
              </Button>
            </Space>
          }
          style={{ marginBottom: 12, borderRadius: '6px' }}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                placeholder="Trạng thái"
                style={{ width: '100%' }}
                allowClear
                onChange={setStatusFilter}
                value={statusFilter || undefined}
                size={window.innerWidth <= 768 ? 'small' : 'middle'}
              >
                <Option value="pending">Chờ xử lý</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipped">Đang giao</Option>
                <Option value="delivered">Đã giao</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <DatePicker
                format="DD/MM/YYYY"
                onChange={(date) => {
                  setDateFilter(date ? dayjs(date).format("YYYY-MM-DD") : "");
                }}
                placeholder="Ngày"
                style={{ width: '100%' }}
                size={window.innerWidth <= 768 ? 'small' : 'middle'}
              />
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                placeholder="Sắp xếp tiền"
                style={{ width: '100%' }}
                allowClear
                onChange={setSortTotal}
                value={sortTotal || undefined}
                size={window.innerWidth <= 768 ? 'small' : 'middle'}
              >
                <Option value="low-to-high">Thấp → Cao</Option>
                <Option value="high-to-low">Cao → Thấp</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Input.Search
                placeholder="Tìm kiếm"
                onSearch={(value) => setSearchText(value)}
                style={{ width: '100%' }}
                allowClear
                size={window.innerWidth <= 768 ? 'small' : 'middle'}
              />
            </Col>
          </Row>
        </Card>
      </Card>

      {/* Orders Table */}
      <Card
        style={{
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Table<IOrder>
          columns={columns}
          loading={loading}
          dataSource={orders}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 900 }}
          size="small"
          style={{ marginBottom: 12 }}
        />

        <div style={{
          display: 'flex',
          justifyContent: window.innerWidth <= 768 ? 'center' : 'space-between',
          alignItems: 'center',
          marginTop: 12,
          padding: '12px 0',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: window.innerWidth <= 768 ? '8px' : '0'
        }}>
          {window.innerWidth > 768 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} / {totalItems}
            </Text>
          )}

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger={window.innerWidth > 768}
            pageSizeOptions={["10", "20", "50"]}
            showQuickJumper={window.innerWidth > 768}
            size="small"
            simple={window.innerWidth <= 768}
          />
        </div>
      </Card>


    </div>
  );
};

export default OrderList;