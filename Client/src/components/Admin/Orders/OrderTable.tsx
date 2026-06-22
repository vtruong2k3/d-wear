import { Table, Tag, Space, Button, Tooltip, Typography, Select } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { IOrder } from "../../../types/order/IOrder";
import { formatCurrency } from "../../../utils/Format";
import { getPaymentMethodLabel, getPaymentStatusLabel, paymentColor, paymentMethodColor } from "../../../utils/Status";

const { Text } = Typography;
const { Option } = Select;

const formatDate = (dateString: string) => {
  if (!dateString) return "Không có";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

interface OrderTableProps {
  orders: IOrder[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  handleStatusChange: (orderId: string, newStatus: IOrder["status"]) => void;
}

const OrderTable = ({ orders, loading, currentPage, pageSize, handleStatusChange }: OrderTableProps) => {
  const columns = [
    {
      title: "STT",
      render: (_: unknown, __: IOrder, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 50,
      align: 'center' as const,
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
      align: 'right' as const,
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
            <span style={{ color: "#52c41a" }}>Đang giao</span>
          </Option>
          <Option value="delivered" disabled={["cancelled"].includes(record.status)}>
            <span style={{ color: "#1890ff" }}>Đã giao</span>
          </Option>
          <Option value="cancelled" disabled>
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
      align: 'center' as const,
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
  );
};

export default OrderTable;
