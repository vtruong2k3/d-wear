/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popconfirm, Select, Space, Table, Card, Row, Col, Tag, Typography, Divider } from "antd";
import useFetchList from "../../../../hooks/useFetchList";
import useQuery from "../../../../hooks/useQuery";
import type { ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import type { DefaultOptionType } from "antd/es/select";
import type { IProduct } from "../../../../types/IProducts";
import { useNavigate } from "react-router-dom";
import api from "../../../../configs/AxiosConfig";
import { MdDelete, MdAdd } from "react-icons/md";
import { FaPen, FaSearch, FaFilter } from "react-icons/fa";

const { Title } = Typography;

const Products: React.FC = () => {
  //Điều hướng
  const navigate = useNavigate();

  //Khởi tạo điều kiện để tìm kiếm API
  const [query, updateQuery] = useQuery({
    page: 1,
    limit: 30,
    sortBy: "",
    order: "",
    q: "",
  });

  //Mảng danh sách để chọn sắp xếp
  const sortOptions: DefaultOptionType[] = [
    //Dùng Stringify để chuyển value object sang dạng chuỗi
    {
      value: JSON.stringify({ sortBy: "price", order: "asc" }),
      label: "Giá tăng dần",
    },
    {
      value: JSON.stringify({ sortBy: "price", order: "desc" }),
      label: "Giá giảm dần",
    },
    {
      value: JSON.stringify({ sortBy: "title", order: "asc" }),
      label: "Tên A-Z",
    },
    {
      value: JSON.stringify({ sortBy: "title", order: "desc" }),
      label: "Tên Z-A",
    },
    {
      value: JSON.stringify({ sortBy: "review", order: "desc" }),
      label: "Đánh giá cao nhất",
    },
  ];

  //Lấy API
  const {
    data: products,
    loading,
    refetch,
  } = useFetchList<IProduct>("products", query, {});

  //Cấu hình cột bảng bằng ANTD
  const columns: ColumnsType<IProduct> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: 'center',
      render: (id) => <Tag color="blue">#{id}</Tag>
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={record.thumbnail}
            alt="product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}
          />
          <div>
            <div style={{ fontWeight: '600', color: '#262626' }}>
              {record.title}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.brand}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: 'right',
      render: (price) => (
        <span style={{
          fontWeight: '600',
          color: '#52c41a',
          fontSize: '16px'
        }}>
          {price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category) => (
        <Tag color="geekblue" style={{ borderRadius: '12px' }}>
          {category}
        </Tag>
      )
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: 'center',
      render: (_, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FaPen />}
            onClick={() => navigate(`/admin/products/edit/${record.id}`)}
            style={{
              color: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xoá sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              icon={<MdDelete />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // handleDelete : Xóa sản phẩm
  const handleDelete = async (id: number) => {
    console.log(id);
    try {
      await api.delete(`/products/${id}`);
      alert("Xoá sản phẩm thành công");
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  //Tìm kiếm
  const handleSearch = (data: any) => {
    updateQuery({ q: data });
  };

  //Bộ lọc
  const handleSort = (data: string) => {
    const sortObject = JSON.parse(data);
    updateQuery(sortObject);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }} className="bg-gray-50">
      <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', margin: '0 0 24px 0', color: '#262626' }}>
          📦 Danh sách sản phẩm
        </Title>

        <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                onChange={(e) => handleSearch(e.target.value)}
                enterButton={<FaSearch />}
                style={{ minWidth: '300px' }}
                size="large"
              />
              <Select
                placeholder="Sắp xếp theo"
                style={{ minWidth: '180px' }}
                size="large"
                onChange={handleSort}
                options={sortOptions}
                suffixIcon={<FaFilter />}
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
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Thêm sản phẩm
            </Button>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        <Table
          loading={loading}
          dataSource={products}
          rowKey="id"
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            style: { marginTop: '16px' }
          }}
          style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          scroll={{ x: 800 }}
          rowHoverable
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Products;