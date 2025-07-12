import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { getStatusInVietnamese } from '../../../utils/statusHelper';
import type { IOrder } from '../../../types/order/IOrder';
import { updateOrderStatus } from '../../../services/admin/orderService';

interface Props {
    order: IOrder;
    onStatusUpdated?: (newStatus: string) => void;
}

const OrderStatusDropdown: React.FC<Props> = ({ order, onStatusUpdated }) => {
    const [selectedStatus, setSelectedStatus] = useState<IOrder['status']>(order.status);

    const validTransitions: Record<string, string[]> = {
        pending: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: [],
    };

    const availableStatuses = validTransitions[order.status] || [];

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;

        if (!availableStatuses.includes(newStatus)) {
            toast.error('Không thể chuyển sang trạng thái này.');
            return;
        }

        try {
            await updateOrderStatus(order._id, newStatus);
            toast.success(`Trạng thái đã cập nhật thành ${getStatusInVietnamese(newStatus).label}`);
            setSelectedStatus(newStatus);
            onStatusUpdated?.(newStatus);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <select
            value={selectedStatus}
            onChange={handleChange}
            className="px-2 py-1 rounded border text-sm bg-white"
        >
            <option value="" disabled>-- Chọn trạng thái --</option>
            {availableStatuses.map((status) => (
                <option key={status} value={status}>
                    {getStatusInVietnamese(status).label}
                </option>
            ))}
        </select>
    );
};

export default OrderStatusDropdown;
