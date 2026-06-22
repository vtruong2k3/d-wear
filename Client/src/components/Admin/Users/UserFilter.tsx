import { Card, Row, Col, Input, Select, Button, Space } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

interface UserFilterProps {
  searchText: string;
  setSearchText: (v: string) => void;
  roleFilter: "admin" | "user" | undefined;
  setRoleFilter: (v: "admin" | "user" | undefined) => void;
  statusFilter: "active" | "inactive" | undefined;
  setStatusFilter: (v: "active" | "inactive" | undefined) => void;
  setCurrent: (v: number) => void;
  handleResetFilters: () => void;
  totalUsers: number;
}

const UserFilter = ({
  searchText, setSearchText,
  roleFilter, setRoleFilter,
  statusFilter, setStatusFilter,
  setCurrent,
  handleResetFilters,
  totalUsers
}: UserFilterProps) => {
  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <Space>
          <FilterOutlined />
          Tìm kiếm & lọc
        </Space>
      }
      size="small"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Tìm theo tên hoặc email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrent(1);
            }}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Vai trò"
            style={{ width: "100%" }}
            value={roleFilter}
            onChange={(v) => {
              setRoleFilter(v);
              setCurrent(1);
            }}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Trạng thái"
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setCurrent(1);
            }}
            allowClear
          >
            <Option value="active">Kích hoạt</Option>
            <Option value="inactive">Đã khoá</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button onClick={handleResetFilters} style={{ width: "100%" }}>
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: 12, color: "#666" }}>
        Tổng số người dùng: {totalUsers}
      </div>
    </Card>
  );
};

export default UserFilter;
