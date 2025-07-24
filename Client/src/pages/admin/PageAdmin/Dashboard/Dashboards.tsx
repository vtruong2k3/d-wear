import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag, Avatar, Statistic, message } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  TruckOutlined,
  CalendarOutlined,
  FireOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DailyStatistics = () => {
  const [statisticType, setStatisticType] = useState('normal');
  const [dateRange, setDateRange] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  // Dữ liệu thống kê theo ngày (30 ngày gần nhất)
  const allDailyData = [
    { date: '2024-07-01', displayDate: '01/07', revenue: 45000000, orders: 23, customers: 15 },
    { date: '2024-07-02', displayDate: '02/07', revenue: 52000000, orders: 28, customers: 18 },
    { date: '2024-07-03', displayDate: '03/07', revenue: 48000000, orders: 25, customers: 16 },
    { date: '2024-07-04', displayDate: '04/07', revenue: 61000000, orders: 32, customers: 22 },
    { date: '2024-07-05', displayDate: '05/07', revenue: 55000000, orders: 29, customers: 19 },
    { date: '2024-07-06', displayDate: '06/07', revenue: 67000000, orders: 35, customers: 25 },
    { date: '2024-07-07', displayDate: '07/07', revenue: 58000000, orders: 31, customers: 21 },
    { date: '2024-07-08', displayDate: '08/07', revenue: 72000000, orders: 38, customers: 28 },
    { date: '2024-07-09', displayDate: '09/07', revenue: 69000000, orders: 36, customers: 26 },
    { date: '2024-07-10', displayDate: '10/07', revenue: 63000000, orders: 33, customers: 23 },
    { date: '2024-07-11', displayDate: '11/07', revenue: 75000000, orders: 41, customers: 30 },
    { date: '2024-07-12', displayDate: '12/07', revenue: 81000000, orders: 43, customers: 32 },
    { date: '2024-07-13', displayDate: '13/07', revenue: 78000000, orders: 42, customers: 31 },
    { date: '2024-07-14', displayDate: '14/07', revenue: 85000000, orders: 46, customers: 35 },
    { date: '2024-07-15', displayDate: '15/07', revenue: 92000000, orders: 48, customers: 38 },
    { date: '2024-07-16', displayDate: '16/07', revenue: 88000000, orders: 45, customers: 36 },
    { date: '2024-07-17', displayDate: '17/07', revenue: 94000000, orders: 51, customers: 41 },
    { date: '2024-07-18', displayDate: '18/07', revenue: 87000000, orders: 44, customers: 37 },
    { date: '2024-07-19', displayDate: '19/07', revenue: 91000000, orders: 49, customers: 39 },
    { date: '2024-07-20', displayDate: '20/07', revenue: 96000000, orders: 52, customers: 42 },
    { date: '2024-07-21', displayDate: '21/07', revenue: 96000000, orders: 52, customers: 42 }
  ];

  // Tất cả đơn hàng mẫu
  const allOrders = [
    {
      key: '1',
      orderId: '#ORD-001',
      customer: 'Nguyễn Văn A',
      product: 'iPhone 15 Pro Max',
      amount: 29990000,
      status: 'pending',
      date: '2024-07-20',
      displayDate: '20/07/2024'
    },
    {
      key: '2',
      orderId: '#ORD-002',
      customer: 'Trần Thị B',
      product: 'MacBook Air M2',
      amount: 24990000,
      status: 'shipped',
      date: '2024-07-20',
      displayDate: '20/07/2024'
    },
    {
      key: '3',
      orderId: '#ORD-003',
      customer: 'Lê Văn C',
      product: 'iPad Pro',
      amount: 19990000,
      status: 'delivered',
      date: '2024-07-19',
      displayDate: '19/07/2024'
    },
    {
      key: '4',
      orderId: '#ORD-004',
      customer: 'Phạm Thị D',
      product: 'AirPods Pro',
      amount: 5990000,
      status: 'pending',
      date: '2024-07-19',
      displayDate: '19/07/2024'
    },
    {
      key: '5',
      orderId: '#ORD-005',
      customer: 'Hoàng Văn E',
      product: 'Apple Watch Series 9',
      amount: 8990000,
      status: 'shipped',
      date: '2024-07-18',
      displayDate: '18/07/2024'
    },
    {
      key: '6',
      orderId: '#ORD-006',
      customer: 'Võ Thị F',
      product: 'Samsung Galaxy S24',
      amount: 21490000,
      status: 'delivered',
      date: '2024-07-18',
      displayDate: '18/07/2024'
    },
    {
      key: '7',
      orderId: '#ORD-007',
      customer: 'Đặng Văn G',
      product: 'Dell XPS 13',
      amount: 32990000,
      status: 'pending',
      date: '2024-07-17',
      displayDate: '17/07/2024'
    },
    {
      key: '8',
      orderId: '#ORD-008',
      customer: 'Bùi Thị H',
      product: 'Sony WH-1000XM5',
      amount: 7990000,
      status: 'shipped',
      date: '2024-07-17',
      displayDate: '17/07/2024'
    }
  ];

  // Top sản phẩm bán chạy
  const topProducts = [
    {
      key: '1',
      name: 'iPhone 15 Pro Max',
      category: 'Điện thoại',
      sold: 45,
      revenue: 1349550000,
      image: '📱',
      growth: 23.5
    },
    {
      key: '2',
      name: 'MacBook Air M2',
      category: 'Laptop',
      sold: 28,
      revenue: 699720000,
      image: '💻',
      growth: 18.2
    },
    {
      key: '3',
      name: 'iPad Pro 11 inch',
      category: 'Máy tính bảng',
      sold: 32,
      revenue: 639680000,
      image: '📟',
      growth: 15.8
    },
    {
      key: '4',
      name: 'AirPods Pro 2',
      category: 'Phụ kiện',
      sold: 67,
      revenue: 401330000,
      image: '🎧',
      growth: 31.2
    },
    {
      key: '5',
      name: 'Apple Watch Series 9',
      category: 'Đồng hồ thông minh',
      sold: 24,
      revenue: 215760000,
      image: '⌚',
      growth: 12.7
    },
    {
      key: '6',
      name: 'Samsung Galaxy S24',
      category: 'Điện thoại',
      sold: 19,
      revenue: 408100000,
      image: '📱',
      growth: 9.4
    }
  ];

  // Tính toán dữ liệu được lọc
  const currentData = useMemo(() => {
    if (statisticType === 'normal' || !filteredData) {
      return {
        dailyData: allDailyData.slice(-30), // 15 ngày gần nhất
        orders: allOrders.slice(0, 5), // 5 đơn hàng mới nhất
        totalRevenue: allDailyData.slice(-1)[0]?.revenue || 0,
        totalOrders: allDailyData.slice(-1)[0]?.orders || 0,
        totalCustomers: allDailyData.slice(-1)[0]?.customers || 0
      };
    }
    return filteredData;
  }, [statisticType, filteredData]);

  // Dữ liệu thống kê tổng quan
  const statsData = [
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
      trend: 'up',
      trendValue: 12.5,
      icon: <ShoppingCartOutlined className="text-blue-500" />,
    },
    {
      title: statisticType === 'normal' ? 'Khách hàng mới hôm nay' : 'Tổng khách hàng mới',
      value: currentData.totalCustomers,
      trend: 'up',
      trendValue: 8.6,
      icon: <UserOutlined className="text-purple-500" />,
    },
    {
      title: 'Đang giao hàng',
      value: 15,
      trend: 'up',
      trendValue: 3.2,
      icon: <TruckOutlined className="text-orange-500" />,
    },
  ];

  // Dữ liệu trạng thái đơn hàng
  const orderStatusData = useMemo(() => {
    const statusCount = { pending: 0, shipped: 0, delivered: 0, cancelled: 0 };
    currentData.orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    return [
      { name: 'Chờ xử lý', value: statusCount.pending, color: '#ff9500' },
      { name: 'Đang giao', value: statusCount.shipped, color: '#1890ff' },
      { name: 'Đã giao', value: statusCount.delivered, color: '#52c41a' },
      { name: 'Đã hủy', value: statusCount.cancelled || 2, color: '#f5222d' },
    ];
  }, [currentData.orders]);

  // Columns cho bảng đơn hàng
  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <span className="font-medium text-blue-600">{text}</span>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₫${amount.toLocaleString()}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Chờ xử lý' },
          shipped: { color: 'blue', text: 'Đang giao' },
          delivered: { color: 'green', text: 'Đã giao' },
        };
        return (
          <Tag color={statusConfig[status]?.color}>
            {statusConfig[status]?.text}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'displayDate',
      key: 'displayDate',
    },
  ];

  // Columns cho bảng top sản phẩm
  const productColumns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'rank',
      width: 50,
      render: (text, record, index) => (
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
      render: (text, record) => (
        <div className="flex items-center">
          <span className="text-2xl mr-3">{record.image}</span>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
      key: 'sold',
      render: (sold, record) => (
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
      render: (revenue) => (
        <span className="font-medium text-green-600">
          ₫{revenue.toLocaleString()}
        </span>
      ),
    },
  ];

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleApplyFilter = () => {
    if (statisticType === 'dateRange') {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        message.warning('Vui lòng chọn khoảng ngày!');
        return;
      }

      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      // Lọc dữ liệu theo khoảng ngày
      const filteredDailyData = allDailyData.filter(item =>
        item.date >= startDate && item.date <= endDate
      );

      const filteredOrders = allOrders.filter(order =>
        order.date >= startDate && order.date <= endDate
      );

      // Tính tổng
      const totalRevenue = filteredDailyData.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = filteredDailyData.reduce((sum, item) => sum + item.orders, 0);
      const totalCustomers = filteredDailyData.reduce((sum, item) => sum + item.customers, 0);

      setFilteredData({
        dailyData: filteredDailyData,
        orders: filteredOrders,
        totalRevenue,
        totalOrders,
        totalCustomers
      });

      message.success(`Đã lọc dữ liệu từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`);
    } else {
      setFilteredData(null);
      message.success('Đã chuyển về thống kê bình thường');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header với các điều khiển */}
      <Card className="mb-6 shadow-sm">
        <div className="flex  lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <CalendarOutlined className="text-blue-500 text-xl mr-3" />
            <h2 className="text-xl font-bold text-gray-800 !mb-0">Thống kê</h2>
            {statisticType === 'dateRange' && filteredData && (
              <Tag color="blue" className="ml-3">
                Đã lọc: {dateRange[0].format('DD/MM')} - {dateRange[1].format('DD/MM')}
              </Tag>
            )}
          </div>

          <div className="flex  sm:flex-row gap-3">
            <Select
              value={statisticType}
              onChange={setStatisticType}
              style={{ width: 200 }}
              placeholder="Chọn loại thống kê"
            >
              <Option value="normal">Thống kê bình thường</Option>
              <Option value="dateRange">Theo khoảng ngày</Option>
            </Select>

            {statisticType === 'dateRange' && (
              <RangePicker
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                value={dateRange}
              />
            )}

            <Button type="primary" onClick={handleApplyFilter}>
              Áp dụng
            </Button>
          </div>
        </div>
      </Card>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <Statistic
                    value={stat.value}
                    precision={stat.precision}
                    prefix={stat.prefix}
                    className="mb-2"
                  />
                  <div className="flex items-center">
                    {stat.trend === 'up' ? (
                      <ArrowUpOutlined className="text-green-500 mr-1" />
                    ) : (
                      <ArrowDownOutlined className="text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trendValue}%
                    </span>
                    <span className="text-gray-500 text-sm ml-1">so với kỳ trước</span>
                  </div>
                </div>
                <div className="text-3xl ml-4">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Biểu đồ thống kê */}
      <Row gutter={[16, 16]} className="mb-6">
        {/* Biểu đồ doanh thu theo ngày */}
        <Col xs={24} xl={16}>
          <Card title={`Thống kê doanh thu theo ngày (${currentData.dailyData.length} ngày)`} className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={currentData.dailyData}>
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
        </Col>

        {/* Biểu đồ trạng thái đơn hàng */}
        <Col xs={24} xl={8}>
          <Card title="Thống kê trạng thái đơn hàng" className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Đơn hàng']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ số lượng đơn hàng và khách hàng */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} xl={12}>
          <Card title="Số lượng đơn hàng theo ngày" className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={currentData.dailyData}>
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
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Khách hàng mới theo ngày" className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentData.dailyData}>
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
        </Col>
      </Row>

      {/* Đơn hàng mới nhất và Top sản phẩm */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} xl={14}>
          <Card
            title={`Đơn hàng mới nhất (${currentData.orders.length} đơn)`}
            className="shadow-sm"
            extra={<a href="#" className="text-blue-600">Xem tất cả</a>}
          >
            <Table
              columns={orderColumns}
              dataSource={currentData.orders}
              pagination={false}
              size="middle"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={10}>
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
              dataSource={topProducts}
              pagination={false}
              size="middle"
              showHeader={false}
              className="top-products-table"
            />
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .top-products-table .ant-table-tbody > tr:hover > td {
          background-color: #f8faff !important;
        }
        .top-products-table .ant-table-tbody > tr:first-child {
          background-color: #fffbf0;
        }
        .top-products-table .ant-table-tbody > tr:nth-child(2) {
          background-color: #f6f6f6;
        }
        .top-products-table .ant-table-tbody > tr:nth-child(3) {
          background-color: #fff7e6;
        }
      `}</style>
    </div>
  );
};

export default DailyStatistics;