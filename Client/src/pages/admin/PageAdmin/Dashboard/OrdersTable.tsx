
import { Card, Table, Tag } from 'antd';
import { formatCurrency } from '../../../../utils/Format';
import type { OrderItem } from '../../../../types/static/IStatic';
import { Link } from 'react-router-dom';
interface OrdersTableProps {
    title: string;
    orders: OrderItem[];
}
const OrdersTable: React.FC<OrdersTableProps> = ({ orders, title }) => {
    const orderColumns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'order_code',
            key: 'order_code',
            render: (text: string, record: OrderItem) => <Link to={`/admin/orders/${record.orderId}`}><span className="font-medium text-blue-600">{text}</span></Link>,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => formatCurrency(amount),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig: Record<string, { color: string; text: string }> = {
                    pending: { color: 'orange', text: 'Chờ xử lý' },
                    shipped: { color: 'blue', text: 'Đang giao' },
                    delivered: { color: 'green', text: 'Đã giao' },
                    cancelled: { color: 'red', text: 'Đã hủy' }, // nếu có trạng thái này
                };

                const config = statusConfig[status] || { color: 'gray', text: 'Không rõ' };

                return (
                    <Tag color={config.color}>
                        {config.text}
                    </Tag>
                );
            },

        },
        {
            title: 'Ngày đặt',
            dataIndex: 'displayDate',
            key: 'displayDate',
        },
    ];

    return (
        <Card
            title={title}
            className="shadow-sm"
            extra={<Link to={"/admin/orders"} className="text-blue-600">Xem tất cả</Link>}
        >
            <Table
                columns={orderColumns}
                dataSource={orders}
                pagination={false}
                size="middle"
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

export default OrdersTable;