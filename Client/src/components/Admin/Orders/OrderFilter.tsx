import { Card, Space, Button, Row, Col, Select, DatePicker, Input } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface OrderFilterProps {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: string) => void;
  sortTotal: string;
  setSortTotal: (v: string) => void;
  searchText: string;
  setSearchText: (v: string) => void;
  handleRefresh: () => void;
  clearAllFilters: () => void;
}

const OrderFilter = ({
  statusFilter, setStatusFilter,
  dateFilter, setDateFilter,
  sortTotal, setSortTotal,
  searchText, setSearchText,
  handleRefresh, clearAllFilters
}: OrderFilterProps) => {
  return (
    <Card
      size="small"
      title={
        <Space size="small">
          <FilterOutlined style={{ fontSize: '14px' }} />
          <span style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px' }}>
            Bộ lọc
          </span>
        </Space>
      }
      extra={
        <Space size="small">
          <Button
            onClick={clearAllFilters}
            size="small"
            style={{ borderRadius: '4px', fontSize: '12px' }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            size="small"
            style={{ borderRadius: '4px', fontSize: '12px' }}
          >
            {window.innerWidth <= 768 ? '' : 'Làm mới'}
          </Button>
        </Space>
      }
      style={{ marginBottom: 12, borderRadius: '6px' }}
    >
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Select
            placeholder="Trạng thái"
            style={{ width: '100%' }}
            allowClear
            onChange={setStatusFilter}
            value={statusFilter || undefined}
            size={window.innerWidth <= 768 ? 'small' : 'middle'}
          >
            <Option value="pending">Chờ xử lý</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="shipped">Đang giao</Option>
            <Option value="delivered">Đã giao</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6}>
          <DatePicker
            format="DD/MM/YYYY"
            onChange={(date) => {
              setDateFilter(date ? dayjs(date).format("YYYY-MM-DD") : "");
            }}
            placeholder="Ngày"
            style={{ width: '100%' }}
            size={window.innerWidth <= 768 ? 'small' : 'middle'}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={6}>
          <Select
            placeholder="Sắp xếp tiền"
            style={{ width: '100%' }}
            allowClear
            onChange={setSortTotal}
            value={sortTotal || undefined}
            size={window.innerWidth <= 768 ? 'small' : 'middle'}
          >
            <Option value="low-to-high">Thấp → Cao</Option>
            <Option value="high-to-low">Cao → Thấp</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6}>
          <Input.Search
            placeholder="Tìm kiếm"
            onSearch={(value) => setSearchText(value)}
            style={{ width: '100%' }}
            allowClear
            size={window.innerWidth <= 768 ? 'small' : 'middle'}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default OrderFilter;
