
import { Card } from 'antd';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { DailyStatItem } from '../../../../types/static/IStatic';
interface OrdersBarChartProps {
    data: DailyStatItem[];
    title?: string
}
const OrdersBarChart: React.FC<OrdersBarChartProps> = ({ data, title = "Số lượng đơn hàng theo ngày" }) => {
    return (
        <Card title={title} className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="displayDate" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [value, 'Đơn hàng']}
                    />
                    <Bar dataKey="orders" fill="#52c41a" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default OrdersBarChart;