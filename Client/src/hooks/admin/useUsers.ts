import { useEffect, useState } from "react";
import { message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import type { UserType } from "../../types/IUser";
import type { ErrorType } from "../../types/error/IError";
import { deleteUser, fetchAllUsers } from "../../services/admin/userServices";
import { useDebounce } from "../useDebounce";

export const useUsers = () => {
  const [rows, setRows] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const [meta, setMeta] = useState<{
    currentPage: number;
    pageSize: number;
    totalPages: number;
    total: number;
    sortBy: string;
    order: "asc" | "desc";
  } | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<"admin" | "user" | undefined>();
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | undefined>();

  // Tối ưu hiệu năng bằng useDebounce
  const debouncedSearchText = useDebounce(searchText, 500);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers(current, pageSize, {
        q: debouncedSearchText.trim() || undefined,
        role: roleFilter,
        status: statusFilter,
        sortBy,
        order,
      });

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
  }, [current, pageSize, sortBy, order, debouncedSearchText, roleFilter, statusFilter]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<UserType> | SorterResult<UserType>[]
  ) => {
    setCurrent(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);

    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s?.field && s?.order) {
      setSortBy(String(s.field));
      setOrder(s.order === "ascend" ? "asc" : "desc");
    } else {
      setSortBy("createdAt");
      setOrder("desc");
    }
  };

  const handleResetFilters = () => {
    setSearchText("");
    setRoleFilter(undefined);
    setStatusFilter(undefined);
    setCurrent(1);
  };

  const handleHardDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await deleteUser(id);
      setRows((prev) => prev.filter((user) => user._id !== id));
      message.success(res.message);
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

  return {
    rows,
    meta,
    loading,
    current, setCurrent,
    pageSize, setPageSize,
    searchText, setSearchText,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    handleTableChange,
    handleResetFilters,
    handleHardDelete
  };
};
