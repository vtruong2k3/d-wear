
import { Card } from 'antd';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { DailyStatItem } from '../../../../types/static/IStatic';
interface RevenueChartProps {
    data: DailyStatItem[];
    title?: string;
}
const RevenueChart: React.FC<RevenueChartProps> = ({ data, title }) => {
    return (
        <Card title={title} className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="displayDate" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip
                        formatter={(value) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                        labelStyle={{ color: '#000' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1890ff"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default RevenueChart;