import React from 'react';
import type { TypeStatus } from '../../../../types/IReview';
import { Card, Col, Row } from 'antd';
import { MessageOutlined, CheckCircleOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';

interface Props {
    stats: TypeStatus | null;
}

const ReviewStatsCards: React.FC<Props> = ({ stats }) => {
    const statItems = [
        {
            title: 'Tổng bình luận',
            value: stats?.total || 0,
            icon: <MessageOutlined className="text-2xl text-blue-600" />,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700'
        },
        {
            title: 'Đã duyệt',
            value: stats?.approved || 0,
            icon: <CheckCircleOutlined className="text-2xl text-green-600" />,
            bgColor: 'bg-green-100',
            textColor: 'text-green-700'
        },
        {
            title: 'Chờ duyệt',
            value: stats?.notApproved || 0,
            icon: <ClockCircleOutlined className="text-2xl text-orange-600" />,
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-700'
        },
        {
            title: 'Đánh giá trung bình',
            value: stats?.avgRating ? Number(stats.avgRating).toFixed(1) : '0.0',
            suffix: '/ 5',
            icon: <StarOutlined className="text-2xl text-yellow-600" />,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700'
        }
    ];

    return (
        <div className="mb-6">
            <Row gutter={[24, 24]}>
                {statItems.map((item, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card 
                            bordered={false} 
                            className="h-full rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100/50"
                            styles={{ body: { padding: '24px' } }}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bgColor} shadow-sm`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-500 mb-1">
                                        {item.title}
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <h3 className={`text-3xl font-black m-0 tracking-tight ${item.textColor}`}>
                                            {item.value}
                                        </h3>
                                        {item.suffix && <span className="text-sm font-bold text-gray-400">{item.suffix}</span>}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ReviewStatsCards;
