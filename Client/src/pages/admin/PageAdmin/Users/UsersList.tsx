import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {

  restoreUser,

  softDeleteUser,

} from "../../../../redux/features/admin/userSlice";
import { EyeOutlined, DeleteOutlined, UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Switch, Table, Tag, Tooltip, type TablePaginationConfig } from "antd";
// import Title from "antd/es/skeleton/Title";
import { Typography } from "antd";
const { Title } = Typography;
import UserDetailModal from "./UserDetailModal";
import type { AppDispatch, RootState } from "../../../../redux/store";
import type { UserType } from "../../../../types/IUser";
import { fetchUsers, getUserDetail } from "../../../../redux/features/admin/thunks/userAdminThunk";


const UsersList = () => {
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector(
    (state: RootState) => state.userAdminSlice
  );

  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const { current, pageSize } = pagination;
    dispatch(fetchUsers({ page: current, limit: pageSize }));
  }, [dispatch, pagination]);
  useEffect(() => {
    const { current, pageSize } = pagination;

    setLoadingLocal(true);
    dispatch(fetchUsers({ page: current, limit: pageSize }))
      .finally(() => {
        setLoadingLocal(false);
      });
  }, [dispatch, pagination]);
  // Lọc user theo trạng thái
  const filteredUsers = users.filter((user) =>
    showDeleted ? user.isDeleted : !user.isDeleted
  );
  const handleTableChange = (
    pagination: TablePaginationConfig,

  ) => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;

    setPagination({
      current,
      pageSize,
      total: pagination.total || 0,
    });

    dispatch(fetchUsers({
      page: current,
      limit: pageSize,
    }));
  };


  const handleSoftDelete = (_id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      onOk: () => {
        dispatch(softDeleteUser(_id));
        message.success("Đã xóa người dùng thành công!");
      },
    });
  };

  const handleRestore = (_id: string) => {
    dispatch(restoreUser(_id));
    message.success("Đã khôi phục người dùng thành công!");
  };

  const columns = [
    { title: "Tên", dataIndex: "username" },
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
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <Tooltip title={isActive ? "Tài khoản đang hoạt động" : "Đã bị khoá"}>
          <Tag
            icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={isActive ? "green" : "red"}
          >
            {isActive ? "Kích Hoạt" : "Đã Khoá"}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "isDeleted",
      render: (isDeleted: boolean) => (
        <Tooltip title={isDeleted ? "Đã bị xóa khỏi hệ thống" : "Vẫn còn trong hệ thống"}>
          <Tag
            icon={isDeleted ? <DeleteOutlined /> : <CheckCircleOutlined />}
            color={isDeleted ? "red" : "green"}
          >
            {isDeleted ? "Đã xóa" : "Hoạt động"}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_: UserType, record: UserType) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => dispatch(getUserDetail(record._id))}
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


      <Table
        loading={loading || loadingLocal}
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
      />

      <UserDetailModal />
    </div>
  );
};

export default UsersList;
