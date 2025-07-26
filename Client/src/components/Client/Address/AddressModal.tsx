
import React from "react";
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


const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;


// Interfaces
interface Province {
  id: string;
  name: string;
  shippingFee: number;
}

interface District {
  id: string;
  name: string;
  provinceId: string;
  ProvinceID: string;
  DistrictID: string;
  DistrictName: string;
}

interface Ward {
  id: string;
  name: string;
  districtId: string;
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
  districts: District[];
  wards: Ward[];
  savedAddresses: SavedAddress[];
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  visible,
  onCancel,
  onAddAddress,
  provinces,
  districts,
  wards,
  savedAddresses,
}) => {
  const [form] = Form.useForm();

  const handleAddNewAddress = async () => {
    try {
      const values = await form.validateFields();

      // Tạo địa chỉ đầy đủ
      const province = provinces.find((p) => p.id === values.newProvince);
      const district = districts.find((d) => d.id === values.newDistrict);
      const ward = wards.find((w) => w.id === values.newWard);

      if (!province || !district || !ward) {
        toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
        return;
      }

      const fullAddress = `${values.newDetailAddress}, ${ward.name}, ${district.name}, ${province.name}`;

      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        name: values.newName,
        phone: values.newPhone,
        provinceId: values.newProvince,
        provinceName: province.name,
        districtId: values.newDistrict,
        districtName: district.name,
        wardId: values.newWard,
        wardName: ward.name,
        detailAddress: values.newDetailAddress,
        fullAddress: fullAddress,
        isDefault: values.setAsDefault || false,
      };

      // Gọi callback để thêm địa chỉ
      onAddAddress(newAddress);

      // Reset form và đóng modal
      form.resetFields();
      onCancel();

      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Thêm địa chỉ giao hàng mới"
      open={visible}
      onOk={handleAddNewAddress}
      onCancel={handleCancel}
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
          <Col span={8}>
            <Form.Item
              name="newProvince"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
              ]}
            >
              <Select
                placeholder="Chọn Tỉnh/Thành phố"
                onChange={(value) => {
                  form.setFieldsValue({
                    newDistrict: undefined,
                    newWard: undefined,
                  });
                }}
              >
                {provinces.map((province) => (
                  <Option key={province.id} value={province.id}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="newDistrict"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
            >
              <Select
                placeholder="Chọn Quận/Huyện"
                disabled={!form.getFieldValue("newProvince")}
                onChange={(value) => {
                  form.setFieldsValue({ newWard: undefined });
                }}
              >
                {districts
                  .filter(
                    (d) => d.provinceId === form.getFieldValue("newProvince")
                  )
                  .map((district) => (
                    <Option key={district.id} value={district.id}>
                      {district.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="newWard"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
            >
              <Select
                placeholder="Chọn Phường/Xã"
                disabled={!form.getFieldValue("newDistrict")}
              >
                {wards
                  .filter(
                    (w) => w.districtId === form.getFieldValue("newDistrict")
                  )
                  .map((ward) => (
                    <Option key={ward.id} value={ward.id}>
                      {ward.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
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
