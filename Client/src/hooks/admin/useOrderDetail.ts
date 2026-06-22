import { useCallback, useEffect, useState } from "react";
import { message, Modal } from "antd";
import socket from "../../sockets/socket";
import type { OrderDetailResponse, IOrder } from "../../types/order/IOrder";
import type { ErrorType } from "../../types/error/IError";
import { cancelOrderAdmin, fetchGetOrderDetail, updateOrderStatus } from "../../services/admin/orderService";
import { getStatusLabel } from "../../utils/Status";

export const useOrderDetail = (id: string | undefined, setLoading: (loading: boolean) => void) => {
  const [data, setData] = useState<OrderDetailResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetchGetOrderDetail(id);
      setData(res);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!id) return;

    socket.emit('joinRoom', id);

    const onCancelOrder = (socketData: any) => {
      if (socketData?.orderId === id) {
        setData((prev) => prev ? {
          ...prev,
          order: { ...prev.order, status: socketData.status, cancellationReason: socketData.cancellationReason }
        } : prev);
        message.success(`Đơn hàng đã bị hủy vì lý do: ${socketData.cancellationReason || "Không có lý do"}`);
      }
    };

    const onOrderPaid = (socketData: any) => {
      if (socketData?.orderId === id) {
        setData((prev) => prev ? {
          ...prev,
          order: {
            ...prev.order,
            paymentStatus: socketData.paymentStatus,
          }
        } : prev);
        message.info(`Đơn hàng đã được thanh toán thành công.`);
      }
    };

    socket.on('cancelOrder', onCancelOrder);
    socket.on('orderPaid', onOrderPaid);

    return () => {
      socket.emit('leaveRoom', id);
      socket.off('cancelOrder', onCancelOrder);
      socket.off('orderPaid', onOrderPaid);
    };
  }, [id]);

  const handleCancelOrder = async () => {
    const reasonToSend = selectedReason === "Lý do khác" ? cancelReason.trim() : selectedReason;
    if (!reasonToSend) {
      message.error("Vui lòng chọn hoặc nhập lý do hủy đơn hàng");
      return;
    }
    try {
      setLoading(true);
      const res = await cancelOrderAdmin(id!, reasonToSend);
      message.success(res.message);
      setData((prev) => prev ? { ...prev, order: { ...prev.order, status: "cancelled" } } : prev);
      setIsModalOpen(false);
      setSelectedReason("");
      setCancelReason("");
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

  const handleStatusUpdate = (newStatus: IOrder["status"]) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái",
      content: `Bạn có chắc muốn chuyển đơn sang trạng thái "${getStatusLabel(newStatus)}"?`,
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: async () => {
        if (!data?.order?._id) return;
        try {
          setLoading(true);
          await updateOrderStatus(data.order._id, newStatus);
          setData((prev) => prev ? {
            ...prev,
            order: { ...prev.order, status: newStatus },
          } : prev);
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
      },
    });
  };

  return {
    data,
    isModalOpen, setIsModalOpen,
    selectedReason, setSelectedReason,
    cancelReason, setCancelReason,
    handleCancelOrder,
    handleStatusUpdate
  };
};
