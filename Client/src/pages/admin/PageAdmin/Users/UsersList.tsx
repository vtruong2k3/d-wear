import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  restoreUser,
  softDeleteUser,
} from "../../../../redux/features/admin/userSlice";
import {
  EyeOutlined,
  DeleteOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined
} from "@ant-design/icons";
import {
  Button,
  message,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Input,
  Select,
  Card,
  Row,
  Col,
  Typography
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import UserDetailModal from "./UserDetailModal";
import type { AppDispatch } from "../../../../redux/store";
import type { UserType } from "../../../../types/IUser";
import { getUserDetail } from "../../../../redux/features/admin/thunks/userAdminThunk";


import { fetchAllUsers } from "../../../../services/admin/userServices";
import type { ErrorType } from "../../../../types/error/IError";

const { Title } = Typography;
const { Option } = Select;

const UsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Dữ liệu + trạng thái tải
  const [rows, setRows] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  // Meta từ backend
  const [meta, setMeta] = useState<{
    currentPage: number;
    pageSize: number;
    totalPages: number;
    total: number;
    sortBy: string;
    order: "asc" | "desc";
  } | null>(null);

  // Phân trang + sort
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Bộ lọc & tìm kiếm
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<"admin" | "user" | undefined>();
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | undefined>();

  // (Tuỳ chọn) xem đã xoá — chỉ hoạt động nếu BE hỗ trợ param includeDeleted/deletedOnly
  const [showDeleted, setShowDeleted] = useState(false);

  // Debounce nhẹ cho search
  const q = useMemo(() => searchText.trim(), [searchText]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers(
        current,
        pageSize,
        {
          q: q || undefined,
          role: roleFilter,
          status: statusFilter,
          sortBy,
          order,

        }
      );


      setRows(res.data);
      setMeta(res.meta);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, sortBy, order, q, roleFilter, statusFilter, showDeleted]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<UserType> | SorterResult<UserType>[],

  ) => {
    setCurrent(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);

    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s?.field && s?.order) {
      setSortBy(String(s.field));
      setOrder(s.order === 'ascend' ? 'asc' : 'desc');
    } else {
      // reset mặc định khi bỏ sort
      setSortBy('createdAt');
      setOrder('desc');
    }
  };

  // Reset filter
  const handleResetFilters = () => {
    setSearchText("");
    setRoleFilter(undefined);
    setStatusFilter(undefined);
    setCurrent(1);
  };

  // Điều hướng
  const handleAddUser = () => navigate("/admin/users/add");
  const handleEditUser = (user: UserType) => navigate(`/admin/users/edit/${user._id}`);

  // Soft delete / restore (gọi action Redux có sẵn)
  const handleSoftDelete = (_id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      onOk: async () => {
        await dispatch(softDeleteUser(_id));
        message.success("Đã xóa người dùng thành công!");
        fetchList();
      },
    });
  };

  const handleRestore = async (_id: string) => {
    await dispatch(restoreUser(_id));
    message.success("Đã khôi phục người dùng thành công!");
    fetchList();
  };

  const columns: ColumnsType<UserType> = [
    {
      title: "Tên",
      dataIndex: "username",
      sorter: true, // để antd phát sorter; BE xử lý sortBy/order
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
      dataIndex: "isGoogleAccount", // đúng schema
      render: (isGoogleAccount: boolean) => (
        <Tooltip
          title={
            isGoogleAccount
              ? "Tài khoản được đăng nhập bằng Google"
              : "Tài khoản đăng ký thông thường"
          }
        >
          <Tag
            icon={isGoogleAccount ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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
            !showDeleted ? (
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleSoftDelete(record._id)}
                  size="small"
                />
              </Tooltip>
            ) : (
              <Tooltip title="Khôi phục">
                <Button
                  type="text"
                  icon={<UndoOutlined />}
                  onClick={() => handleRestore(record._id)}
                  size="small"
                />
              </Tooltip>
            )
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
          {showDeleted ? "Người dùng đã xoá" : "Quản lý tài khoản người dùng"}
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
            disabled={showDeleted} // không cho thêm khi đang xem danh sách đã xoá
          >
            Thêm người dùng
          </Button>

          {/* Chỉ hoạt động khi BE hỗ trợ includeDeleted/deletedOnly */}
          <span>Hiển thị đã xoá:</span>
          <Switch
            checked={showDeleted}
            onChange={setShowDeleted}
            checkedChildren="Đã xóa"
            unCheckedChildren="Hoạt động"
          />
        </Space>
      </div>

      {/* Tìm kiếm & lọc (đẩy lên server) */}
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
          Tổng số người dùng: {meta?.total ?? 0}
        </div>
      </Card>

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
          total: meta?.total ?? 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showQuickJumper: true,
          showTotal: (t, range) => `${range[0]}-${range[1]} của ${t} người dùng`,
        }}
      />

      <UserDetailModal />
    </div>
  );
};

export default UsersList;
