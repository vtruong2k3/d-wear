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
import { getDistricts, getWards } from "../../../services/client/ghnService";
import { addUserAddress } from "../../../services/client/addressService"; // ✅ gọi API

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}
interface Ward {
  wardId: string;
  WardCode: string;
  wardName: string;
  WardName: string;
  DistrictID: number;
}

interface SavedAddress {
  id: string;
  _id: string;
  name: string;
  phone: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  detailAddress: string;
  fullAddress: string;
  isDefault?: boolean;
}

interface AddAddressModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddAddress: (newAddress: SavedAddress) => void;
  provinces: Province[];
  wards: Ward[];
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  visible,
  onCancel,
  onAddAddress,
  provinces,
}) => {
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // ✅ Chọn tỉnh => gọi API quận huyện
  const handleProvinceChange = async (provinceId: string) => {
    form.setFieldsValue({
      newProvince: provinceId,
      newDistrict: undefined,
      newWard: undefined,
    });

    try {
      const res = await getDistricts(provinceId);
      setDistricts(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy quận/huyện:", err);
      setDistricts([]);
    }
  };

  const handleAddNewAddress = async () => {
    try {
      const values = await form.validateFields();

      const province = provinces.find(
        (p) => p.ProvinceID.toString() === values.newProvince
      );
      const district = districts.find(
        (d) => d.DistrictID.toString() === values.newDistrict
      );
      const ward = wards.find((w) => w.WardCode === values.newWard);

      if (!province || !district || !ward) {
        toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
        return;
      }

      const fullAddress = `${values.newDetailAddress}, ${ward.WardName}, ${district.DistrictName}, ${province.ProvinceName}`;

      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        name: values.newName,
        phone: values.newPhone,
        provinceId: values.newProvince,
        provinceName: province.ProvinceName,
        districtId: values.newDistrict,
        districtName: district.DistrictName,
        wardId: values.newWard,
        wardName: ward.WardName,
        detailAddress: values.newDetailAddress,
        fullAddress,
        isDefault: values.setAsDefault || false,
      };

      // ✅ GỌI API LƯU VÀO MONGO
      const res = await addUserAddress(newAddress);

      if (res.status === 200 || res.status === 201) {
        toast.success("Thêm địa chỉ thành công!");
        onAddAddress(newAddress); // cập nhật state frontend nếu cần
        form.resetFields();
        onCancel();
      } else {
        toast.error("Không thể lưu địa chỉ, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Validation failed or API error:", error);
      toast.error("Lỗi lưu địa chỉ!");
    }
  };

  return (
    <Modal
      title="Thêm địa chỉ giao hàng mới"
      open={visible}
    //   onOk={handleAddNewAddress}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Thêm địa chỉ"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="newName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="newPhone"
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

        <Text strong>Chọn địa chỉ:</Text>
        <Row gutter={[8, 8]} style={{ marginTop: 8, marginBottom: 16 }}>
          
        </Row>

        <Form.Item
          name="newDetailAddress"
          label="Địa chỉ chi tiết"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
          ]}
        >
          <TextArea rows={2} placeholder="Nhập số nhà, tên đường" />
        </Form.Item>

        <Form.Item name="setAsDefault" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAddressModal;
