import { useState, useEffect, useMemo } from 'react';
import { Row, Col, message } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import {
  getSummary,
  getDailyData,
  getLatestOrders,
  getTopProducts,
  filterByDate,
} from '../../../../services/admin/staticService';

import StatCard from './StatCard';
import FilterControls from './FilterControls';
import RevenueChart from './RevenueChart ';
import OrderStatusChart from './OrderStatusChart';
import OrdersBarChart from './OrdersBarChart ';
import CustomersLineChart from './CustomersLineChart ';
import OrdersTable from './OrdersTable';
import TopProductsTable from './TopProductsTable';
import type { ErrorType } from '../../../../types/error/IError';
import { toast } from 'react-toastify';
import type { Dayjs } from 'dayjs';
import type { DailyStatItem, FilterByDateResponse, OrderItem, StatCardProps, SummaryResponse, TopProduct } from '../../../../types/static/IStatic';
import { useLoading } from '../../../../contexts/LoadingContext';
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
const DailyStatistics = () => {
  const [statisticType, setStatisticType] = useState<'normal' | 'dateRange'>('normal');

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyStatItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [filteredData, setFilteredData] = useState<FilterByDateResponse | null>(null);
  const { setLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [summary, daily, latestOrders, top] = await Promise.all([
          getSummary(),
          getDailyData(),
          getLatestOrders(),
          getTopProducts(),
        ]);

        setSummaryData(summary);
        setDailyData(daily);
        setOrders(latestOrders);
        setTopProducts(top);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [setLoading]);

  const currentData = useMemo(() => {
    if (statisticType === 'normal' || !filteredData) {
      const latestDay = dailyData[dailyData.length - 1];
      return {
        dailyData,
        orders: orders.slice(0, 5),
        totalRevenue: summaryData?.totalRevenue || latestDay?.revenue || 0,
        totalOrders: summaryData?.totalOrders || latestDay?.orders || 0,
        totalCustomers: summaryData?.totalCustomers || latestDay?.customers || 0,
        shippingOrders: summaryData?.shippingOrders || 0,
      };
    }
    return filteredData;
  }, [statisticType, filteredData, dailyData, orders, summaryData]);

  const statsData: StatCardProps[] = [
    {
      title: statisticType === 'normal' ? 'Doanh thu hôm nay' : 'Tổng doanh thu',
      value: currentData.totalRevenue,
      precision: 0,
      prefix: '₫',
      trend: 'up',
      trendValue: 18.3,
      icon: <DollarOutlined className="text-green-500" />,
    },
    {
      title: statisticType === 'normal' ? 'Đơn hàng hôm nay' : 'Tổng đơn hàng',
      value: currentData.totalOrders,
      precision: 0,
      prefix: '',
      trend: 'up',
      trendValue: 12.5,
      icon: <ShoppingCartOutlined className="text-blue-500" />,
    },
    {
      title: statisticType === 'normal' ? 'Khách hàng mới hôm nay' : 'Tổng khách hàng mới',
      value: currentData.totalCustomers,
      precision: 0,
      prefix: '',
      trend: 'up',
      trendValue: 8.6,
      icon: <UserOutlined className="text-purple-500" />,
    },
    {
      title: 'Đang giao hàng',
      value: currentData.shippingOrders,
      precision: 0,
      prefix: '',
      trend: 'up',
      trendValue: 3.2,
      icon: <TruckOutlined className="text-orange-500" />,
    },
  ];




  const orderStatusData = useMemo(() => {
    const statusCount: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    currentData.orders.forEach(order => {
      const status = order.status as OrderStatus;
      if (statusCount[status] !== undefined) {
        statusCount[status] += 1;
      }
    });

    return [
      { name: 'Chờ xử lý', value: statusCount.pending, color: '#faad14' },
      { name: 'Đang xử lý', value: statusCount.processing, color: '#ff9500' },
      { name: 'Đang giao', value: statusCount.shipped, color: '#1890ff' },
      { name: 'Đã giao', value: statusCount.delivered, color: '#52c41a' },
      { name: 'Đã hủy', value: statusCount.cancelled, color: '#f5222d' },
    ];
  }, [currentData.orders]);

  const handleApplyFilter = async () => {
    if (statisticType === 'dateRange') {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        message.warning('Vui lòng chọn khoảng ngày!');
        return;
      }

      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      try {
        const filtered = await filterByDate(startDate, endDate);
        setFilteredData(filtered);

        message.success(`Đã lọc dữ liệu từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
      }
    } else {
      setFilteredData(null);
      message.success('Đã chuyển về thống kê bình thường');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <FilterControls
        statisticType={statisticType}
        setStatisticType={setStatisticType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filteredData={filteredData}
        onApplyFilter={handleApplyFilter}
      />

      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} xl={16}>
          <RevenueChart
            data={currentData.dailyData}
            title={`Thống kê doanh thu theo ngày (${currentData.dailyData.length} ngày)`}
          />
        </Col>
        <Col xs={24} xl={8}>
          <OrderStatusChart data={orderStatusData} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} xl={12}>
          <OrdersBarChart data={currentData.dailyData} />
        </Col>
        <Col xs={24} xl={12}>
          <CustomersLineChart data={currentData.dailyData} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} xl={14}>
          <OrdersTable
            orders={currentData.orders}
            title={`Đơn hàng mới nhất (${currentData.orders.length} đơn)`}
          />
        </Col>
        <Col xs={24} xl={10}>
          <TopProductsTable products={topProducts} />
        </Col>
      </Row>
    </div>
  );
};

export default DailyStatistics;