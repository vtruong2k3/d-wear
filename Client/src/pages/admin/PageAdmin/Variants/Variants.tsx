import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Image,
  Input,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Typography,
  Space,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import type { IVariants } from "../../../../types/IVariants";
import { toast } from "react-toastify";
import {
  deleteVariant,
  getAllVariants,
  getSoftDeletedVariants,
  softDeleteVariant,
  restoreVariant,
} from "../../../../services/admin/variantServices";
import type { ErrorType } from "../../../../types/error/IError";

import { formatCurrency } from "../../../../utils/Format";

const { Title } = Typography;

const Variants: React.FC = () => {
  const [variants, setVariants] = useState<IVariants[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [showHidden, setShowHidden] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVariants = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (showHidden) {
        res = await getSoftDeletedVariants(currentPage, pageSize, searchText);
      } else {
        res = await getAllVariants(currentPage, pageSize, searchText);
      }
      setVariants(res.data);
      setTotalItems(res.total);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, currentPage, pageSize, searchText, showHidden]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const handleSoftDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await softDeleteVariant(id);
      toast.success(res.message);
      fetchVariants();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi khi ẩn.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setLoading(true);
      const res = await restoreVariant(id);
      toast.success(res.message);
      fetchVariants();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi khi khôi phục.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await deleteVariant(id);
      toast.success(res.message);
      fetchVariants();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi khi xoá.";
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
          {!showHidden ? (
            <>
              <Button icon={<EditOutlined />} />

              <Popconfirm
                title="Xác nhận xoá mềm sản phẩm"
                onConfirm={() => handleSoftDelete(record._id)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          ) : (
            <>
              <Popconfirm
                title="Khôi phục biến thể này?"
                onConfirm={() => handleRestore(record._id)}
                okText="Khôi phục"
                cancelText="Huỷ"
              >
                <Button icon={<RollbackOutlined />} type="primary"></Button>
              </Popconfirm>
              <Popconfirm
                title="Xoá vĩnh viễn biến thể này?"
                onConfirm={() => handleDelete(record._id)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Quản Lý Biến Thể Sản Phẩm</Title>
        <Switch
          checked={showHidden}
          onChange={(checked) => {
            setShowHidden(checked);
            setCurrentPage(1);
          }}
          checkedChildren="Đã xoá"
          unCheckedChildren="Hoạt động"
        />
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
          loading={loading}
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
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
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
