import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  restoreUser,
  getUserDetail,
  softDeleteUser,
  type UserType,
} from "../../../../redux/features/admin/userSlice";
import { EyeOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Spin, Switch, Table, Tag } from "antd";
// import Title from "antd/es/skeleton/Title";
import { Typography } from "antd";
const { Title } = Typography;
import UserDetailModal from "./UserDetailModal";
import type { RootState } from "../../../../redux/store";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, loading, selectedUser } = useSelector(
    (state: RootState) => state.userAdminSlice
  );

  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);

  // Lọc user theo trạng thái
  const filteredUsers = users.filter((user) =>
    showDeleted ? user.isDeleted : !user.isDeleted
  );

  const handleSoftDelete = (userId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      onOk: () => {
        dispatch(softDeleteUser(userId) as any);
        message.success("Đã xóa người dùng thành công!");
      },
    });
  };

  const handleRestore = (userId: string) => {
    dispatch(restoreUser(userId) as any);
    message.success("Đã khôi phục người dùng thành công!");
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "volcano" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "isDeleted",
      render: (isDeleted: boolean) => (
        <Tag color={isDeleted ? "red" : "green"}>
          {isDeleted ? "Đã xóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_: any, record: UserType) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => dispatch(getUserDetail(record._id) as any)}
          >
            Xem chi tiết
          </Button>
          {!showDeleted ? (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleSoftDelete(record._id)}
            >
              Xóa
            </Button>
          ) : (
            <Button
              type="link"
              icon={<UndoOutlined />}
              onClick={() => handleRestore(record._id)}
            >
              Khôi phục
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
          {showDeleted ? "Người dùng đã xóa" : "Quản lý tài khoản người dùng"}
        </Title>
        <Space>
          <span>Hiển thị người dùng đã xóa:</span>
          <Switch
            checked={showDeleted}
            onChange={setShowDeleted}
            checkedChildren="Đã xóa"
            unCheckedChildren="Hoạt động"
          />
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      )}
      <UserDetailModal />
    </div>
  );
};

export default UsersList;
