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
  filterByWeek,
  summaryByYear,
  getTopProductsByDate,

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

import type { Dayjs } from 'dayjs';
import type { DailyStatItem, FilterByDateResponse, OrderItem, StatCardProps, SummaryResponse, TopProduct } from '../../../../types/static/IStatic';
import { useLoading } from '../../../../contexts/LoadingContext';
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import utc from "dayjs/plugin/utc";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
const DailyStatistics = () => {
  const [statisticType, setStatisticType] = useState<'normal' | 'dateRange' | 'week' | 'year'>('normal');


  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyStatItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [filteredData, setFilteredData] = useState<FilterByDateResponse | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  // const [orderStatus, setOrderStatusData] = useState<OrderStatusStat[]>([]);

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
        message.error(errorMessage);
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




  // const orderStatusData = useMemo(() => {
  //   const statusCount: Record<OrderStatus, number> = {
  //     pending: 0,
  //     processing: 0,
  //     shipped: 0,
  //     delivered: 0,
  //     cancelled: 0,
  //   };

  //   currentData.orders.forEach(order => {
  //     const status = order.status as OrderStatus;
  //     if (statusCount[status] !== undefined) {
  //       statusCount[status] += 1;
  //     }
  //   });

  //   return [
  //     { name: 'Chờ xử lý', value: statusCount.pending, color: '#faad14' },
  //     { name: 'Đang xử lý', value: statusCount.processing, color: '#ff9500' },
  //     { name: 'Đang giao', value: statusCount.shipped, color: '#1890ff' },
  //     { name: 'Đã giao', value: statusCount.delivered, color: '#52c41a' },
  //     { name: 'Đã hủy', value: statusCount.cancelled, color: '#f5222d' },
  //   ];
  // }, [currentData.orders]);
  const orderStatusData = useMemo(() => {
    const statusMap: Record<OrderStatus, { label: string; color: string }> = {
      pending: { label: "Chờ xử lý", color: "#faad14" },
      processing: { label: "Đang xử lý", color: "#ff9500" },
      shipped: { label: "Đang giao", color: "#1890ff" },
      delivered: { label: "Đã giao", color: "#52c41a" },
      cancelled: { label: "Đã hủy", color: "#f5222d" },
    };

    const isFiltered = ["dateRange", "week", "year"].includes(statisticType);
    const ordersToUse = isFiltered && filteredData?.orders ? filteredData.orders : orders;

    const statusCount: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    ordersToUse.forEach((order) => {
      const status = order.status as OrderStatus;
      if (status in statusCount) {
        statusCount[status]++;
      }
    });

    return (Object.entries(statusCount) as [OrderStatus, number][]).map(
      ([key, value]) => ({
        name: key,
        value,
        label: statusMap[key].label,
        color: statusMap[key].color,
      })
    );
  }, [statisticType, filteredData, orders]);



  const handleApplyFilter = async () => {
    if (statisticType === 'dateRange') {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        message.warning('Vui lòng chọn khoảng ngày!');
        return;
      }

      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        const [filtered, top] = await Promise.all([
          filterByDate(startDate, endDate),
          getTopProductsByDate(startDate, endDate),
        ]);

        setFilteredData(filtered);
        setTopProducts(top);

        message.success(`Đã lọc từ ${dateRange[0].format('DD/MM')} đến ${dateRange[1].format('DD/MM')}`);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      }

    } else if (statisticType === 'week') {
      if (!selectedWeek || !selectedYear) {
        message.warning('Vui lòng chọn tuần và năm!');
        return;
      }

      try {
        const [filtered, top] = await Promise.all([
          filterByWeek(selectedYear, selectedWeek),
          getTopProductsByDate(
            // Tuần bắt đầu từ thứ 2
            dayjs().year(selectedYear).week(selectedWeek).startOf('week').add(1, 'day').format('YYYY-MM-DD'),
            dayjs().year(selectedYear).week(selectedWeek).endOf('week').add(1, 'day').format('YYYY-MM-DD')
          )
        ]);

        setFilteredData(filtered);
        setTopProducts(top);
        message.success(`Đã lọc tuần ${selectedWeek}, năm ${selectedYear}`);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      }

    } else if (statisticType === 'year') {
      if (!selectedYear) {
        message.warning('Vui lòng chọn năm!');
        return;
      }

      try {
        const result = await summaryByYear(selectedYear);
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;

        const top = await getTopProductsByDate(startDate, endDate);

        const mappedData: DailyStatItem[] = result.map((item) => ({
          date: `${selectedYear}-${String(item.month).padStart(2, '0')}`,
          displayDate: `Tháng ${item.month}`,
          revenue: item.revenue,
          orders: item.orders,
          customers: item.customers,
        }));

        setFilteredData({
          totalRevenue: result.reduce((s, i) => s + i.revenue, 0),
          totalOrders: result.reduce((s, i) => s + i.orders, 0),
          totalCustomers: result.reduce((s, i) => s + i.customers, 0),
          shippingOrders: 0,
          dailyData: mappedData,
          orders: [],
        });

        setTopProducts(top);
        message.success(`Đã lọc theo năm ${selectedYear}`);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      }
    } else {
      setFilteredData(null);

      try {
        const top = await getTopProducts(); // gọi lại top mặc định
        setTopProducts(top);
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      }

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
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
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