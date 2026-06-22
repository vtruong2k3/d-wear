import { useCallback, useEffect, useState } from 'react';
import { Button, message, Typography } from 'antd';
import { PlusOutlined, TagOutlined } from '@ant-design/icons';
import type { IVoucher, VoucherStats } from '../../../../types/voucher/IVoucher';
import type { ErrorType } from '../../../../types/error/IError';
import {
    fetchCreateVoucher, fetchDeleteVoucher, fetchGetAllVouchers, fetchUpdateVoucher, fetchVoucherStats
} from '../../../../services/admin/voucherService';

import VoucherFilterBar from './VoucherFilterBar';
import VoucherTable from './VoucherTable';
import VoucherFormModal from './VoucherFormModal';

const { Title } = Typography;

const VoucherManagement = () => {
    // Data states
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [stats, setStats] = useState<VoucherStats | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingVoucher, setEditingVoucher] = useState<IVoucher | null>(null);

    // Pagination states
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    // Filter states
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Loading states
    const [loading, setLoading] = useState<boolean>(false);

    const getVoucherStats = useCallback(async () => {
        try {
            const data = await fetchVoucherStats();
            setStats(data);
        } catch (error) {
            console.error('Lỗi khi lấy thống kê voucher:', error);
        }
    }, []);

    const getAllVoucher = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchGetAllVouchers({
                page,
                limit,
                keyword: searchText,
                discountType: filterType,
                isActive: filterStatus
            });
            setVouchers(res.vouchers);
            setTotal(res.pagination.total);
            setPage(res.pagination.page);
        } catch (error) {
            const errorMessage =
                (error as ErrorType).response?.data?.message ||
                (error as ErrorType).message ||
                "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [page, limit, searchText, filterType, filterStatus]);

    useEffect(() => {
        getAllVoucher();
        getVoucherStats();
    }, [getAllVoucher, getVoucherStats]);

    const handleTableChange = (pagination: any) => {
        setPage(pagination.current);
        setLimit(pagination.pageSize);
    };

    const handleAdd = () => {
        setModalMode('add');
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IVoucher) => {
        setModalMode('edit');
        setEditingVoucher(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            const { message: msg } = await fetchDeleteVoucher(id);
            message.success(msg);
            // Refresh data
            getAllVoucher();
            getVoucherStats();
        } catch (error) {
            const err = error as ErrorType;
            const errorMessage = err?.response?.data?.message || err.message || "Đã xảy ra lỗi khi xoá";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (values: Omit<IVoucher, '_id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setLoading(true);
            let msg = '';
            if (modalMode === 'add') {
                const res = await fetchCreateVoucher(values);
                msg = res.message;
            } else {
                if (!editingVoucher?._id) return;
                const res = await fetchUpdateVoucher(editingVoucher._id, values);
                msg = res.message;
            }

            message.success(msg);
            setIsModalOpen(false);
            // Cần quay về trang 1 nếu thêm mới, hoặc load lại trang hiện tại nếu sửa
            if (modalMode === 'add') setPage(1);
            getAllVoucher();
            getVoucherStats();
        } catch (error) {
            const err = error as ErrorType;
            const errorMessage = err.response?.data?.message || err.message || 'Đã xảy ra lỗi, vui lòng thử lại.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setSearchText('');
        setFilterType('all');
        setFilterStatus('all');
        setPage(1);
    };

    return (
        <div className="p-6 bg-[#f4f7fe] min-h-screen font-sans">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 text-white">
                            <TagOutlined className="text-3xl" />
                        </div>
                        <div>
                            <Title level={2} className="!mb-1 !text-gray-900 tracking-tight font-bold">Quản lý Voucher</Title>
                            <p className="text-gray-500 m-0 text-base">Tạo, theo dõi và quản lý các mã khuyến mãi</p>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        size="large"
                        className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 rounded-xl font-medium px-6"
                    >
                        Thêm Voucher Mới
                    </Button>
                </div>

                {/* Filters Section */}
                <VoucherFilterBar
                    searchText={searchText} setSearchText={setSearchText}
                    filterType={filterType} setFilterType={setFilterType}
                    filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                    handleResetFilters={handleResetFilters}
                    totalResults={total}
                />

                {/* Table Section */}
                <VoucherTable
                    vouchers={vouchers}
                    loading={loading}
                    pagination={{ current: page, pageSize: limit, total }}
                    handleTableChange={handleTableChange}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>

            <VoucherFormModal
                mode={modalMode}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialValues={editingVoucher}
            />
        </div>
    );
};

export default VoucherManagement;