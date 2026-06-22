import { useMemo } from "react";
import { Table, Tag, Tooltip, Space, Button, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import type { UserType } from "../../../types/IUser";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../redux/store";
import { getUserDetail } from "../../../redux/features/admin/thunks/userAdminThunk";

interface UserTableProps {
  rows: UserType[];
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  handleTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<UserType> | SorterResult<UserType>[]
  ) => void;
  handleHardDelete: (id: string) => void;
}

const UserTable = ({
  rows,
  loading,
  current,
  pageSize,
  total,
  handleTableChange,
  handleHardDelete
}: UserTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleEditUser = (user: UserType) => navigate(`/admin/users/edit/${user._id}`);

  // Tối ưu hiệu năng bằng useMemo
  const columns: ColumnsType<UserType> = useMemo(() => [
    {
      title: "Tên",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => <Tag color={role === "admin" ? "volcano" : "blue"}>{role}</Tag>,
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
      title: "Google Account",
      dataIndex: "isGoogleAccount",
      render: (isGoogleAccount: boolean) => (
        <Tooltip
          title={
            isGoogleAccount
              ? "Tài khoản được đăng nhập bằng Google"
              : "Tài khoản đăng ký thông thường"
          }
        >
          <Tag
            icon={isGoogleAccount ? <CheckCircleOutlined /> : <UserOutlined />}
            color={isGoogleAccount ? "blue" : "default"}
          >
            {isGoogleAccount ? "Google" : "Thường"}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 200,
      render: (_: unknown, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => dispatch(getUserDetail(record._id))}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              size="small"
            />
          </Tooltip>

          {record.role !== "admin" && (
            <Popconfirm
              title="Xóa tài khoản"
              description="Bạn có chắc chắn muốn xóa tài khoản này?"
              onConfirm={() => handleHardDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ], [dispatch, handleEditUser, handleHardDelete]);

  return (
    <Table<UserType>
      rowKey="_id"
      loading={loading}
      dataSource={rows}
      columns={columns}
      onChange={handleTableChange}
      scroll={{ x: 1200 }}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
        showQuickJumper: true,
        showTotal: (t, range) => `${range[0]}-${range[1]} của ${t} người dùng`,
      }}
    />
  );
};

export default UserTable;
