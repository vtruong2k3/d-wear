import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import weekOfYear from "dayjs/plugin/weekOfYear";
import utc from "dayjs/plugin/utc";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import React from 'react';

import {
  getSummary,
  getDailyData,
  getLatestOrders,
  getTopProducts,
  filterByDate,
  filterByWeek,
  summaryByYear,
  getTopProductsByDate,
} from '../../services/admin/staticService';
import type { ErrorType } from '../../types/error/IError';
import type { DailyStatItem, FilterByDateResponse, OrderItem, StatCardProps, SummaryResponse, TopProduct } from '../../types/static/IStatic';
import { formatCurrency } from '../../utils/Format';

dayjs.extend(weekOfYear);
dayjs.extend(utc);

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type StatisticType = 'normal' | 'dateRange' | 'week' | 'year';

export const useDashboardStats = () => {
  const [statisticType, setStatisticType] = useState<StatisticType>('normal');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyStatItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  
  const [filteredData, setFilteredData] = useState<FilterByDateResponse | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
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
        const errorMessage = (error as ErrorType).response?.data?.message || (error as ErrorType).message || "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Compute current data to display
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

  // Compute stats for StatCards
  const statsData: StatCardProps[] = useMemo(() => [
    {
      title: statisticType === 'normal' ? 'Doanh thu hôm nay' : 'Tổng doanh thu',
      value: formatCurrency(currentData.totalRevenue),
      prefix: '',
      precision: 0,
      trend: 'up',
      trendValue: 18.3,
      icon: React.createElement(DollarOutlined, { className: "text-green-500" }),
    },
    {
      title: statisticType === 'normal' ? 'Đơn hàng hôm nay' : 'Tổng đơn hàng',
      value: currentData.totalOrders,
      precision: 0,
      prefix: '',
      trend: 'up',
      trendValue: 12.5,
      icon: React.createElement(ShoppingCartOutlined, { className: "text-blue-500" }),
    },
    {
      title: statisticType === 'normal' ? 'Khách hàng mới hôm nay' : 'Tổng khách hàng mới',
      value: currentData.totalCustomers,
      precision: 0,
      prefix: '',
      trend: 'up',
      trendValue: 8.6,
      icon: React.createElement(UserOutlined, { className: "text-purple-500" }),
    },
    {
      title: 'Đang giao hàng',
      value: currentData.shippingOrders,
      precision: 0,
      prefix: '',
      trend: 'up',
      trendValue: 3.2,
      icon: React.createElement(TruckOutlined, { className: "text-orange-500" }),
    },
  ], [statisticType, currentData]);

  // Compute order statuses
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
        name: statusMap[key].label,
        value,
        code: key,
        color: statusMap[key].color,
      })
    );
  }, [statisticType, filteredData, orders]);

  // Handle Apply Filter
  const handleApplyFilter = async () => {
    if (statisticType === 'dateRange') {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        message.warning('Vui lòng chọn khoảng ngày!');
        return;
      }
      setIsLoadingData(true);
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
        const errorMessage = (error as ErrorType).response?.data?.message || (error as ErrorType).message || "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      } finally { setIsLoadingData(false); }

    } else if (statisticType === 'week') {
      if (!selectedWeek || !selectedYear) {
        message.warning('Vui lòng chọn tuần và năm!');
        return;
      }
      setIsLoadingData(true);
      try {
        const [filtered, top] = await Promise.all([
          filterByWeek(selectedYear, selectedWeek),
          getTopProductsByDate(
            dayjs().year(selectedYear).week(selectedWeek).startOf('week').add(1, 'day').format('YYYY-MM-DD'),
            dayjs().year(selectedYear).week(selectedWeek).endOf('week').add(1, 'day').format('YYYY-MM-DD')
          )
        ]);
        setFilteredData(filtered);
        setTopProducts(top);
        message.success(`Đã lọc tuần ${selectedWeek}, năm ${selectedYear}`);
      } catch (error) {
        const errorMessage = (error as ErrorType).response?.data?.message || (error as ErrorType).message || "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      } finally { setIsLoadingData(false); }

    } else if (statisticType === 'year') {
      if (!selectedYear) {
        message.warning('Vui lòng chọn năm!');
        return;
      }
      setIsLoadingData(true);
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
        const errorMessage = (error as ErrorType).response?.data?.message || (error as ErrorType).message || "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      } finally { setIsLoadingData(false); }

    } else {
      setFilteredData(null);
      setIsLoadingData(true);
      try {
        const top = await getTopProducts(); 
        setTopProducts(top);
        message.success('Đã chuyển về thống kê bình thường');
      } catch (error) {
        const errorMessage = (error as ErrorType).response?.data?.message || (error as ErrorType).message || "Đã xảy ra lỗi, vui lòng thử lại.";
        message.error(errorMessage);
      } finally { setIsLoadingData(false); }
    }
  };

  return {
    statisticType, setStatisticType,
    dateRange, setDateRange,
    selectedWeek, setSelectedWeek,
    selectedYear, setSelectedYear,
    isLoadingData,
    statsData,
    currentData,
    orderStatusData,
    topProducts,
    handleApplyFilter,
    filteredData
  };
};
