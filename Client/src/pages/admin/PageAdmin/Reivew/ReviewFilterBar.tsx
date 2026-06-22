import React from 'react';
import { Row, Col, Input, Select, DatePicker, Button } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Props {
    searchText: string;
    setSearchText: (value: string) => void;
    filterStatus: string;
    setFilterStatus: (value: string) => void;
    filterRating: string;
    setFilterRating: (value: string) => void;
    filterHasReply: string;
    setFilterHasReply: (value: string) => void;
    filterDateRange: [Dayjs | null, Dayjs | null] | null;
    setFilterDateRange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
    handleResetFilters: () => void;
}

const ReviewFilterBar: React.FC<Props> = ({
    searchText, setSearchText,
    filterStatus, setFilterStatus,
    filterRating, setFilterRating,
    filterHasReply, setFilterHasReply,
    filterDateRange, setFilterDateRange,
    handleResetFilters
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 mb-6">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                        <FilterOutlined className="text-blue-600" />
                    </div>
                    Bộ lọc bình luận
                </h3>
                <Button
                    icon={<ClearOutlined />}
                    onClick={handleResetFilters}
                    danger
                    className="hover:bg-red-50 font-medium rounded-lg px-4"
                >
                    Reset bộ lọc
                </Button>
            </div>

            <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} md={8} xl={6}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
                        <Search
                            placeholder="Tên, sản phẩm, bình luận..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            className="w-full shadow-sm hover:shadow transition-shadow"
                        />
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8} xl={6}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                        <Select
                            value={filterStatus}
                            onChange={setFilterStatus}
                            size="large"
                            className="w-full shadow-sm"
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="approved">Đã duyệt</Option>
                            <Option value="pending">Chờ duyệt</Option>
                        </Select>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8} xl={6}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Đánh giá sao</label>
                        <Select
                            value={filterRating}
                            onChange={setFilterRating}
                            size="large"
                            className="w-full shadow-sm"
                        >
                            <Option value="all">Tất cả số sao</Option>
                            <Option value="5">5 sao</Option>
                            <Option value="4">4 sao</Option>
                            <Option value="3">3 sao</Option>
                            <Option value="2">2 sao</Option>
                            <Option value="1">1 sao</Option>
                        </Select>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8} xl={6}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phản hồi</label>
                        <Select
                            value={filterHasReply}
                            onChange={setFilterHasReply}
                            size="large"
                            className="w-full shadow-sm"
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="has_reply">Đã phản hồi</Option>
                            <Option value="no_reply">Chưa phản hồi</Option>
                        </Select>
                    </div>
                </Col>

                <Col xs={24} sm={24} md={16} xl={12}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng thời gian</label>
                        <RangePicker
                            value={filterDateRange}
                            onChange={(dates) => setFilterDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
                            size="large"
                            className="w-full shadow-sm"
                            placeholder={['Từ ngày', 'Đến ngày']}
                            format="DD/MM/YYYY"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ReviewFilterBar;
