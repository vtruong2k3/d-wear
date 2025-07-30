import { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Select,
  Input,
  Button,
  Card,
  Row,
  Col,
  Pagination,
  Typography,
  Space,
  Divider,
  Badge,
  Slider,
  InputNumber,
  Collapse
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  DownOutlined
} from "@ant-design/icons";


import BoxProduct from "../../../components/Client/BoxProduct/BoxProduct";
import BannerProductList from "./BannerProductList";


import type { IProducts } from "../../../types/IProducts";
import { formatCurrency } from "../../../utils/Format";
import useProductList from "../../../hooks/Client/useProduct";
import useQuery from "../../../hooks/useQuery";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";
import { fetchGetAllCategory } from "../../../services/client/apiServiceCategory";
import type { ICategory } from "../../../types/category/ICategory";

import type { IBrand } from "../../../types/brand/IBrand";
import { fetchAllBrands } from "../../../services/client/apiBrandService";
import { useLoading } from "../../../contexts/LoadingContext";


const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Interfaces



const ListProduct = () => {


  const [category, setCategory] = useState<string>(""); // Đang chọn
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brand, setBrand] = useState<string>("");
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 10000000]);
  const { setLoading } = useLoading()
  const [query, updateQuery] = useQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
    q: "",
  });
  const path = category || brand ? "product/by-category-band" : "product";
  const { data: products, total } = useProductList(path, {
    ...query,
    ...(category && { category_id: category }),
    ...(brand && { brand_id: brand }),

  });
  const getCategory = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchGetAllCategory()
      setCategories(res)
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        'Đã xảy ra lỗi khi tải danh sách.';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  const getAllBrand = async () => {
    try {
      setLoading(true)
      const res = await fetchAllBrands();
      setBrands(res)
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        'Đã xảy ra lỗi khi tải danh sách.';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllBrand()
    getCategory()
  }, [getCategory])

  const menuItems = [
    {
      key: "",
      label: (
        <Text strong={category === ""} style={{ color: category === "" ? '#1890ff' : '#000' }}>
          Tất cả sản phẩm
        </Text>
      ),
    },
    ...categories.map((item: ICategory) => ({
      key: item._id,
      label: (
        <Text strong={category === item._id} style={{ color: category === item._id ? '#1890ff' : '#000' }}>
          {item.category_name}
        </Text>
      ),
    })),
  ];

  const menuItemBrands = [
    {
      key: "",
      label: (
        <Text strong={brand === ""} style={{ color: brand === "" ? '#1890ff' : '#000' }}>
          Tất cả sản phẩm
        </Text>
      ),
    },
    ...brands.map((item: IBrand) => ({
      key: item._id,
      label: (
        <Text strong={brand === item._id} style={{ color: brand === item._id ? '#1890ff' : '#000' }}>
          {item.brand_name}
        </Text>
      ),
    })),
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <BannerProductList />

      <Layout style={{ backgroundColor: 'transparent', margin: '24px 24px 0', minHeight: 'auto' }}>
        <Sider
          width={280}
          style={{
            backgroundColor: '#fff',
            borderRight: '1px solid #f0f0f0',
            padding: '24px 16px',
            borderRadius: '8px',
            marginRight: '24px',
            height: 'fit-content'
          }}
        >
          <Collapse
            defaultActiveKey={['categories', 'price', 'status']}
            ghost
            expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
          >
            <Panel
              header={<Title level={4} style={{ margin: 0, color: '#000' }}>Danh mục sản phẩm</Title>}
              key="categories"
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e8e8e8',
                borderRadius: '6px',
                marginBottom: '16px'
              }}
            >
              <Menu
                mode="vertical"
                selectedKeys={[category]}
                onClick={({ key }) => {
                  setCategory(key as string);
                  updateQuery({ page: 1 }); // reset phân trang
                }}
                items={menuItems}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              />
            </Panel>
            <Panel
              header={<Title level={4} style={{ margin: 0, color: '#000' }}>Thương hiệu</Title>}
              key="brands"
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e8e8e8',
                borderRadius: '6px',
                marginBottom: '16px'
              }}
            >
              <Menu
                mode="vertical"
                selectedKeys={[brand]}
                onClick={({ key }) => {
                  setBrand(key as string);
                  updateQuery({ page: 1 }); // reset phân trang
                }}
                items={menuItemBrands}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              />
            </Panel>

            <Panel
              header={<Title level={4} style={{ margin: 0, color: '#000' }}>Lọc theo giá</Title>}
              key="price"
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e8e8e8',
                borderRadius: '6px',
                marginBottom: '16px'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ color: '#000' }}>Khoảng giá:</Text>
                  <div style={{ margin: '16px 0' }}>
                    <Slider
                      range
                      min={0}
                      max={10000000}
                      step={100000}
                      value={tempPriceRange}


                    />
                  </div>
                </div>

                <Row gutter={8}>
                  <Col span={12}>
                    <div>
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Từ:</Text>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        max={10000000}
                        step={100000}
                        value={tempPriceRange[0]}
                        onChange={(value) => setTempPriceRange([value || 0, tempPriceRange[1]])}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}
                      />

                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Đến:</Text>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        max={10000000}
                        step={100000}
                        value={tempPriceRange[1]}
                        onChange={(value) => setTempPriceRange([tempPriceRange[0], value || 10000000])}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}
                      />

                    </div>
                  </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    {formatCurrency(tempPriceRange[0])} - {formatCurrency(tempPriceRange[1])}
                  </Text>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setPriceRange(tempPriceRange);
                      updateQuery({ page: 1 });
                    }}
                    style={{ width: '100%' }}
                  >
                    Áp dụng
                  </Button>
                </div>
              </Space>
            </Panel>

            <Panel
              header={<Title level={4} style={{ margin: 0, color: '#000' }}>Tình trạng</Title>}
              key="status"
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e8e8e8',
                borderRadius: '6px'
              }}
            >
              <Space direction="vertical" size="small">
                <Badge count={16} style={{ backgroundColor: '#52c41a' }}>
                  <Text style={{ color: '#000', marginLeft: '8px' }}>Còn hàng</Text>
                </Badge>
                <Badge count={1} style={{ backgroundColor: '#ff4d4f' }}>
                  <Text style={{ color: '#8c8c8c', marginLeft: '8px' }}>Hết hàng</Text>
                </Badge>
              </Space>
            </Panel>
          </Collapse>
        </Sider>

        <Layout style={{ padding: '0', backgroundColor: 'transparent' }}>
          <Content style={{ backgroundColor: 'transparent' }}>
            <Card
              bordered={false}
              style={{
                backgroundColor: '#fff',
                marginBottom: '24px',
                border: '1px solid #e8e8e8'
              }}
            >
              <Row justify="space-between" align="middle" gutter={[16, 16]} >
                <Col xs={24} sm={12} md={8}>
                  <Input.Search
                    placeholder="Tìm kiếm sản phẩm..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    defaultValue={query.q}
                    onSearch={(value) => updateQuery({ page: 1, q: value })}
                    onChange={(e) => {
                      if (!e.target.value) updateQuery({ page: 1, q: "" });
                    }}
                    style={{
                      borderRadius: '6px',
                      border: '1px solid #d9d9d9'
                    }}
                  />
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Select
                    placeholder="Sắp xếp theo"
                    size="large"
                    style={{ width: '100%' }}

                  >
                    <Option value="">Mặc định</Option>
                    <Option value="price,desc">Giá: Cao đến thấp</Option>
                    <Option value="price,asc">Giá: Thấp đến cao</Option>
                    <Option value="title,asc">Tên: A-Z</Option>
                    <Option value="title,desc">Tên: Z-A</Option>
                  </Select>
                </Col>

                <Col xs={24} md={8}>
                  <Space>
                    <Button.Group>
                      <Button
                        type={viewMode === 'grid' ? 'primary' : 'default'}
                        icon={<AppstoreOutlined />}
                        onClick={() => setViewMode('grid')}
                      />
                      <Button
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        icon={<UnorderedListOutlined />}
                        onClick={() => setViewMode('list')}
                      />
                    </Button.Group>

                    <Button

                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setCategory('');
                        setTempPriceRange([0, 10000000]);
                        setPriceRange([0, 10000000]);
                        updateQuery({ page: 1, q: '', sortBy: 'createdAt', order: 'desc' });
                      }}
                      style={{
                        borderColor: '#d9d9d9',
                        color: '#000'
                      }}
                    >
                      Đặt lại
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card
              bordered={false}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e8e8e8'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">
                  Hiển thị {products.length} trong tổng số {total} sản phẩm
                </Text>
                {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                  <Text type="secondary" style={{ marginLeft: '16px' }}>
                    • Giá: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </Text>
                )}
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <Row gutter={[24, 24]}>
                {products.length > 0 ? (
                  products.map((item: IProducts) => (
                    <Col
                      key={item._id}
                      xs={24}
                      sm={12}
                      md={viewMode === 'grid' ? 8 : 24}
                      lg={viewMode === 'grid' ? 6 : 24}
                    >
                      <BoxProduct item={item} />
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <div style={{
                      textAlign: 'center',
                      padding: '60px 0',
                      color: '#8c8c8c'
                    }}>
                      <Title level={4} type="secondary">
                        Không tìm thấy sản phẩm nào
                      </Title>
                      <Text type="secondary">
                        Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc
                      </Text>
                    </div>
                  </Col>
                )}
              </Row>

              {products.length > 0 && (
                <>
                  <Divider style={{ margin: '32px 0' }} />
                  <Row justify="center">
                    <Pagination
                      current={query.page}
                      total={total}
                      pageSize={query.limit}
                      onChange={(page) => updateQuery({ page })}
                      showSizeChanger={false}
                    />
                  </Row>
                </>
              )}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ListProduct;