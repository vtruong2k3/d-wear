import React, { useEffect, useState } from "react";
import { Table, Button, Select, DatePicker, message, Pagination, Tag } from "antd";
import { EyeOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Option } = Select;

const fetchOrders = async () => {
  const fakeOrders = [
    {
      _id: "1",
      createdAt: "2025-06-20T10:00:00Z",
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường ABC, Quận 1, TP.HCM"
      },
      total: 500000,
      discount: 50000,
      finalAmount: 450000,
      status: "pending",
      paymentStatus: "unpaid"
    },
    {
      _id: "2",
      createdAt: "2025-06-19T12:30:00Z",
      shippingAddress: {
        name: "Trần Thị B",
        phone: "0912345678",
        address: "456 Đường XYZ, Quận 3, TP.HCM"
      },
      total: 1000000,
      discount: 100000,
      finalAmount: 900000,
      status: "paid",
      paymentStatus: "paid"
    },
    {
      _id: "3",
      createdAt: "2025-06-18T09:15:00Z",
      shippingAddress: {
        name: "Lê Văn C",
        phone: "0987654321",
        address: "789 Đường DEF, Quận 5, TP.HCM"
      },
      total: 200000,
      discount: 0,
      finalAmount: 200000,
      status: "shipper",
      paymentStatus: "paid"
    },
    {
      _id: "4",
      createdAt: "2025-06-17T15:45:00Z",
      shippingAddress: {
        name: "Phạm Thị D",
        phone: "0978123456",
        address: "321 Đường LMN, Quận 7, TP.HCM"
      },
      total: 150000,
      discount: 20000,
      finalAmount: 130000,
      status: "cancelled",
      paymentStatus: "unpaid"
    }
  ];

  return {
    data: {
      data: fakeOrders
    }
  };
};

// Format ngày
const formatDate = (dateString) => {
  if (!dateString) return "Không có";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

// Normalize text
const normalizeString = (str) => {
  if (!str) return "";
  return str.trim().normalize("NFC").replace(/\s+/g, " ").toLowerCase();
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [hiddenOrders, setHiddenOrders] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortTotal, setSortTotal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrders();
        const all = response.data.data || [];
        const hidden = JSON.parse(localStorage.getItem("hiddenOrders")) || [];
        setHiddenOrders(hidden);
        setOrders(all);
        filterOrders(all, hidden);
      } catch (err) {
        message.error("Lỗi khi tải danh sách đơn hàng");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterOrders(orders, hiddenOrders);
  }, [orders, hiddenOrders, showHidden, statusFilter, dateFilter, sortTotal]);

  const filterOrders = (data, hidden) => {
    let filtered = [...data];

    filtered = showHidden
      ? filtered.filter((o) => hidden.includes(o._id))
      : filtered.filter((o) => !hidden.includes(o._id));

    if (statusFilter) {
      const normalized = normalizeString(statusFilter);
      filtered = filtered.filter((o) => normalizeString(o.status) === normalized);
    }

    if (dateFilter) {
      filtered = filtered.filter((o) => formatDate(o.createdAt) === dateFilter);
    }

    if (sortTotal === "low-to-high") {
      filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
    } else if (sortTotal === "high-to-low") {
      filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleHide = (id) => {
    const updated = [...hiddenOrders, id];
    setHiddenOrders(updated);
    localStorage.setItem("hiddenOrders", JSON.stringify(updated));
    message.success("Đã ẩn đơn hàng");
  };

  const handleRestore = (id) => {
    const updated = hiddenOrders.filter((i) => i !== id);
    setHiddenOrders(updated);
    localStorage.setItem("hiddenOrders", JSON.stringify(updated));
    message.success("Đã khôi phục đơn hàng");
  };

  const statusColor = {
    pending: "default",
    paid: "green",
    shipper: "blue",
    cancelled: "red",
  };

  const paymentColor = {
    unpaid: "volcano",
    paid: "green",
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Người nhận",
      dataIndex: ["shippingAddress", "name"],
      render: (val, record) => val || record.shippingInfo?.name || "Không có",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["shippingAddress", "phone"],
      render: (val, record) => val || record.shippingInfo?.phone || "Không có",
    },
    {
      title: "Địa chỉ",
      dataIndex: ["shippingAddress", "address"],
      render: (val, record) => val || record.shippingInfo?.address || "Không có",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (val) => val ? `${val.toLocaleString()} VND` : "Không có",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (val) => val ? `-${val.toLocaleString()} VND` : "0 VND",
    },
    {
      title: "Thành tiền",
      dataIndex: "finalAmount",
      render: (val) => val ? `${val.toLocaleString()} VND` : "Không có",
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>
          {status || "Không có"}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      render: (paymentStatus) => (
        <Tag color={paymentColor[paymentStatus] || "default"}>
          {paymentStatus || "Không có"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (record) => (
        <>
          <Link to={`/admin/orders/detail/${record._id}`}>
            <Button icon={<EyeOutlined />} type="primary" size="small" style={{ marginRight: 8 }}>
              Xem
            </Button>
          </Link>
          {!showHidden && record.status === "paid" && (
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
          <Option value="paid">Đã thanh toán</Option>
          <Option value="shipper">Đang giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>

        <DatePicker
          format="DD/MM/YYYY"
          onChange={(date, dateString) => setDateFilter(dateString)}
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
        dataSource={filteredOrders}
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
