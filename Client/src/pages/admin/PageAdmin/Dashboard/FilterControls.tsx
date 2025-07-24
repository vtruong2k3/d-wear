import React from 'react';
import { Card, Select, DatePicker, Button, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { FilterByDateResponse } from '../../../../types/static/IStatic';

const { RangePicker } = DatePicker;
const { Option } = Select;
interface FilterControlsProps {
    statisticType: 'normal' | 'dateRange';
    setStatisticType: (type: 'normal' | 'dateRange') => void;
    dateRange: [Dayjs, Dayjs] | null;
    setDateRange: (range: [Dayjs, Dayjs] | null) => void;
    filteredData: FilterByDateResponse | null;
    onApplyFilter: () => void;
}
const FilterControls: React.FC<FilterControlsProps> = ({
    statisticType,
    setStatisticType,
    dateRange,
    setDateRange,
    filteredData,
    onApplyFilter
}) => {
    return (
        <Card className="mb-6 shadow-sm">
            <div className="flex lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center">
                    <CalendarOutlined className="text-blue-500 text-xl mr-3" />
                    <h2 className="text-xl font-bold text-gray-800 !mb-0">Thống kê</h2>
                    {statisticType === 'dateRange' && filteredData && dateRange && dateRange[0] && dateRange[1] && (
                        <Tag color="blue" className="ml-3">
                            Đã lọc: {dateRange[0].format('DD/MM')} - {dateRange[1].format('DD/MM')}
                        </Tag>
                    )}

                </div>

                <div className="flex sm:flex-row gap-3">
                    <Select
                        value={statisticType}
                        onChange={setStatisticType}
                        style={{ width: 200 }}
                        placeholder="Chọn loại thống kê"
                    >
                        <Option value="normal">Thống kê bình thường</Option>
                        <Option value="dateRange">Theo khoảng ngày</Option>
                    </Select>

                    {statisticType === 'dateRange' && (
                        <RangePicker
                            onChange={(dates) => {
                                if (dates && dates[0] && dates[1]) {
                                    setDateRange([dates[0], dates[1]]);
                                } else {
                                    setDateRange(null);
                                }
                            }}
                            format="DD/MM/YYYY"
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                            value={dateRange}
                        />

                    )}

                    <Button type="primary" onClick={onApplyFilter}>
                        Áp dụng
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default FilterControls;