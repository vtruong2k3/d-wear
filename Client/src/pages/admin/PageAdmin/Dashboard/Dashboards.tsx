import { Row, Col, Spin } from 'antd';
import StatCard from '../../../../components/Admin/Dashboard/StatCard';
import FilterControls from '../../../../components/Admin/Dashboard/FilterControls';
import RevenueChart from '../../../../components/Admin/Dashboard/RevenueChart';
import OrderStatusChart from '../../../../components/Admin/Dashboard/OrderStatusChart';
import OrdersBarChart from '../../../../components/Admin/Dashboard/OrdersBarChart';
import CustomersLineChart from '../../../../components/Admin/Dashboard/CustomersLineChart';
import OrdersTable from '../../../../components/Admin/Dashboard/OrdersTable';
import TopProductsTable from '../../../../components/Admin/Dashboard/TopProductsTable';

import { useDashboardStats } from '../../../../hooks/admin/useDashboardStats';

const DailyStatistics = () => {
  const {
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
  } = useDashboardStats();

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
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

      <Spin spinning={isLoadingData} size="large">
        <Row gutter={[16, 16]} className="mb-6 mt-4">
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
              title={`Thống kê doanh thu (${currentData.dailyData.length} phần tử)`}
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
      </Spin>
    </div>
  );
};

export default DailyStatistics;