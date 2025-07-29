




import {
    Button,
    Popconfirm,
    Space,
    Table,
    Tag,
    Typography,
    Card,
    Divider,
  } from "antd";
  import { useEffect } from "react";
  import { toast } from "react-toastify";
  import { MdRestore, MdDeleteForever } from "react-icons/md";
  import { formatCurrency } from "../../../../utils/Format";
  import { useLoading } from "../../../../contexts/LoadingContext";
  import useQuery from "../../../../hooks/useQuery";
  import useFetchList from "../../../../hooks/useFetchList";
  import type { ColumnsType } from "antd/es/table";
  import type { IProduct } from "../../../../types/IProducts";
  import axios from "axios";
  
  const { Title } = Typography;
  
  const DeletedProducts: React.FC = () => {
    const { setLoading } = useLoading();
  
    const [query, updateQuery] = useQuery({
      page: 1,
      limit: 10,
    });
  
    const {
      data: rawData,
      refetch,
    } = useFetchList<any>("product/deleted", query, {});
  
    // Sửa lại: Vì API trả về mảng đơn giản
    const rawProducts = Array.isArray(rawData) ? rawData : [];
    const total = rawProducts.length;
  
    useEffect(() => {
      if (rawData) {
        console.log("🧪 rawData FULL:", JSON.stringify(rawData, null, 2));
        setLoading(false);
      }
    }, [rawData, setLoading]);
  
    const products: IProduct[] = rawProducts.map((item: any) => {
      const rawPath = item.imageUrls?.[0] ?? "";
      const fullPath = rawPath.startsWith("http")
        ? rawPath
        : `http://localhost:5000/${rawPath.replace(/\\/g, "/")}`;
  
      return {
        key: item._id,
        _id: item._id,
        id: item._id,
        title: item.product_name,
        price: item.basePrice,
        thumbnail: fullPath,
        category: item.category_id?.category_name || "Chưa phân loại",
        brand: item.brand_id?.brand_name || "Không rõ",
      };
    });
  
    
      
  
    const columns: ColumnsType<IProduct> = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        align: "center",
        render: (id) => <Tag color="red">#{id}</Tag>,
      },
      {
        title: "Sản phẩm",
        key: "product",
        render: (_, record) => (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={record.thumbnail}
              alt="thumbnail"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #eee",
              }}
            />
            <div>
              <strong>{record.title}</strong>
              <div style={{ fontSize: 12, color: "#888" }}>{record.brand}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (price) => (
          <span style={{ color: "#fa541c", fontWeight: 600 }}>
            {formatCurrency(price)}
          </span>
        ),
      },
      {
        title: "Danh mục",
        dataIndex: "category",
        key: "category",
        render: (category) => (
          <Tag color="geekblue" style={{ borderRadius: "12px" }}>
            {category}
          </Tag>
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 130,
        align: "center",
        render: (_, record) => (
          <Space>
            <Button
              icon={<MdRestore />}
              type="default"
              onClick={() => handleRestore(record.id)}
              title="Khôi phục"
            />
            <Popconfirm
              title="Xác nhận xoá vĩnh viễn?"
              onConfirm={() => handleHardDelete(record.id)}
              okText="Xóa"
              cancelText="Huỷ"
            >
              <Button icon={<MdDeleteForever />} danger title="Xóa vĩnh viễn" />
            </Popconfirm>
          </Space>
        ),
      },
    ];
  
    return (
      <div style={{ padding: 24 }} className="bg-gray-50">
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
            🗑️ Sản phẩm đã xoá
          </Title>
  
          <Divider />
  
          <Table
            dataSource={products}
            rowKey="key"
            columns={columns}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
              onChange: (page, pageSize) => {
                setLoading(true);
                updateQuery({ page, limit: pageSize });
              },
              onShowSizeChange: (_current, size) => {
                setLoading(true);
                updateQuery({ page: 1, limit: size });
              },
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    );
  };
  
  export default DeletedProducts;
  
 