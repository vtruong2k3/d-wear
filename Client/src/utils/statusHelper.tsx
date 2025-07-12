import { Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import React from 'react';

export const getStatusInVietnamese = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        pending: {
            label: 'Chờ xử lý',
            color: 'bg-yellow-100 text-yellow-800',
            icon: <Clock className="w-3 h-3" />,
        },
        processing: {
            label: 'Đang xử lý',
            color: 'bg-purple-100 text-purple-800',
            icon: <Package className="w-3 h-3" />,
        },
        shipped: {
            label: 'Đang giao hàng',
            color: 'bg-indigo-100 text-indigo-800',
            icon: <Truck className="w-3 h-3" />,
        },
        delivered: {
            label: 'Đã giao',
            color: 'bg-green-100 text-green-800',
            icon: <CheckCircle className="w-3 h-3" />,
        },
        cancelled: {
            label: 'Đã hủy',
            color: 'bg-red-100 text-red-800',
            icon: <XCircle className="w-3 h-3" />,
        },
    };

    return map[status.toLowerCase()] || {
        label: 'Không xác định',
        color: 'bg-gray-100 text-gray-800',
        icon: <XCircle className="w-3 h-3" />,
    };
};