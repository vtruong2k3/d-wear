import { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Typography, Input, Space, Popconfirm, message, Divider, Tag } from 'antd';
import { MdAdd, MdDelete } from 'react-icons/md';
import { FaPen, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import AddBrand from './AddBrand';
import EditBrand from './EditBrand';

const { Title } = Typography;
const { Search } = Input;

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/brand');
      setBrands(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch {
      message.error('Không thể tải brand');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/brand/${id}`);
      message.success('Xoá thành công');
      fetchBrands();
    } catch {
      message.error('Xoá thất bại');
    }
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Tên brand',
      dataIndex: 'brand_name',
      render: (name) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
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

  return (
    <Card>
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
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={brands.filter((b) =>
          b.brand_name?.toLowerCase().includes(searchText.toLowerCase())
        )}
      />
      <AddBrand
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
          fetchBrands();
        }}
      />
      <EditBrand
        visible={editVisible}
        brand={editingBrand}
        onClose={() => {
          setEditVisible(false);
          setEditingBrand(null);
          fetchBrands();
        }}
      />
    </Card>
  );
};

export default BrandList;
