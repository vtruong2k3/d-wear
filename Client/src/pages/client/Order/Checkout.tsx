import {
  Button,
  Card,
  Col,
  Row,
  Divider,
  Typography,
  Image,
  Input,
  Space,
  Tag,
  Descriptions,
  List,
  Form,
  Select,
  Radio,
  Checkbox,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import AddAddressModal from "../../../components/Client/Address/AddressModal";
import { useCallback } from "react";
import { fetCheckVoucher } from "../../../services/client/apiVoucherService";
import type { ErrorType } from "../../../types/error/IError";
import { createOrder } from "../../../services/client/orderAPI";
import type { OrderData } from "../../../types/order/IOrder";
import type { IVoucher } from "../../../types/voucher/IVoucher";
import toast from "react-hot-toast";
import {
  getProvinces,
  getDistricts,
  getWards,
  calculateShippingFee,
} from "../../../services/client/ghnService";
import {
  getUserAddresses,
  addUserAddress,
} from "../../../services/client/addressService";
import { removeOrderedItems } from "../../../redux/features/client/cartSlice";
import { initiateMomoPayment } from "../../../services/client/momoService";
import type {
  District,
  Province,
  SavedAddress,
  Ward,
} from "../../../types/address/IAddress";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export type VoucherPreview = Pick<
  IVoucher,
  "_id" | "code" | "discountType" | "discountValue" | "maxDiscountValue"
>;

// Interface cho địa chỉ đã lưu

const Checkout = () => {
  const location = useLocation();
  const [selectedItems] = useState<string[]>(
    () => location.state?.selectedItems || []
  );

  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(
    (state: RootState) => state.cartSlice.cartItems
  );
  const { user } = useSelector((state: RootState) => state.authenSlice);
  const [paymentMethodValue, setPaymentMethod] = useState<string>("cod");

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherPreview | null>(
    null
  );
  const [form] = Form.useForm();
  // const [addAddressForm] = Form.useForm();

  // State cho địa chỉ
  const [addressType, setAddressType] = useState<"saved" | "manual">("saved");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddAddressModalVisible, setIsAddAddressModalVisible] =
    useState(false);

  // State cho tỉnh/thành phố, quận/huyện, phường/xã (chỉ cho địa chỉ nhập tay)
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Load dữ liệu địa điểm khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách tỉnh và chuẩn hóa ID
        const provinceRes = await getProvinces();
        const rawProvinces = provinceRes.data?.provinces ?? [];
        const normalizedProvinces = rawProvinces.map((item) => ({
          id: String(item.ProvinceID ?? item.id), // Ép kiểu id về string
          name: item.ProvinceName ?? item.name,
          shippingFee: item.shippingFee || 25000,
          ...item,
        }));

        setProvinces(normalizedProvinces);

        // Lấy danh sách địa chỉ người dùng
        const addressRes = await getUserAddresses();
        const addresses = addressRes.data.address ?? [];

        if (!Array.isArray(addresses)) {
          console.error("❌ Dữ liệu address không phải mảng:", addressRes.data);
          return;
        }

        setSavedAddresses(addresses);

        // Tìm địa chỉ mặc định
        const defaultAddress = addresses.find((addr) => addr.isDefault);

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          form.setFieldsValue({
            name: defaultAddress.name,
            phone: defaultAddress.phone,
            address: defaultAddress.fullAddress,
          });

          // Load quận và phường tương ứng
          const districtRes = await getDistricts(defaultAddress.provinceId);
          setDistricts(districtRes.data?.districts || []);

          const wardRes = await getWards(defaultAddress.districtId);
          setWards(wardRes.data?.wards || []);

          // Tính phí ship dựa trên tỉnh đã normalize
          const province = normalizedProvinces.find(
            (p) => p.id === String(defaultAddress.provinceId)
          );

          if (province) {
            setShippingFee(province.shippingFee || 1000);
          } else {
            console.warn(
              "❌ Không tìm thấy tỉnh tương ứng với ID:",
              defaultAddress.provinceId
            );
            setShippingFee(25000); // fallback
          }
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [form, user]);

  // Memo lấy các sản phẩm được chọn
  const itemsToCheckout = useMemo(() => {
    return cartItems.filter((item) => selectedItems.includes(item._id));
  }, [cartItems, selectedItems]);

  // Tính tổng đơn hàng
  const rawTotal = useMemo(() => {
    return itemsToCheckout.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [itemsToCheckout]);

  // Xử lý khi thay đổi loại địa chỉ
  const handleAddressTypeChange = (type: "saved" | "manual") => {
    setAddressType(type);

    if (type === "manual") {
      // Reset tất cả state liên quan đến địa chỉ đã lưu
      setSelectedAddressId("");
      form.resetFields(["name", "phone", "address"]);
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
      setShippingFee(0);
    } else {
      // Reset state địa chỉ nhập tay
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");

      // Nếu có địa chỉ mặc định thì tự động chọn
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        handleAddressSelect(defaultAddress.id);
      } else {
        // Nếu không có địa chỉ mặc định, reset form
        form.resetFields(["name", "phone", "address"]);
        setShippingFee(0);
      }
    }
  };

  // Xử lý khi chọn địa chỉ từ dropdown
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(
      (addr) => addr._id === addressId || addr.id === addressId
    );

    if (selectedAddress) {
      form.setFieldsValue({
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        address: selectedAddress.fullAddress,
      });

      const province = provinces.find(
        (p) => p.id === selectedAddress.provinceId
      );

      if (province) {
        setShippingFee(province.shippingFee || 25000); // fallback nếu thiếu
      } else {
        console.warn(
          "❌ Không tìm thấy tỉnh tương ứng với ID:",
          selectedAddress.provinceId
        );
        setShippingFee(25000); // fallback mặc định
      }
    } else {
      console.warn("⚠️ Không tìm thấy địa chỉ phù hợp");
    }
  };

  // Xử lý khi chọn tỉnh/thành phố (cho địa chỉ nhập tay)
  const handleProvinceChange = async (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setSelectedWard("");
    form.setFieldValue("address", "");

    try {
      const res = await getDistricts(provinceId);
      console.log("res.data từ getDistricts:", res.data); // 👈 thêm dòng này
      setDistricts(Array.isArray(res.data.districts) ? res.data.districts : []); // 👈 sửa dòng này
    } catch (err) {
      toast.error("Lỗi tải quận/huyện");
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedWard("");
    form.setFieldValue("address", "");

    try {
      const res = await getWards(districtId);
      console.log("res.data từ getWards:", res.data);

      if (!Array.isArray(res.data.wards)) {
        console.warn(
          "⚠️ Wards không phải mảng! res.data.wards =",
          res.data.wards
        );
      }

      const formattedWards =
        res.data.wards?.map((w: any) => ({
          wardId: w.WardCode,
          wardName: w.WardName,
          districtId: w.DistrictID,
        })) || [];

      setWards(formattedWards);
    } catch (err) {
      toast.error("Lỗi tải phường/xã");
      console.error("Lỗi khi gọi getWards:", err);
    }
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = async (wardId: string) => {
    setSelectedWard(wardId);

    // Cập nhật địa chỉ đầy đủ
    updateFullAddress(wardId);

    if (selectedDistrict && wardId) {
      try {
        const feeRes = await calculateShippingFee({
          to_district_id: Number(selectedDistrict),
          to_ward_code: wardId,
          weight: 1000, // Giả sử sản phẩm nặng 1kg
          length: 20, // cm
          width: 15,
          height: 10,
          service_type_id: 2, // Loại dịch vụ vận chuyển
        });

        setShippingFee(feeRes.data.fee.total);
      } catch (err) {
        console.error(err);
        toast.error("Không tính được phí vận chuyển");
        setShippingFee(0);
      }
    }
  };

  // Cập nhật địa chỉ đầy đủ (cho địa chỉ nhập tay)
  const updateFullAddress = (wardId?: string) => {
    const detailAddress = form.getFieldValue("detailAddress") || "";
    const currentWardId = wardId || selectedWard;

    if (
      selectedProvince &&
      selectedDistrict &&
      currentWardId &&
      detailAddress
    ) {
      const province = provinces.find(
        (p) => String(p.ProvinceID) === String(selectedProvince)
      );
      const district = districts.find(
        (d) => String(d.DistrictID) === String(selectedDistrict)
      );
      const ward = wards.find(
        (w) => String(w.wardId) === String(currentWardId)
      );

      if (province && district && ward) {
        const fullAddress = `${detailAddress}, ${ward.wardName}, ${district.DistrictName}, ${province.ProvinceName}`;
        form.setFieldValue("address", fullAddress);
      }
    }
  };

  // Xử lý thêm địa chỉ mới
  const handleAddNewAddress = (newAddress: SavedAddress) => {
    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    let updatedAddresses = [...savedAddresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }
    updatedAddresses.push(newAddress);

    setSavedAddresses(updatedAddresses);

    // Tự động chọn địa chỉ vừa thêm
    setSelectedAddressId(newAddress.id);
    form.setFieldsValue({
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.fullAddress,
    });

    // Tính phí ship
    const province = provinces.find((p) => p.id === newAddress.provinceId);
    if (province) {
      setShippingFee(province.shippingFee);
    }

    // Đóng modal
    setIsAddAddressModalVisible(false);
  };

  //  Hàm kiểm tra voucher
  const checkVoucher = useCallback(
    async (code: string) => {
      if (!code || code.trim() === "") {
        toast.error("Vui lòng nhập mã voucher");
        return;
      }
      try {
        setIsLoading(true);
        if (!user?._id) {
          toast.error("Không tìm thấy thông tin người dùng");
          return;
        }

        const res = await fetCheckVoucher({
          code,
          total: rawTotal,
          user_id: user._id,
        });

        const data = res.data;
        setSelectedVoucher({
          _id: data.voucher_id,
          code: code,
          discountValue:
            data.discountType === "percentage"
              ? rawTotal > 0
                ? (data.discount * 100) / rawTotal
                : 0
              : data.discount,
          discountType: data.discountType,
          maxDiscountValue:
            data.discountType === "percentage" ? data.discount : data.discount,
        });

        toast.success("Áp dụng mã thành công!");
      } catch (error) {
        const errorMessage =
          (error as ErrorType).response?.data?.message ||
          (error as ErrorType).message ||
          "Đã xảy ra lỗi, vui lòng thử lại.";
        toast.error(errorMessage);
        setSelectedVoucher(null);
      } finally {
        setIsLoading(false);
      }
    },
    [rawTotal, user?._id]
  );

  // Tính giảm giá
  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.discountType === "percentage") {
      const percentage = (rawTotal * selectedVoucher.discountValue) / 100;
      return Math.min(percentage, selectedVoucher.maxDiscountValue);
    }
    return selectedVoucher.discountValue;
  }, [selectedVoucher, rawTotal]);

  const finalTotal = rawTotal - discount + shippingFee;
  const isOverFiveProducts =
    itemsToCheckout.reduce((sum, item) => sum + item.quantity, 0) > 4;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  // Validation trước khi submit
  const validateAddressData = () => {
    if (addressType === "saved") {
      if (!selectedAddressId) {
        toast.error("Vui lòng chọn địa chỉ giao hàng");
        return false;
      }
    } else {
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
        return false;
      }
      const detailAddress = form.getFieldValue("detailAddress");
      if (!detailAddress || detailAddress.trim() === "") {
        toast.error("Vui lòng nhập địa chỉ chi tiết");
        return false;
      }
    }
    return true;
  };

  // Trong handleSubmit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!user || !user._id) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      // Kiểm tra địa chỉ
      if (!validateAddressData()) {
        return;
      }

      if (shippingFee === 0) {
        toast.error("Vui lòng chọn địa chỉ để tính phí vận chuyển");
        return;
      }

      const payment = paymentMethodValue.toLowerCase();
      if (!["cod", "momo", "vnpay"].includes(payment)) {
        toast.error("Phương thức thanh toán không hợp lệ");
        return;
      }

      const orderData: OrderData = {
        user_id: user._id,
        email: values.email,
        receiverName: values.name,
        shippingAddress: values.address,
        phone: values.phone,
        paymentMethod: payment as "cod" | "momo" | "vnpay",
        voucher_id: selectedVoucher?._id ?? null,
        shippingFee: shippingFee,
        items: itemsToCheckout.map((item) => ({
          product_id: item.product_id,
          product_image: item.product_image,
          product_name: item.product_name,
          variant_id: item.variant_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        note: note ?? "",
      };

      setIsLoading(true);

      const res = await createOrder(orderData);
      const { order_id, finalAmount, paymentMethod } = res.data;
      if (paymentMethod === "cod") {
        toast.success(res.data.message || "Đặt hàng thành công!");
        dispatch(removeOrderedItems(itemsToCheckout.map((i) => i._id)));
        navigate("/orders");
        return;
      }
      if (paymentMethod === "momo") {
        const res = await initiateMomoPayment(finalAmount, order_id);
        const { payUrl } = res;
        window.location.href = payUrl;
        return;
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveManualAddress = async () => {
    try {
      const values = await form.validateFields(); // ✅ Bắt buộc dùng cái này

      const province = provinces.find(
        (p) => p.ProvinceID === Number(selectedProvince)
      );
      const district = districts.find((d) => d.DistrictID === selectedDistrict);
      const ward = wards.find((w) => w.wardId === selectedWard);

      if (!province || !district || !ward) {
        message.warning("Vui lòng chọn đầy đủ Tỉnh/TP, Quận/Huyện, Phường/Xã.");
        return;
      }

      const addressData = {
        name: values.name,
        phone: values.phone,
        provinceId: Number(selectedProvince), // 👈 ép sang số
        provinceName: province.ProvinceName,
        districtId: Number(selectedDistrict), // 👈 ép sang số
        districtName: district.DistrictName,
        wardId: Number(selectedWard), // 👈 ép sang số
        wardName: ward.wardName,
        detailAddress: values.detailAddress || "",
        fullAddress: values.address || "",
        isDefault: false,
      };

      console.log("Data gửi lên server:", addressData);

      await addUserAddress(addressData);
      message.success("Đã lưu địa chỉ thành công.");
    } catch (err) {
      console.error(err);
      message.error("Lưu địa chỉ thất bại.");
    }
  };

  return (
    <div className="container mt-4">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Link to="/shopping-cart">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              Quay lại giỏ hàng
            </Button>
          </Link>
        </Col>

        <Col xs={24} lg={16}>
          <Card title={<Title level={3}>Thông tin giao hàng</Title>}>
            {/* Chọn loại địa chỉ */}
            <div style={{ marginBottom: 20 }}>
              <Text strong>Chọn cách nhập địa chỉ:</Text>
              <Radio.Group
                value={addressType}
                onChange={(e) => handleAddressTypeChange(e.target.value)}
                style={{ marginTop: 8, display: "block" }}
              >
                <Radio value="saved">Chọn từ địa chỉ đã lưu</Radio>
                <Radio value="manual">Nhập địa chỉ mới</Radio>
              </Radio.Group>
            </div>

            {/* Phần chọn địa chỉ đã lưu */}
            {addressType === "saved" && (
              <div style={{ marginBottom: 20 }}>
                <Text strong>Địa chỉ giao hàng:</Text>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Select
                    style={{ flex: 1 }}
                    placeholder="Chọn địa chỉ đã lưu"
                    value={selectedAddressId || undefined}
                    onChange={handleAddressSelect}
                    allowClear
                    onClear={() => {
                      setSelectedAddressId("");
                      form.resetFields(["name", "phone", "address"]);
                      setShippingFee(0);
                    }}
                    optionLabelProp="label"
                  >
                    {Array.isArray(savedAddresses) &&
                      savedAddresses.map((address, index) => {
                        const id =
                          address._id ?? address.id ?? `address-${index}`; // bảo đảm không null
                        return (
                          <Option
                            key={id}
                            value={id}
                            label={`${address.name} - ${address.phone}`}
                          >
                            <div
                              style={{ padding: "4px 0", lineHeight: "1.4" }}
                            >
                              <div style={{ marginBottom: "4px" }}>
                                <Text strong>{address.name}</Text>
                                {address.isDefault && (
                                  <Tag color="blue" style={{ marginLeft: 8 }}>
                                    Mặc định
                                  </Tag>
                                )}
                              </div>
                              <div style={{ marginBottom: "2px" }}>
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {address.phone}
                                </Text>
                              </div>
                              <div>
                                <Text
                                  type="secondary"
                                  style={{
                                    fontSize: "12px",
                                    display: "block",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {address.fullAddress}
                                </Text>
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddAddressModalVisible(true)}
                  >
                    Thêm địa chỉ
                  </Button>
                </div>
                {selectedAddressId && shippingFee > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="success">
                      Phí vận chuyển: {formatCurrency(shippingFee)}
                    </Text>
                  </div>
                )}
              </div>
            )}

            {/* Phần nhập địa chỉ thủ công */}
            {addressType === "manual" && (
              <div style={{ marginBottom: 20 }}>
                <Text strong>Nhập địa chỉ giao hàng:</Text>

                {/* Chọn địa điểm */}
                <Row gutter={[8, 8]} style={{ marginTop: 12 }}>
                  <Col span={8}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn Tỉnh/Thành phố"
                      value={selectedProvince || undefined}
                      onChange={(value) => {
                        handleProvinceChange(value); // gọi hàm gốc
                        updateFullAddress(); // ✅ tự động cập nhật địa chỉ
                      }}
                      allowClear
                      onClear={() => {
                        setSelectedProvince("");
                        setSelectedDistrict("");
                        setSelectedWard("");
                        setShippingFee(0);
                        form.setFieldValue("address", "");
                      }}
                    >
                      {provinces.map((province) => {
                        const id = province.ProvinceID;
                        const name = province.ProvinceName;

                        return (
                          <Select.Option key={id} value={id}>
                            {name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={8}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn Quận/Huyện"
                      value={selectedDistrict || undefined}
                      onChange={(value) => {
                        handleDistrictChange(value); // gọi hàm gốc
                        updateFullAddress(); //  cập nhật địa chỉ đầy đủ
                      }}
                      disabled={!selectedProvince}
                      allowClear
                      onClear={() => {
                        setSelectedDistrict("");
                        setSelectedWard("");
                        form.setFieldValue("address", "");
                      }}
                    >
                      {(Array.isArray(districts) ? districts : [])
                        .filter(
                          (district) => district.ProvinceID === selectedProvince
                        )
                        .map((district) => (
                          <Select.Option
                            key={district.DistrictID}
                            value={district.DistrictID}
                          >
                            {district.DistrictName}
                          </Select.Option>
                        ))}
                    </Select>
                  </Col>
                  <Col span={8}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn Phường/Xã"
                      value={selectedWard || undefined}
                      onChange={(value) => {
                        handleWardChange(value); // gọi hàm cập nhật selectedWard
                        updateFullAddress(value); // cập nhật địa chỉ đầy đủ với ward mới chọn
                      }}
                      disabled={!selectedDistrict}
                      allowClear
                      onClear={() => {
                        setSelectedWard("");
                        form.setFieldValue("address", "");
                      }}
                    >
                      {wards
                        .filter((w) => w.districtId === selectedDistrict)
                        .map((ward) => (
                          <Option key={ward.wardId} value={ward.wardId}>
                            {ward.wardName}
                          </Option>
                        ))}
                    </Select>
                  </Col>
                </Row>

                {/* Địa chỉ chi tiết */}
                <div style={{ marginTop: 12 }}>
                  <Form form={form} layout="vertical">
                    {/* Địa chỉ chi tiết */}
                    <Form.Item
                      name="detailAddress"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ chi tiết",
                        },
                      ]}
                      style={{ marginTop: 12 }}
                    >
                      <Input
                        placeholder="Nhập số nhà, tên đường"
                        value={form.getFieldValue("detailAddress")}
                        onChange={(e) => {
                          form.setFieldValue("detailAddress", e.target.value);
                          updateFullAddress();
                        }}
                      />
                    </Form.Item>
                  </Form>
                </div>

                {shippingFee > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="success">
                      Phí vận chuyển: {formatCurrency(shippingFee)}
                    </Text>
                  </div>
                )}
              </div>
            )}

            <Divider />

            <Form layout="vertical" form={form}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không đúng định dạng" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ đầy đủ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <TextArea
                  rows={2}
                  placeholder={
                    addressType === "manual"
                      ? "Địa chỉ đầy đủ sẽ được tự động tạo khi bạn chọn đủ thông tin"
                      : "Địa chỉ giao hàng"
                  }
                  disabled={addressType === "manual"}
                />
              </Form.Item>

              {/* Checkbox để lưu địa chỉ khi nhập tay */}
              {addressType === "manual" && (
  <Form.Item name="saveAddress" valuePropName="checked">
    <Checkbox
      onChange={(e) => {
        if (e.target.checked) {
          handleSaveManualAddress();
        }
      }}
    >
      Lưu địa chỉ này để sử dụng cho lần sau
    </Checkbox>
  </Form.Item>
)}

            </Form>
          </Card>

          {/* Danh sách sản phẩm */}
          <Card
            title={<Title level={3}>Danh sách sản phẩm</Title>}
            className="mt-3"
          >
            <List
              itemLayout="horizontal"
              dataSource={itemsToCheckout}
              renderItem={(item) => (
                <List.Item key={item._id}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        src={
                          item.product_image?.startsWith("http")
                            ? item.product_image
                            : `http://localhost:5000/${item.product_image?.replace(
                                /\\/g,
                                "/"
                              )}`
                        }
                        alt={item.product_name}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        preview={false}
                      />
                    }
                    title={<Text strong>{item.product_name}</Text>}
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <Text>Kích thước: </Text>
                          <Tag>{item.size || "null"}</Tag>
                        </div>
                        <div>
                          <Text>Màu sắc: </Text>
                          <Tag>{item.color || "null"}</Tag>
                        </div>
                        <div>
                          <Text>Số lượng: </Text>
                          <Text strong>{item.quantity}</Text>
                        </div>
                      </Space>
                    }
                  />
                  <div>
                    <Text strong type="danger">
                      {formatCurrency(item.price)}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Ghi chú */}
          <Card
            title={<Title level={3}>Ghi chú đơn hàng</Title>}
            className="mt-3"
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú cho đơn hàng (nếu có)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Card>
        </Col>

        {/* Tổng thanh toán và Voucher */}
        <Col xs={24} lg={8}>
          <Card title={<Title level={3}>Tổng thanh toán</Title>}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Tạm tính">
                  <Text>{formatCurrency(rawTotal)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phí vận chuyển">
                  <Text>{formatCurrency(shippingFee)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá">
                  <Text type="success">-{formatCurrency(discount)}</Text>
                </Descriptions.Item>
                <Divider />
                <Descriptions.Item label="Tổng thanh toán">
                  <Title level={4} type="success">
                    {formatCurrency(finalTotal)}
                  </Title>
                </Descriptions.Item>
              </Descriptions>

              {isOverFiveProducts && (
                <Text type="warning">
                  Đơn hàng có hơn 5 sản phẩm. Vui lòng thanh toán qua VNPay.
                </Text>
              )}

              <Button
                type={paymentMethodValue === "cod" ? "primary" : "default"}
                size="large"
                block
                onClick={() => setPaymentMethod("cod")}
                disabled={isOverFiveProducts}
              >
                Thanh toán khi nhận hàng (COD)
              </Button>

              <Button
                type={paymentMethodValue === "momo" ? "primary" : "default"}
                size="large"
                block
                onClick={() => setPaymentMethod("momo")}
              >
                Thanh toán online với MoMo
              </Button>

              <Button
                type="primary"
                size="large"
                block
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                loading={isLoading}
                disabled={
                  shippingFee === 0 ||
                  (addressType === "saved" && !selectedAddressId) ||
                  (addressType === "manual" &&
                    (!selectedProvince || !selectedDistrict || !selectedWard))
                }
              >
                {paymentMethodValue === "cod"
                  ? "Xác nhận đặt hàng"
                  : paymentMethodValue === "momo"
                  ? "Thanh toán với MoMo"
                  : "Thanh toán"}
              </Button>

              {/* Thông báo lỗi khi chưa đủ thông tin */}
              {shippingFee === 0 && (
                <Text
                  type="warning"
                  style={{ fontSize: "12px", textAlign: "center" }}
                >
                  {addressType === "saved"
                    ? "Vui lòng chọn địa chỉ giao hàng"
                    : "Vui lòng chọn đầy đủ thông tin địa chỉ để tính phí vận chuyển"}
                </Text>
              )}

              {addressType === "saved" && !selectedAddressId && (
                <Text
                  type="warning"
                  style={{ fontSize: "12px", textAlign: "center" }}
                >
                  Vui lòng chọn địa chỉ giao hàng từ danh sách
                </Text>
              )}

              {addressType === "manual" &&
                (!selectedProvince || !selectedDistrict || !selectedWard) && (
                  <Text
                    type="warning"
                    style={{ fontSize: "12px", textAlign: "center" }}
                  >
                    Vui lòng chọn đầy đủ: Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
                  </Text>
                )}
            </Space>
          </Card>

          {/* Voucher */}
          <Card
            title={<Title level={3}>Mã giảm giá (Voucher)</Title>}
            className="mt-3"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {selectedVoucher ? (
                <>
                  <Text strong>Mã đã chọn:</Text>
                  <Tag color="green">{selectedVoucher.code}</Tag>
                  <Text type="success">
                    {selectedVoucher.discountType === "percentage"
                      ? `Giảm ${selectedVoucher.discountValue.toFixed(2)}%`
                      : `Giảm ${formatCurrency(selectedVoucher.discountValue)}`}
                  </Text>
                  <Button onClick={() => setSelectedVoucher(null)}>
                    Hủy mã
                  </Button>
                </>
              ) : (
                <Text type="secondary">Bạn chưa chọn mã giảm giá nào</Text>
              )}

              <Input.Search
                placeholder="Nhập mã giảm giá"
                enterButton="Áp dụng"
                onSearch={checkVoucher}
                allowClear
                loading={isLoading}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm địa chỉ mới */}

      <AddAddressModal
        visible={isAddAddressModalVisible}
        onCancel={() => setIsAddAddressModalVisible(false)}
        onAddAddress={handleAddNewAddress}
        provinces={provinces}
        districts={districts}
        wards={wards}
        savedAddresses={savedAddresses}
      />
    </div>
  );
};

export default Checkout;
