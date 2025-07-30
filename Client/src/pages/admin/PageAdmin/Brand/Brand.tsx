import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Popconfirm,

  Divider,
  Tag,
} from "antd";
import { MdAdd, MdDelete } from "react-icons/md";
import { FaPen, FaSearch } from "react-icons/fa";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";

import { fetchAllBrands, deleteBrandById } from "../../../../services/admin/brandService";
import type { IBrand } from "../../../../types/brand/IBrand";
import { toast } from "react-toastify";
import type { ErrorType } from "../../../../types/error/IError";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { Search } = Input;

const BrandList = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);



  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllBrands();
      setBrands(data);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteBrandById(id);
      toast.success(res.data.message || "Xoá thành công");
      fetchBrands();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const columns: ColumnsType<IBrand> = [
    {
      title: "STT",
      key: "index",
      align: "center",
      render: (_: unknown, __: IBrand, index: number) => index + 1,
    },
    {
      title: "Tên brand",
      dataIndex: "brand_name",
      key: "brand_name",
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_: unknown, record: IBrand) => (
        <Space>
          <Button
            type="text"
            icon={<FaPen />}
            onClick={() => {
              setEditingBrand(record);
              setEditVisible(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xoá"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="text" icon={<MdDelete />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const filteredBrands = brands.filter((b) =>
    b.brand_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }} className="bg-gray-50">
      <Card >
        <Title level={2}>📌 Danh sách Brand</Title>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Search
              placeholder="Tìm brand..."
              prefix={<FaSearch />}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<MdAdd />} onClick={() => setAddVisible(true)}>
              Thêm brand
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={filteredBrands}
        />
        <AddBrand
          visible={addVisible}
          onClose={() => setAddVisible(false)}
          onSuccess={fetchBrands}
        />
        <EditBrand
          visible={editVisible}
          brand={editingBrand}
          onClose={() => {
            setEditVisible(false);
            setEditingBrand(null);
          }}
          onSuccess={fetchBrands}
        />
      </Card>
    </div>
  );
};

export default BrandList;
