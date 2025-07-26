import React, { useCallback, useEffect, useState } from "react";
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
  UndoOutlined,
} from "@ant-design/icons";
import type { IVariants } from "../../../../types/IVariants";
import { toast } from "react-toastify";
import {
  deleteVariant,
  getAllVariants,
} from "../../../../services/admin/variantServices";
import type { ErrorType } from "../../../../types/error/IError";
import { useLoading } from "../../../../contexts/LoadingContext";
import { formatCurrency } from "../../../../utils/Format";

const { Title } = Typography;

const Variants: React.FC = () => {
  const [variants, setVariants] = useState<IVariants[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const { setLoading } = useLoading();

  const getHiddenIds = () => {
    const raw = localStorage.getItem("hiddenVariants") || "[]";
    return JSON.parse(raw) as string[];
  };

  const saveHiddenIds = (ids: string[]) => {
    localStorage.setItem("hiddenVariants", JSON.stringify(ids));
  };

  const handleHide = (id: string) => {
    const ids = getHiddenIds();
    if (!ids.includes(id)) {
      ids.push(id);
      saveHiddenIds(ids);
      toast.success("Đã ẩn biến thể!");
      fetchVariants();
    }
  };

  const handleRestore = (id: string) => {
    const ids = getHiddenIds().filter((hiddenId) => hiddenId !== id);
    saveHiddenIds(ids);
    toast.success("Đã khôi phục biến thể!");
    fetchVariants();
  };

  const fetchVariants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllVariants();
      setVariants(data);
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
    fetchVariants();
  }, [fetchVariants]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteVariant(id);
      setVariants((prev) => prev.filter((v) => v._id !== id));
      toast.success("Xóa biến thể thành công!");
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

  const hiddenIds = getHiddenIds();

  const filteredVariants = variants.filter((variant) => {
    const match =
      variant.product_id?.product_name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      variant.size.toLowerCase().includes(searchText.toLowerCase()) ||
      variant.color.toLowerCase().includes(searchText.toLowerCase());
    const isHidden = hiddenIds.includes(variant._id);
    return showHidden ? isHidden && match : !isHidden && match;
  });

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
          {!showHidden ? (
            <Popconfirm
              title="Ẩn biến thể này khỏi danh sách chính?"
              onConfirm={() => handleHide(record._id)}
              okText="Ẩn"
              cancelText="Huỷ"
            >
              <Button icon={<EyeInvisibleOutlined />} />
            </Popconfirm>
          ) : (
            <Button
              icon={<UndoOutlined />}
              onClick={() => handleRestore(record._id)}
            >
              Khôi phục
            </Button>
          )}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2} className="mb-6">
          {showHidden ? "Biến Thể Đã Ẩn" : "Quản Lý Biến Thể Sản Phẩm"}
        </Title>
        <Space>
          <span>Hiển thị biến thể đã ẩn:</span>
          <Switch
            checked={showHidden}
            onChange={setShowHidden}
            checkedChildren="Đã ẩn"
            unCheckedChildren="Hoạt động"
          />
        </Space>
      </div>

      <Card
        title={showHidden ? "Danh Sách Đã Ẩn" : "Danh Sách Biến Thể"}
        extra={
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
          dataSource={filteredVariants}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Variants;
