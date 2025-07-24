
import { Card } from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { DailyStatItem } from '../../../../types/static/IStatic';
interface CustomersLineChartProps {
    data: DailyStatItem[];
    title?: string;
    height?: number;
}

const CustomersLineChart: React.FC<CustomersLineChartProps> = ({ data, title = "Khách hàng mới theo ngày" }) => {
    return (
        <Card title={title} className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="displayDate" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [value, 'Khách hàng mới']}
                    />
                    <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#ff7300"
                        strokeWidth={3}
                        dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default CustomersLineChart;