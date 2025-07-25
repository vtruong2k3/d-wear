
import { Card, Image, Table } from 'antd';
import { ArrowUpOutlined, FireOutlined } from '@ant-design/icons';
import type { TopProduct } from '../../../../types/static/IStatic';
import { formatCurrency } from '../../../../utils/Format';
import '../../../../styles/TopProduct.css'
interface TopProductsTableProps {
    products: TopProduct[];
}
const TopProductsTable: React.FC<TopProductsTableProps> = ({ products }) => {
    const productColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'rank',
            width: 50,
            render: (_text: string, _record: TopProduct, index: number) => (
                <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {index + 1}
                    </span>
                </div>
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: TopProduct) => {
                const getImageSrc = () => {
                    if (record.image) {
                        return record.image.startsWith('http')
                            ? record.image
                            : `http://localhost:5000/${record.image.replace(/\\/g, '/')}`;
                    }
                    return 'https://via.placeholder.com/48'; // fallback mặc định
                };

                return (
                    <div className="flex items-center">
                        <Image
                            src={getImageSrc()}
                            alt={text}
                            width={48}
                            height={48}
                            className="mr-3 rounded-lg object-cover"
                            preview={false}
                            fallback="https://via.placeholder.com/48"
                        />
                        <div>
                            <div className="font-medium text-gray-900 ml-3">{text}</div>
                        </div>
                    </div>
                );
            },
        },

        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
            render: (sold: number, record: TopProduct) => (
                <div className="text-center">
                    <div className="font-bold text-lg">{sold}</div>
                    <div className="flex items-center justify-center mt-1">
                        <ArrowUpOutlined className="text-green-500 text-xs mr-1" />
                        <span className="text-xs text-green-500">{record.growth}%</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue: number) => (
                <span className="font-medium text-green-600">
                    {formatCurrency(revenue)}
                </span>
            ),
        },
    ];

    return (
        <>
            <Card
                title={
                    <div className="flex items-center">
                        <FireOutlined className="text-red-500 mr-2" />
                        <span>Top sản phẩm bán chạy</span>
                    </div>
                }
                className="shadow-sm"
                extra={<a href="#" className="text-blue-600">Xem chi tiết</a>}
            >
                <Table
                    columns={productColumns}
                    dataSource={products}
                    pagination={false}
                    size="middle"
                    showHeader={false}
                    className="top-products-table"
                />
            </Card>


        </>
    );
};

export default TopProductsTable;