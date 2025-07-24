
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { StatCardProps } from '../../../../types/static/IStatic';

const StatCard: React.FC<StatCardProps> = ({ title, value, precision, prefix, trend, trendValue, icon }) => {
    return (
        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    <Statistic
                        value={value}
                        precision={precision}
                        prefix={prefix}
                        className="mb-2"
                    />
                    <div className="flex items-center">
                        {trend === 'up' ? (
                            <ArrowUpOutlined className="text-green-500 mr-1" />
                        ) : (
                            <ArrowDownOutlined className="text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {trendValue}%
                        </span>
                        <span className="text-gray-500 text-sm ml-1">so với kỳ trước</span>
                    </div>
                </div>
                <div className="text-3xl ml-4">
                    {icon}
                </div>
            </div>
        </Card>
    );
};

export default StatCard;