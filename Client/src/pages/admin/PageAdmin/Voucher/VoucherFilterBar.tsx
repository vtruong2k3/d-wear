import React from 'react';
import { Row, Col, Input, Select, Button } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface Props {
    searchText: string;
    setSearchText: (value: string) => void;
    filterType: string;
    setFilterType: (value: string) => void;
    filterStatus: string;
    setFilterStatus: (value: string) => void;
    handleResetFilters: () => void;
    totalResults: number;
}

const VoucherFilterBar: React.FC<Props> = ({
    searchText, setSearchText,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    handleResetFilters,
    totalResults
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 mb-6">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                        <FilterOutlined className="text-blue-600" />
                    </div>
                    Bộ lọc voucher
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">
                        Tìm thấy <strong className="text-gray-800">{totalResults}</strong> voucher
                    </span>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleResetFilters}
                        danger
                        className="hover:bg-red-50 font-medium rounded-lg px-4"
                    >
                        Reset
                    </Button>
                </div>
            </div>

            <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} md={10}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm mã voucher</label>
                        <Search
                            placeholder="Nhập mã voucher..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            className="w-full shadow-sm hover:shadow transition-shadow"
                        />
                    </div>
                </Col>

                <Col xs={24} sm={12} md={7}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Loại giảm giá</label>
                        <Select
                            value={filterType}
                            onChange={setFilterType}
                            size="large"
                            className="w-full shadow-sm"
                        >
                            <Option value="all">Tất cả loại</Option>
                            <Option value="percentage">Phần trăm (%)</Option>
                            <Option value="fixed">Cố định (VNĐ)</Option>
                        </Select>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={7}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                        <Select
                            value={filterStatus}
                            onChange={setFilterStatus}
                            size="large"
                            className="w-full shadow-sm"
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="active">Đang hoạt động</Option>
                            <Option value="inactive">Không hoạt động</Option>
                        </Select>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default VoucherFilterBar;
