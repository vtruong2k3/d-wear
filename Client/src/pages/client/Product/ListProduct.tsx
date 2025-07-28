import { useEffect, useReducer, useState } from "react";
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
import useFetchGetDataAllCategory from "../../../hooks/Client/useFetchGetDataAllCategory";
import useFetchGetDataProduct from "../../../hooks/Client/useFetchGetDataProduct";
import BoxProduct from "../../../components/Client/BoxProduct/BoxProduct";
import BannerProductList from "./BannerProductList";
import {
  filterProductReducer,
  initialState,
  TYPE_ACTION,
} from "./Reducer/FilterProductReducer";
import useHandleChange from "../../../hooks/Client/useHandleChange";
import useDebounce from "../../../hooks/Client/useDebounce";
import { useSearchParams } from "react-router-dom";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Interfaces
interface Category {
  id: string | number;
  name: string;
  slug: string;
}

interface Product {
  id: string | number;
  title: string;
  price: number;
}

interface FilterState {
  limit: number;
  sortBy?: string;
  order?: string;
  q?: string;
  skip?: number;
  minPrice?: number;
  maxPrice?: number;
}

const ListProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useFetchGetDataAllCategory();
  const [category, setCategory] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 10000000]);
  const [filterProduct, dispatch] = useReducer(
    filterProductReducer,
    initialState
  );
  const { formData, handleChange } = useHandleChange({ valueSearch: "" });
  const { products, totalProduct } = useFetchGetDataProduct(
    category,
    filterProduct
  );
  const debouncedValue = useDebounce(formData.valueSearch, 500);

  const handleChangeSort = (value: string) => {
    const sortValue = value.split(",");
    dispatch({
      type: TYPE_ACTION.CHANGE_SORT,
      payload: {
        sortBy: sortValue[0],
        order: sortValue[1],
      },
    });
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: TYPE_ACTION.CHANGE_PAGE,
      payload: (page - 1) * 12,
    });
  };

  const handleSearch = (value: string) => {
    dispatch({
      type: TYPE_ACTION.CHANGE_QUERY,
      payload: value,
    });
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setTempPriceRange(value);
  };

  const handleApplyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    dispatch({
      type: TYPE_ACTION.CHANGE_PRICE_RANGE,
      payload: {
        minPrice: tempPriceRange[0],
        maxPrice: tempPriceRange[1],
      },
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  useEffect(() => {
    if (debouncedValue) {
      dispatch({
        type: TYPE_ACTION.CHANGE_QUERY,
        payload: debouncedValue,
      });
    } else {
      dispatch({
        type: TYPE_ACTION.CHANGE_QUERY,
        payload: "",
      });
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (filterProduct) {
      const stringJson = JSON.stringify({ ...filterProduct });
      const dataFilterJson = JSON.parse(stringJson);
      setSearchParams(new URLSearchParams(dataFilterJson));
    }
  }, [filterProduct]);

  useEffect(() => {
    let tmpDataFilter: FilterState = {
      limit: 12,
    };

    if (searchParams.size > 0) {
      const dataFromSearchParams = JSON.parse(
        '{"' +
        decodeURI(
          searchParams.toString().replace(/&/g, '","').replace(/=/g, '":"')
        ) +
        '"}'
      );

      tmpDataFilter = {
        limit: dataFromSearchParams["limit"] || 12,
        sortBy: dataFromSearchParams["sortBy"],
        order: dataFromSearchParams["order"],
        q: dataFromSearchParams["q"]?.replace(/\+/g, " "),
        skip: dataFromSearchParams["skip"],
        minPrice: dataFromSearchParams["minPrice"] ? Number(dataFromSearchParams["minPrice"]) : undefined,
        maxPrice: dataFromSearchParams["maxPrice"] ? Number(dataFromSearchParams["maxPrice"]) : undefined,
      };

      if (tmpDataFilter.minPrice !== undefined && tmpDataFilter.maxPrice !== undefined) {
        setPriceRange([tmpDataFilter.minPrice, tmpDataFilter.maxPrice]);
        setTempPriceRange([tmpDataFilter.minPrice, tmpDataFilter.maxPrice]);
      }

      dispatch({
        type: TYPE_ACTION.CHANGE_INITIAL,
        payload: { ...tmpDataFilter },
      });
    }
  }, []);

  const handleReset = () => {
    setPriceRange([0, 10000000]);
    setTempPriceRange([0, 10000000]);
    dispatch({
      type: TYPE_ACTION.CHANGE_RESET,
      payload: 12,
    });
  };

  const menuItems = [
    {
      key: "",
      label: (
        <Text strong={category === ""} style={{ color: category === "" ? '#1890ff' : '#000' }}>
          Tất cả sản phẩm
        </Text>
      ),
    },
    ...categories.map((item: Category) => ({
      key: item.slug,
      label: (
        <Text strong={category === item.slug} style={{ color: category === item.slug ? '#1890ff' : '#000' }}>
          {item.name}
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
                onClick={({ key }) => setCategory(key as string)}
                items={menuItems}
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
                      onChange={handlePriceRangeChange}
                      tooltip={{
                        formatter: (value) => formatPrice(value || 0)
                      }}
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
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
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
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                      />
                    </div>
                  </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    {formatPrice(tempPriceRange[0])} - {formatPrice(tempPriceRange[1])}
                  </Text>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleApplyPriceFilter}
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
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Input.Search
                    placeholder="Tìm kiếm sản phẩm..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onChange={(e) => handleChange(e)}
                    onSearch={handleSearch}
                    name="valueSearch"
                    value={formData.valueSearch}
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
                    onChange={handleChangeSort}
                    value={filterProduct.sortBy && filterProduct.order ?
                      `${filterProduct.sortBy},${filterProduct.order}` : undefined}
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
                      onClick={handleReset}
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
                  Hiển thị {products.length} trong tổng số {totalProduct} sản phẩm
                </Text>
                {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                  <Text type="secondary" style={{ marginLeft: '16px' }}>
                    • Giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Text>
                )}
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <Row gutter={[24, 24]}>
                {products.length > 0 ? (
                  products.map((item: Product) => (
                    <Col
                      key={item.id}
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
                      current={Math.floor((filterProduct.skip || 0) / 12) + 1}
                      total={totalProduct}
                      pageSize={12}
                      onChange={handleChangePage}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} của ${total} sản phẩm`
                      }
                      style={{
                        textAlign: 'center'
                      }}
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