import { Typography, Divider, Pagination } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import OrderFilter from "../../../../components/Admin/Orders/OrderFilter";
import OrderTable from "../../../../components/Admin/Orders/OrderTable";
import { useOrders } from "../../../../hooks/admin/useOrders";

const { Title, Text } = Typography;

const OrderList = () => {
  const {
    orders, loading, totalItems,
    searchText, setSearchText,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    sortTotal, setSortTotal,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    handleStatusChange, handleRefresh, clearAllFilters
  } = useOrders();

  return (
    <div style={{ padding: window.innerWidth <= 768 ? '12px' : '20px', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={window.innerWidth <= 768 ? 4 : 3} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <ShoppingCartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Quản lý đơn hàng
        </Title>
        <Text type="secondary" style={{ fontSize: window.innerWidth <= 768 ? '12px' : '14px' }}>
          Xem và quản lý tất cả đơn hàng
        </Text>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <OrderFilter
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        sortTotal={sortTotal} setSortTotal={setSortTotal}
        searchText={searchText} setSearchText={setSearchText}
        handleRefresh={handleRefresh} clearAllFilters={clearAllFilters}
      />

      <div style={{ background: '#fff', borderRadius: '8px', padding: window.innerWidth <= 768 ? '12px' : '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <OrderTable
          orders={orders}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          handleStatusChange={handleStatusChange}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            showTotal={(total) => `Tổng ${total} đơn`}
            size={window.innerWidth <= 768 ? "small" : "default"}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;