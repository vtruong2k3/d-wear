import { useCallback, useEffect, useState } from "react";
import { message, Modal } from "antd";
import socket from "../../sockets/socket";
import type { IOrder } from "../../types/order/IOrder";
import type { ErrorType } from "../../types/error/IError";
import { fetchGetAllOrder, updateOrderStatus } from "../../services/admin/orderService";
import { getStatusLabel } from "../../utils/Status";

export const useOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortTotal, setSortTotal] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchGetAllOrder({
        page: currentPage,
        limit: pageSize,
        q: searchText || undefined,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
        sort: sortTotal || undefined,
      });
      setOrders(response.orders || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter, currentPage, pageSize, searchText, sortTotal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimize Socket: Only join "admin" room once.
  useEffect(() => {
    socket.emit("joinRoom", "admin");

    const onNewOrder = ({ orders: newOrder }: { orders: IOrder }) => {
      setOrders((prev) => [newOrder, ...prev]);
    };

    const onOrderPaid = ({ orderId, paymentStatus }: { orderId: string, paymentStatus: string }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus } as IOrder : order
        )
      );
    };

    const onCancelOrder = ({ orderId, status }: { orderId: string, status: string, order_code: string }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } as IOrder : order
        )
      );
    };

    const onOrderStatusUpdate = ({ orderId, status }: { orderId: string, status: string }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } as IOrder : order
        )
      );
    };

    socket.on("newOrder", onNewOrder);
    socket.on("orderPaid", onOrderPaid);
    socket.on("cancelOrder", onCancelOrder);
    socket.on("orderStatusUpdate", onOrderStatusUpdate);

    return () => {
      socket.off("newOrder", onNewOrder);
      socket.off("orderPaid", onOrderPaid);
      socket.off("cancelOrder", onCancelOrder);
      socket.off("orderStatusUpdate", onOrderStatusUpdate);
      socket.emit("leaveRoom", "admin");
    };
  }, []);

  const handleStatusChange = useCallback((orderId: string, newStatus: IOrder["status"]) => {
    Modal.confirm({
      title: 'Xác nhận thay đổi trạng thái',
      content: `Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái "${getStatusLabel(newStatus)}"? Việc này có thể sẽ gửi email thông báo cho khách hàng.`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          await updateOrderStatus(orderId, newStatus);
          const updatedOrders = orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          );
          setOrders(updatedOrders);
          if (newStatus === "delivered") {
            fetchData();
          }
          message.success(`Đã cập nhật trạng thái đơn hàng thành "${getStatusLabel(newStatus)}"`);
        } catch (error) {
          const errorMessage =
            (error as ErrorType).response?.data?.message ||
            (error as ErrorType).message ||
            "Đã xảy ra lỗi, vui lòng thử lại.";
          message.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    });
  }, [orders, fetchData]);

  const handleRefresh = () => {
    fetchData();
    message.success("Đã làm mới dữ liệu");
  };

  const clearAllFilters = () => {
    setStatusFilter("");
    setDateFilter("");
    setSortTotal("");
    setSearchText("");
    setCurrentPage(1);
  };

  return {
    orders,
    loading,
    searchText, setSearchText,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    sortTotal, setSortTotal,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    totalItems,
    handleStatusChange,
    handleRefresh,
    clearAllFilters
  };
};
