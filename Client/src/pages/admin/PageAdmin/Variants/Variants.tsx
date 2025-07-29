import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Image,
  Input,
  Popconfirm,
  Table,
  Tag,
  Typography,
  Space,
  Switch,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import type { IVariants } from "../../../../types/IVariants";
import { toast } from "react-toastify";
import {
  deleteVariant,
  getAllVariants,
  softDeleteVariant, // Thêm chức năng xoá mềm
} from "../../../../services/admin/variantServices";
import type { ErrorType } from "../../../../types/error/IError";
import { useLoading } from "../../../../contexts/LoadingContext";
import { formatCurrency } from "../../../../utils/Format";

const { Title } = Typography;

const Variants: React.FC = () => {
  const [variants, setVariants] = useState<IVariants[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showHidden, setShowHidden] = useState(false); // sẽ dùng ở bước tiếp theo
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { setLoading } = useLoading();

  const fetchVariants = useCallback(async () => {
    try {
      setLoading(true);
      const { data, total } = await getAllVariants(
        currentPage,
        pageSize,
        searchText
      );
      setVariants(data);
      setTotalItems(total);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, currentPage, pageSize, searchText]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  //  Hàm xử lý xoá mềm biến thể
  const handleSoftDelete = async (id: string) => {
    try {
      setLoading(true);
      await softDeleteVariant(id);
      toast.success("Đã ẩn biến thể thành công!");
      fetchVariants();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi khi xoá mềm.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteVariant(id);
      fetchVariants();
      toast.success("Xóa cứng biến thể thành công!");
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id", width: 80 },
    {
      title: "Tên sản phẩm",
      key: "product_name",
      render: (_: IVariants, record: IVariants) =>
        record.product_id?.product_name || <Tag color="red">Không có</Tag>,
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      render: (size: string) => <Tag color="blue">{size}</Tag>,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color: string) => <Tag color="green">{color}</Tag>,
    },
    { title: "Số lượng", dataIndex: "stock", key: "stock" },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-semibold text-blue-600">
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (images: string[] = []) => (
        <div className="flex gap-1">
          {images.slice(0, 2).map((img, index) => (
            <Image
              key={index}
              width={40}
              height={40}
              src={
                img.startsWith("http")
                  ? img
                  : `http://localhost:5000/${img.replace(/\\/g, "/")}`
              }
              className="rounded-md object-cover"
              preview={{ src: img }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: IVariants, record: IVariants) => (
        <Space>
          <Button icon={<EditOutlined />} />
          {/*  Nút xoá mềm biến thể */}
          <Popconfirm
            title="Ẩn biến thể này khỏi danh sách chính?"
            onConfirm={() => handleSoftDelete(record._id)}
            okText="Ẩn"
            cancelText="Huỷ"
          >
            <Button icon={<EyeInvisibleOutlined />} />
          </Popconfirm>
          <Popconfirm
            title="Xác nhận xóa cứng biến thể này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Quản Lý Biến Thể Sản Phẩm</Title>
      </div>

      <Card
        title="Danh Sách Biến Thể"
        extra={
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm Biến Thể
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={variants}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "30", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} biến thể`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            style: { marginTop: 16 },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Variants;
