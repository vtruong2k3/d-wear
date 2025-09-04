
import { Card, Statistic } from 'antd';

import type { StatCardProps } from '../../../../types/static/IStatic';


const StatCard: React.FC<StatCardProps> = ({ title, value, precision, prefix, icon }) => {
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

                </div>
                <div className="text-3xl ml-4">
                    {icon}
                </div>
            </div>
        </Card>
    );
};

export default StatCard;