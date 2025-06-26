import React from 'react';
import { Layout, Row, Col, Card, Statistic, Table, Tag, Avatar } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  TruckOutlined,
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

const { Content: AntContent } = Layout;

const Content = () => {
  // Dữ liệu doanh thu theo tháng
  const revenueData = [
    { month: 'T1', revenue: 850000000, orders: 120 },
    { month: 'T2', revenue: 920000000, orders: 135 },
    { month: 'T3', revenue: 780000000, orders: 98 },
    { month: 'T4', revenue: 1100000000, orders: 156 },
    { month: 'T5', revenue: 1350000000, orders: 189 },
    { month: 'T6', revenue: 1250000000, orders: 156 },
    { month: 'T7', revenue: 1450000000, orders: 210 },
    { month: 'T8', revenue: 1320000000, orders: 178 },
    { month: 'T9', revenue: 1280000000, orders: 165 },
    { month: 'T10', revenue: 1400000000, orders: 198 },
    { month: 'T11', revenue: 1550000000, orders: 220 },
    { month: 'T12', revenue: 1650000000, orders: 245 },
  ];

  // Dữ liệu đơn hàng theo trạng thái
  const orderStatusData = [
    { name: 'Chờ xử lý', value: 45, color: '#ff9500' },
    { name: 'Đang giao', value: 89, color: '#1890ff' },
    { name: 'Đã giao', value: 156, color: '#52c41a' },
    { name: 'Đã hủy', value: 12, color: '#f5222d' },
  ];

  // Dữ liệu doanh thu 7 ngày gần nhất
  const weeklyRevenueData = [
    { day: 'CN', revenue: 45000000 },
    { day: 'T2', revenue: 52000000 },
    { day: 'T3', revenue: 48000000 },
    { day: 'T4', revenue: 61000000 },
    { day: 'T5', revenue: 55000000 },
    { day: 'T6', revenue: 67000000 },
    { day: 'T7', revenue: 58000000 },
  ];

  // Dữ liệu mẫu cho thống kê
  const statsData = [
    {
      title: 'Tổng doanh thu',
      value: 1250000000,
      precision: 0,
      prefix: '₫',
      suffix: '',
      trend: 'up',
      trendValue: 12.5,
      icon: <DollarOutlined className="text-green-500" />,
      color: 'green',
    },
    {
      title: 'Đơn hàng hôm nay',
      value: 156,
      trend: 'up',
      trendValue: 8.2,
      icon: <ShoppingCartOutlined className="text-blue-500" />,
      color: 'blue',
    },
    {
      title: 'Khách hàng mới',
      value: 32,
      trend: 'down',
      trendValue: 2.1,
      icon: <UserOutlined className="text-purple-500" />,
      color: 'purple',
    },
    {
      title: 'Đang giao hàng',
      value: 89,
      trend: 'up',
      trendValue: 15.3,
      icon: <TruckOutlined className="text-orange-500" />,
      color: 'orange',
    },
  ];

  // Dữ liệu đơn hàng mới nhất
  const recentOrders = [
    {
      key: '1',
      orderId: '#ORD-001',
      customer: 'Nguyễn Văn A',
      product: 'iPhone 15 Pro Max',
      amount: 29990000,
      status: 'pending',
      date: '2024-06-26',
    },
    {
      key: '2',
      orderId: '#ORD-002',
      customer: 'Trần Thị B',
      product: 'MacBook Air M2',
      amount: 24990000,
      status: 'shipped',
      date: '2024-06-26',
    },
    {
      key: '3',
      orderId: '#ORD-003',
      customer: 'Lê Văn C',
      product: 'iPad Pro',
      amount: 19990000,
      status: 'delivered',
      date: '2024-06-25',
    },
    {
      key: '4',
      orderId: '#ORD-004',
      customer: 'Phạm Thị D',
      product: 'AirPods Pro',
      amount: 5990000,
      status: 'pending',
      date: '2024-06-25',
    },
    {
      key: '5',
      orderId: '#ORD-005',
      customer: 'Hoàng Văn E',
      product: 'Apple Watch Series 9',
      amount: 8990000,
      status: 'shipped',
      date: '2024-06-24',
    },
  ];

  // Top khách hàng
  const topCustomers = [
    {
      key: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      orders: 23,
      totalSpent: 125000000,
      avatar: 'A',
    },
    {
      key: '2',
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      orders: 18,
      totalSpent: 89000000,
      avatar: 'B',
    },
    {
      key: '3',
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      orders: 15,
      totalSpent: 76000000,
      avatar: 'C',
    },
    {
      key: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      orders: 12,
      totalSpent: 54000000,
      avatar: 'D',
    },
    {
      key: '5',
      name: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      orders: 10,
      totalSpent: 43000000,
      avatar: 'E',
    },
  ];

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
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const customerColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar className="mr-3 bg-blue-500">{record.avatar}</Avatar>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'orders',
      key: 'orders',
      render: (orders) => <span className="font-medium">{orders}</span>,
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount) => <span className="font-medium text-green-600">₫{amount.toLocaleString()}</span>,
    },
  ];

  return (
    <AntContent className="p-6 bg-gray-50 min-h-screen">
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <Statistic
                    value={stat.value}
                    precision={stat.precision}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
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
                    <span className="text-gray-500 text-sm ml-1">so với tháng trước</span>
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
        {/* Biểu đồ doanh thu theo tháng */}
        <Col xs={24} xl={16}>
          <Card title="Thống kê doanh thu theo tháng" className="shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
          <Card title="Thống kê đơn hàng theo trạng thái" className="shadow-sm">
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

      {/* Biểu đồ doanh thu 7 ngày gần nhất */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} xl={12}>
          <Card title="Doanh thu 7 ngày gần nhất" className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                />
                <Bar dataKey="revenue" fill="#52c41a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Biểu đồ số lượng đơn hàng theo tháng */}
        <Col xs={24} xl={12}>
          <Card title="Số lượng đơn hàng theo tháng" className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, 'Đơn hàng']}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
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

      {/* Đơn hàng mới nhất và Top khách hàng */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card
            title="Đơn hàng mới nhất"
            className="shadow-sm"
            extra={<a href="#" className="text-blue-600">Xem tất cả</a>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="middle"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card
            title="Top khách hàng"
            className="shadow-sm"
            extra={<a href="#" className="text-blue-600">Xem tất cả</a>}
          >
            <Table
              columns={customerColumns}
              dataSource={topCustomers}
              pagination={false}
              size="middle"
              showHeader={false}
            />
          </Card>
        </Col>
      </Row>
    </AntContent>
  );
};

export default Content;