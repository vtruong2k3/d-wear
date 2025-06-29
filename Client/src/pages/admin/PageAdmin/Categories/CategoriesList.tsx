import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Input,
  Tag,

} from "antd";
import { MdDelete, MdAdd } from "react-icons/md";
import { FaPen, FaSearch } from "react-icons/fa";

import { useLoading } from "../../../../contexts/LoadingContext";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCatgory";
import { fetchGetAllCategory, deleteCategoryById } from "../../../../services/categoryService";
import type { ICategory } from "../../../../types/category/ICategory";
import type { ColumnsType } from "antd/es/table";
import type { ErrorType } from "../../../../types/error/IError";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Search } = Input;

const CategoriesList: React.FC = () => {

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchText, setSearchText] = useState("");
  const { setLoading } = useLoading();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGetAllCategory();
      setCategories(Array.isArray(data) ? data : []);
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
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteCategoryById(id);
      toast.success(data.message)
      fetchCategories();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const columns: ColumnsType<ICategory> = [
    {
      title: "STT",
      key: "index",
      align: "center",
      render: (_text, _record, index) => <Tag color="blue">#{index + 1}</Tag>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_text, record) => (
        <Space>
          <Button
            type="text"
            icon={<FaPen />}
            style={{ color: "#1890ff" }}
            onClick={() => {
              setEditingCategory(record);
              setEditVisible(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xoá?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="text" danger icon={<MdDelete />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredCategories = categories.filter((c) =>
    c.category_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2} style={{ textAlign: "center" }}>
          📂 Danh sách danh mục
        </Title>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm danh mục..."
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<FaSearch />}
              allowClear
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<MdAdd />}
              onClick={() => setAddVisible(true)}
            >
              Thêm danh mục
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table
          loading={false}
          dataSource={filteredCategories}
          rowKey="_id"
          columns={columns}
        />
      </Card>

      <AddCategory
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSuccess={fetchCategories}
      />

      <EditCategory
        visible={editVisible}
        category={editingCategory}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default CategoriesList;
