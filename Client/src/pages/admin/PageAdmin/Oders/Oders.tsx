import { useEffect, useState } from "react";
import {
    Table,
    Button,
    Select,
    DatePicker,
    message,
    Pagination,
    Tag,
} from "antd";
import {
    EyeOutlined,
    DeleteOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { IOrder } from "../../../../types/order/IOrder";
import { fetchGetAllOrder } from "../../../../services/admin/orderService";
import { formatCurrency } from "../../../../utils/Format";

const { Option } = Select;

const formatDate = (dateString: string) => {
    if (!dateString) return "Không có";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
};

const normalizeString = (str: string) => {
    if (!str) return "";
    return str.trim().normalize("NFC").replace(/\s+/g, " ").toLowerCase();
};

const OrderList = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
    const [hiddenOrders, setHiddenOrders] = useState<string[]>([]);
    const [showHidden, setShowHidden] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("");
    const [sortTotal, setSortTotal] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchGetAllOrder();
                console.log("Dữ liệu trả về từ API:", response); // <-- kiểm tra
                const all = response.orders || [];
                const hidden = JSON.parse(localStorage.getItem("hiddenOrders") || "[]");
                setHiddenOrders(hidden);
                setOrders(all);
                filterOrders(all, hidden);
            } catch (err) {
                message.error("Lỗi khi tải danh sách đơn hàng");
                console.error("Lỗi gọi API:", err); // <-- thêm
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        filterOrders(orders, hiddenOrders);
    }, [orders, hiddenOrders, showHidden, statusFilter, dateFilter, sortTotal]);

    const filterOrders = (data: IOrder[], hidden: string[]) => {
        let filtered = [...data];

        filtered = showHidden
            ? filtered.filter((o) => hidden.includes(o._id))
            : filtered.filter((o) => !hidden.includes(o._id));

        if (statusFilter) {
            const normalized = normalizeString(statusFilter);
            filtered = filtered.filter(
                (o) => normalizeString(o.status) === normalized
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(
                (o) => formatDate(o.createdAt) === dateFilter
            );
        }

        if (sortTotal === "low-to-high") {
            filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
        } else if (sortTotal === "high-to-low") {
            filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const handleHide = (id: string) => {
        const updated = [...hiddenOrders, id];
        setHiddenOrders(updated);
        localStorage.setItem("hiddenOrders", JSON.stringify(updated));
        message.success("Đã ẩn đơn hàng");
    };

    const handleRestore = (id: string) => {
        const updated = hiddenOrders.filter((i) => i !== id);
        setHiddenOrders(updated);
        localStorage.setItem("hiddenOrders", JSON.stringify(updated));
        message.success("Đã khôi phục đơn hàng");
    };

    const statusColor: Record<string, string> = {
        pending: "default",
        paid: "green",
        shipper: "blue",
        cancelled: "red",
    };

    const paymentColor: Record<string, string> = {
        unpaid: "volcano",
        paid: "green",
    };

    const columns = [
        {
            title: "STT",
            render: (_: number, __: number, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
            width: 60,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Người nhận",
            dataIndex: ["shippingAddress", "name"],
            render: (_: IOrder, record: IOrder) =>
                record.shippingAddress || "Không có",
        },
        {
            title: "Số điện thoại",
            dataIndex: ["shippingAddress", "phone"],
            render: (_: IOrder, record: IOrder) =>
                record.phone || "Không có",
        },
        {
            title: "Địa chỉ",
            dataIndex: ["shippingAddress", "address"],
            render: (_: IOrder, record: IOrder) =>
                record.shippingAddress || "Không có",
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
            render: (val: IOrder) =>
                val ? formatCurrency(val.finalAmount) : "Không có",
        },
        {
            title: "Giảm giá",
            dataIndex: "discount",
            render: (val: IOrder) =>
                val ? formatCurrency(val.discount) : "0 VND",
        },
        {
            title: "Thành tiền",
            dataIndex: "finalAmount",
            render: (val: number) =>
                val ? `${val.toLocaleString()} VND` : "Không có",
        },
        {
            title: "Trạng thái đơn",
            dataIndex: "status",
            render: (status: IOrder) => (
                <Tag color={statusColor[status.status] || "default"}>{status.status}</Tag>
            ),
        },
        {
            title: "Thanh toán",
            dataIndex: "paymentStatus",
            render: (paymentStatus: IOrder) => (
                <Tag color={paymentColor[paymentStatus.paymentStatus] || "default"}>{paymentStatus.paymentStatus}</Tag>
            ),
        },
        {
            title: "Hành động",
            render: (record: IOrder) => (
                <>
                    <Link to={`/admin/orders/detail/${record._id}`}>
                        <Button
                            icon={<EyeOutlined />}
                            type="primary"
                            size="small"
                            style={{ marginRight: 8 }}
                        >
                            Xem
                        </Button>
                    </Link>
                    {!showHidden && record.paymentStatus === "paid" && (
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleHide(record._id)}
                            danger
                            size="small"
                        >
                            Ẩn
                        </Button>
                    )}
                    {showHidden && (
                        <Button
                            icon={<RollbackOutlined />}
                            onClick={() => handleRestore(record._id)}
                            type="dashed"
                            size="small"
                        >
                            Khôi phục
                        </Button>
                    )}
                </>
            ),
        },
    ];

    return (
        <div>
            <h2>📦 Danh sách đơn hàng</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <Select
                    placeholder="Lọc theo trạng thái đơn"
                    style={{ width: 180 }}
                    allowClear
                    onChange={setStatusFilter}
                >
                    <Option value="pending">Chờ xử lý</Option>
                    <Option value="shipped">Đã thanh toán</Option>
                    <Option value="delivered">Đang giao</Option>
                    <Option value="cancelled">Đã hủy</Option>
                </Select>

                <DatePicker
                    format="DD/MM/YYYY"
                    onChange={(_, dateString) => setDateFilter(dateString)}
                    placeholder="Lọc theo ngày"
                />

                <Select
                    placeholder="Sắp xếp tổng tiền"
                    style={{ width: 180 }}
                    allowClear
                    onChange={setSortTotal}
                >
                    <Option value="low-to-high">Thấp → Cao</Option>
                    <Option value="high-to-low">Cao → Thấp</Option>
                </Select>

                <Button type="default" onClick={() => setShowHidden(!showHidden)}>
                    {showHidden ? "🔙 Danh sách chính" : "👻 Đơn đã ẩn"}
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={filteredOrders.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                )}
                rowKey="_id"
                pagination={false}
            />

            <div style={{ marginTop: 24, textAlign: "center" }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredOrders.length}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default OrderList;
