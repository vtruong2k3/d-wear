/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Button,
  Popconfirm,
  Select,
  Space,
  Table,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Divider,
  Switch,
  message,
} from "antd";

import useFetchList from "../../../../hooks/useFetchList";
import useQuery from "../../../../hooks/useQuery";
import type { ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import type { DefaultOptionType } from "antd/es/select";
import type { IProduct } from "../../../../types/IProducts";
import { Link, useNavigate } from "react-router-dom";


import { MdDelete, MdAdd } from "react-icons/md";
import { FaPen, FaSearch, FaFilter } from "react-icons/fa";

import type { ErrorType } from "../../../../types/error/IError";
import { formatCurrency } from "../../../../utils/Format";
import { useLoading } from "../../../../contexts/LoadingContext";

import { restoreProduct, softDeleteProduct } from "../../../../services/admin/productService";
import { useState } from "react";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
const { Title } = Typography;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [showHidden, setShowHidden] = useState(false);
  const [query, updateQuery] = useQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
    q: "",
  });

  const sortOptions: DefaultOptionType[] = [
    {
      value: JSON.stringify({ sortBy: "basePrice", order: "asc" }),
      label: "Giá tăng dần",
    },
    {
      value: JSON.stringify({ sortBy: "basePrice", order: "desc" }),
      label: "Giá giảm dần",
    },
    {
      value: JSON.stringify({ sortBy: "product_name", order: "asc" }),
      label: "Tên A-Z",
    },
    {
      value: JSON.stringify({ sortBy: "product_name", order: "desc" }),
      label: "Tên Z-A",
    },
  ];

  const {
    data: rawProducts = [],
    total,
    refetch,
    loading
  } = useFetchList<IProduct>(
    showHidden ? "product/deleted" : "product",
    query,
    {}
  );


  const products: IProduct[] =
    rawProducts?.map((item: any) => {
      const rawPath = item.imageUrls?.[0] ?? "";
      const fullPath = rawPath.startsWith("http")
        ? rawPath
        : `http://localhost:5000/${rawPath.replace(/\\/g, "/")}`;

      return {
        _id: item._id,
        id: item._id,
        title: item.product_name,
        price: item.basePrice,
        thumbnail: fullPath,
        category: item.category_id?.category_name || "Chưa phân loại",
        brand: item.brand_id?.brand_name || "Không rõ",
      };
    }) || [];

  const columns: ColumnsType<IProduct> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
      render: (id) => (
        <Link to={`/product/${id}`}>
          <Tag color="blue">#{id}</Tag>
        </Link>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 300,
      render: (_, record) => (
        <Link to={`/product/${record._id}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 60,
                height: 60,
                flexShrink: 0,
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                overflow: "hidden",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={record.thumbnail}
                alt="product"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#262626" }}>
                {record.title}
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {record.brand}
              </div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right",
      render: (price) => (
        <span style={{ fontWeight: "600", color: "#52c41a", fontSize: "16px" }}>
          {typeof price === "number" ? formatCurrency(price) : "N/A"}
        </span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category) => (
        <Tag color="geekblue" style={{ borderRadius: "12px" }}>
          {category}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record: any) => (
        <Space size="small">
          {!showHidden ? (
            <>
              <Button
                type="text"
                icon={<FaPen />}
                onClick={() => navigate(`/admin/products/edit/${record.id}`)}
                style={{ color: "#1890ff" }}
                title="Chỉnh sửa"
              />
              <Popconfirm
                title="Xác nhận xoá mềm"
                description="Bạn có chắc muốn xoá sản phẩm này?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button type="text" danger icon={<MdDelete />} title="Xoá mềm" />
              </Popconfirm>
            </>
          ) : (
            <Space size="small">
              {/* Nút khôi phục */}
              <Popconfirm
                title="Khôi phục sản phẩm này?"
                onConfirm={() => handleRestore(record._id)}
                okText="Khôi phục"
                cancelText="Huỷ"
              >
                <Button
                  icon={<RollbackOutlined />}
                  type="default"
                  title="Khôi phục"
                  style={{ border: "none" }}
                />
              </Popconfirm>

              {/* Nút xoá vĩnh viễn */}
              <Popconfirm
                title="Xác nhận xoá vĩnh viễn"
                description="Hành động này sẽ xoá vĩnh viễn sản phẩm. Không thể khôi phục."
                onConfirm={() => handleHardDelete(record.id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button
                  type="text"
                  danger
                  icon={<MdDelete />}
                  title="Xoá"

                />
              </Popconfirm>
            </Space>

          )}
        </Space>
      ),
    },
  ];


  const handleRestore = async (id: string) => {
    try {
      setLoading(true)
      const res = await restoreProduct(id)
      message.success(res.message || "Khôi phục thành công.");
      refetch();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      setLoading(true)
      const { data } = await axios.delete(`/api/product/${id}`);
      message.success(data.message || "Đã xoá vĩnh viễn.");
      refetch();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false)
    }
  };
  //xóa mềm
  const handleDelete = async (id: string) => {
    try {
      const data = await softDeleteProduct(id); // Gửi true rõ ràng
      message.success(data.message || "Đã xoá mềm sản phẩm.");
      refetch();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  const handleSearch = (value: string) => {
    updateQuery({ q: value, page: 1 });
  };

  const handleSort = (value: string) => {
    const sort = JSON.parse(value);
    updateQuery({ sortBy: sort.sortBy, order: sort.order, page: 1 });
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }} className="bg-gray-50">
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <Title
            level={2}
            style={{
              textAlign: "center",
              margin: "0 0 24px 0",
              color: "#262626",

            }}
          >
            Danh sách sản phẩm
          </Title>
          <Switch
            checked={showHidden}
            onChange={(checked) => {
              setShowHidden(checked);
              updateQuery({ page: 1 });
            }}

            checkedChildren="Đã xoá"
            unCheckedChildren="Hoạt động"
          />

        </div>

        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                onChange={(e) => handleSearch(e.target.value)}
                enterButton={<FaSearch />}
                style={{ minWidth: 300 }}
                size="large"
                allowClear
              />
              <Select
                placeholder="Sắp xếp theo"
                style={{ minWidth: 180 }}
                size="large"
                onChange={handleSort}
                options={sortOptions}
                suffixIcon={<FaFilter />}
                allowClear
              />
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<MdAdd />}
              onClick={() => navigate("/admin/products/add")}
              style={{
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(24, 144, 255, 0.3)",
              }}
            >
              Thêm sản phẩm
            </Button>
          </Col>
        </Row>

        <Divider />

        <Table
          dataSource={products}
          rowKey={(record) => record.id || record._id || record.title}
          columns={columns}
          loading={loading}
          pagination={{
            current: query.page,
            pageSize: query.limit,
            total: total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "30", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            onChange: (page, pageSize) => {
              setLoading(true); //  Bắt đầu loading
              updateQuery({ page, limit: pageSize });
            },
            onShowSizeChange: (_current, size) => {
              setLoading(true); //  Bắt đầu loading khi đổi pageSize
              updateQuery({ page: 1, limit: size });
            },
            style: { marginTop: 16 },
          }}
          style={{ background: "white", borderRadius: 8 }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Products;
