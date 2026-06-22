import { Space, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserDetailModal from "./UserDetailModal";
import UserFilter from "../../../../components/Admin/Users/UserFilter";
import UserTable from "../../../../components/Admin/Users/UserTable";
import { useUsers } from "../../../../hooks/admin/useUsers";

const { Title } = Typography;

const UsersList = () => {
  const navigate = useNavigate();

  const {
    rows,
    meta,
    loading,
    current, setCurrent,
    pageSize,
    searchText, setSearchText,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    handleTableChange,
    handleResetFilters,
    handleHardDelete
  } = useUsers();

  const handleAddUser = () => navigate("/admin/users/add");

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3}>
          Quản lý tài khoản người dùng
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <UserFilter
        searchText={searchText} setSearchText={setSearchText}
        roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        setCurrent={setCurrent}
        handleResetFilters={handleResetFilters}
        totalUsers={meta?.total ?? 0}
      />

      <UserTable
        rows={rows}
        loading={loading}
        current={current}
        pageSize={pageSize}
        total={meta?.total ?? 0}
        handleTableChange={handleTableChange}
        handleHardDelete={handleHardDelete}
      />

      <UserDetailModal />
    </div>
  );
};

export default UsersList;
