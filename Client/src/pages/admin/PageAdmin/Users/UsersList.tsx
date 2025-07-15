import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import {
  fetchUsers,
  selectUser,
} from "../../../../redux/features/admin/userSlice";
import { Table, Tag, Button, Spin, Typography } from "antd";
import UserDetailModal from "./UserDetailModal";

const { Title } = Typography;

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, loading, selectedUser } = useSelector(
    (state: RootState) => state.userAdminSlice
  );

  useEffect(() => {
    dispatch(fetchUsers() as any); // gọi mock data
  }, [dispatch]);

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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => dispatch(selectUser(record))}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý tài khoản người dùng</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      )}
      <UserDetailModal user={selectedUser} />
    </div>
  );
};

export default UsersList;
