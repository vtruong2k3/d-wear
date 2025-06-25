/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popconfirm, Select, Space, Table } from "antd";
import useFetchList from "../../../hooks/useFetchList";
import useQuery from "../../../hooks/useQuery";
import type { ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import type { DefaultOptionType } from "antd/es/select";
import type { IProduct } from "../../../types/IProducts";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/AxiosConfig";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
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
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (images) => (
        <img
          src={images}
          alt="product"
          style={{ width: 60, height: 60, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Brands",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record: any) => (
        <Space size="middle">
          <Space>
            <Button onClick={() => navigate(`/admin/products/edit/${record.id}`)}>
              <FaPen />
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xoá?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger><MdDelete /></Button>
            </Popconfirm>
          </Space>
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
    <div>
      <h1 className="text-center mt-5 mb-5 text-4xl ">Danh sách sản phẩm</h1>
      <div className="flex gap-3 p-3">
        <Space wrap>
          <Search
            placeholder="Tìm kiếm ..."
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
          />
          <Select
            defaultValue={sortOptions[0]}
            style={{ width: 120 }}
            onChange={handleSort}
            options={sortOptions}
          />
        </Space>
        <Button type="primary" onClick={() => navigate("/admin/products/add")}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={products}
        rowKey="id"
        columns={columns}
      />
    </div>
  );
};

export default Products;