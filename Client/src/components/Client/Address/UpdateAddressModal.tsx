import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Checkbox,
  Typography,
} from "antd";
import toast from "react-hot-toast";
import {
  getDistricts,
  getWards,
  calculateShippingFee,
} from "../../../services/client/ghnService";
import { updateUserAddress } from "../../../services/client/addressService";
import type {
  District,
  Province,
  RawDistrict,
  RawWard,
  SavedAddress,
  Ward,
} from "../../../types/address/IAddress";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface UpdateAddressModalProps {
    visible: boolean;
    onCancel: () => void;
    addressToUpdate: SavedAddress | null;
    provinces: Province[];
    districts: RawDistrict[];  // Hoặc District[] tuỳ bạn import
    wards: RawWard[];          // Hoặc Ward[]
    onProvinceChange: (provinceId: string) => void;
    onDistrictChange: (districtId: string) => void;
    onSuccess: () => void;
  }
  

const UpdateAddressModal: React.FC<UpdateAddressModalProps> = ({
  visible,
  onCancel,
  addressToUpdate,
  provinces,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState<RawDistrict[]>([]);
  const [wards, setWards] = useState<RawWard[]>([]);
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  // Populate dữ liệu khi mở modal
  useEffect(() => {
    if (addressToUpdate) {
      form.setFieldsValue({
        name: addressToUpdate.name,
        phone: addressToUpdate.phone,
        province: addressToUpdate.provinceId.toString(),
        district: addressToUpdate.districtId.toString(),
        ward: addressToUpdate.wardId,
        detailAddress: addressToUpdate.detailAddress,
        isDefault: addressToUpdate.isDefault,
      });

      // Gọi danh sách quận/huyện và phường/xã
      getDistricts(addressToUpdate.provinceId).then((res) => {
        const list = res.data?.districts || [];
        setDistricts(list);
      });

      getWards(addressToUpdate.districtId).then((res) => {
        const list = res.data?.wards || res.data?.data || [];
        setWards(list);
      });
    }
  }, [addressToUpdate, form]);

  const handleUpdate = async () => {
  try {
    // ✅ Thêm kiểm tra null trước
    if (!addressToUpdate) {
      toast.error("Không có địa chỉ cần cập nhật!");
      return;
    }

    const values = await form.validateFields();

    const province = provinces.find(
      (p) => p.ProvinceID === parseInt(values.province)
    );
    const district = districts.find(
      (d) => d.DistrictID === parseInt(values.district)
    );
    const ward = wards.find((w) => w.WardCode === values.ward);

    if (!province || !district || !ward) {
      toast.error("Vui lòng chọn đầy đủ địa chỉ");
      return;
    }

    const fullAddress = `${values.detailAddress}, ${ward.WardName}, ${district.DistrictName}, ${province.ProvinceName}`;

    const updatedData = {
      name: values.name,
      phone: values.phone,
      provinceId: parseInt(values.province),
      provinceName: province.ProvinceName,
      districtId: parseInt(values.district),
      districtName: district.DistrictName,
      wardId: values.ward,
      wardName: ward.WardName,
      detailAddress: values.detailAddress,
      fullAddress,
      isDefault: values.isDefault || false,
    };

    // ✅ Không cần `!` nữa vì đã đảm bảo addressToUpdate tồn tại
    const res = await updateUserAddress(addressToUpdate._id, updatedData);

    if (res.status === 200) {
      toast.success("Cập nhật địa chỉ thành công!");
      onSuccess(); // gọi lại danh sách địa chỉ
      form.resetFields();
      onCancel();
    } else {
      toast.error("Không thể cập nhật, thử lại sau!");
    }
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    toast.error("Cập nhật thất bại");
  }
};
  return (
    <Modal
      title="Cập nhật địa chỉ"
      open={visible}
      onOk={handleUpdate}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col span={8}>
            <Form.Item
              name="province"
              label="Tỉnh/TP"
              rules={[{ required: true, message: "Chọn tỉnh" }]}
            >
              <Select
                placeholder="Chọn tỉnh"
                onChange={async (value) => {
                  form.setFieldsValue({
                    district: undefined,
                    ward: undefined,
                  });
                  const res = await getDistricts(value);
                  setDistricts(res.data?.districts || []);
                }}
              >
                {provinces.map((p) => (
                  <Option key={p.ProvinceID} value={p.ProvinceID.toString()}>
                    {p.ProvinceName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Chọn quận/huyện" }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={async (value) => {
                  form.setFieldsValue({ ward: undefined });
                  const res = await getWards(value);
                  setWards(res.data?.wards || res.data?.data || []);
                }}
              >
                {districts.map((d) => (
                  <Option key={d.DistrictID} value={d.DistrictID.toString()}>
                    {d.DistrictName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true, message: "Chọn phường/xã" }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                onChange={async (wardCode) => {
                  const districtId = parseInt(form.getFieldValue("district"));
                  const res = await calculateShippingFee({
                    to_district_id: districtId,
                    to_ward_code: wardCode,
                    weight: 500,
                    length: 20,
                    width: 15,
                    height: 10,
                    service_type_id: 2,
                  });
                  const fee = res?.data?.fee?.total || 0;
                  setShippingFee(fee);
                  toast.success(`Phí ship: ${fee.toLocaleString()}đ`);
                }}
              >
                {wards.map((w) => (
                  <Option key={w.WardCode} value={w.WardCode}>
                    {w.WardName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="detailAddress"
          label="Địa chỉ chi tiết"
          rules={[{ required: true, message: "Nhập địa chỉ chi tiết" }]}
        >
          <TextArea rows={2} placeholder="Nhập số nhà, tên đường" />
        </Form.Item>

        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>

        {shippingFee !== null && (
          <div style={{ marginTop: 8 }}>
            <Text strong>Phí ship tạm tính: </Text>
            <Text type="secondary">{shippingFee.toLocaleString()}đ</Text>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateAddressModal;