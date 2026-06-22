import { Table, Tag, Typography, Image, Badge } from "antd";
import type { OrderItem } from "../../../types/order/IOrder";
import { formatCurrency } from "../../../utils/Format";

const { Text } = Typography;

interface OrderItemsTableProps {
  orderItems: OrderItem[];
}

const OrderItemsTable = ({ orderItems }: OrderItemsTableProps) => {
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product_image"],
      key: "product",
      width: 200,
      render: (item: string, record: OrderItem) => {
        const imageUrl = item
          ? item.startsWith("http")
            ? item
            : `http://localhost:5000/${item.replace(/^\/?/, "").replace(/\\/g, "/")}`
          : "/default.png";

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src={imageUrl}
              alt="product"
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 8, border: '1px solid #f0f0f0' }}
              fallback="/default.png"
              preview={false}
            />
            <div>
              <Text strong style={{ fontSize: 14 }}>{record.product_name}</Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="blue" style={{ fontSize: 12, padding: '0 6px', height: 22, lineHeight: '20px' }}>
                  {record.size}
                </Tag>
                <Tag color="purple" style={{ fontSize: 12, padding: '0 6px', height: 22, lineHeight: '20px' }}>
                  {record.color}
                </Tag>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: 'center' as const,
      render: (quantity: number) => (
        <Badge count={quantity} style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: 'right' as const,
      render: (price: number) => (
        <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 120,
      align: 'right' as const,
      render: (record: OrderItem) => (
        <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
          {formatCurrency(record.price * record.quantity)}
        </Text>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orderItems}
      rowKey="product_id"
      pagination={false}
      scroll={{ x: 600 }}
    />
  );
};

export default OrderItemsTable;
