import { useEffect, useState } from "react";
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
  message,
} from "antd";
import { MdDelete, MdAdd } from "react-icons/md";
import { FaPen, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCatgory";

const { Title } = Typography;
const { Search } = Input;

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/category");
      const data = response.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      message.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/category/${id}`);
      message.success("Xoá thành công");
      fetchCategories();
    } catch {
      message.error("Xoá thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_: any, __: any, index: number) => (
        <Tag color="blue">#{index + 1}</Tag>
      ),
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
      render: (_: any, record: any) => (
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
          loading={loading}
          dataSource={filteredCategories}
          rowKey="id"
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
