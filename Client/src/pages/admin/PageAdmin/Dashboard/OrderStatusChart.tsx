
import { Card } from 'antd';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
// ✅ Khai báo kiểu cho mỗi mục trong biểu đồ
interface OrderStatusItem {
    name: string;
    value: number;
    color: string;
}

// ✅ Khai báo kiểu props
interface OrderStatusChartProps {
    data: OrderStatusItem[];
    title?: string;
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data, title = "Thống kê trạng thái đơn hàng" }) => {

    const filteredData = data.filter(item => item.value > 0);

    return (
        <Card title={title} className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={filteredData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                            percent !== undefined ? `${name}: ${(percent * 100).toFixed(0)}%` : name
                        }
                    >
                        {filteredData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Đơn hàng']} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};


export default OrderStatusChart;