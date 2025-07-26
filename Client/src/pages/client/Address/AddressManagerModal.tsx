import React, { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { SavedAddress } from "../../../types/address/IAddress";
import AddAddressModal from "../../../components/Client/Address/AddressModal";

const AddressManagement = () => {
  // Mock data cho các dropdown
  const provinces = [
    { id: "HCM", name: "TP.Hồ Chí Minh", shippingFee: 25000 },
    { id: "HN", name: "Hà Nội", shippingFee: 30000 },
    { id: "DN", name: "Đà Nẵng", shippingFee: 35000 },
    { id: "HP", name: "Hải Phòng", shippingFee: 32000 },
    { id: "CT", name: "Cần Thơ", shippingFee: 28000 },
  ];

  const districts = [
    { id: "Q1", name: "Quận 1", provinceId: "HCM" },
    { id: "Q2", name: "Quận 2", provinceId: "HCM" },
    { id: "Q3", name: "Quận 3", provinceId: "HCM" },
    { id: "Q4", name: "Quận 4", provinceId: "HCM" },
    { id: "Q5", name: "Quận 5", provinceId: "HCM" },
    { id: "HK", name: "Quận Hoàn Kiếm", provinceId: "HN" },
    { id: "BD", name: "Quận Ba Đình", provinceId: "HN" },
    { id: "CG", name: "Quận Cầu Giấy", provinceId: "HN" },
    { id: "TH", name: "Quận Tây Hồ", provinceId: "HN" },
    { id: "LB", name: "Quận Long Biên", provinceId: "HN" },
    { id: "HC", name: "Quận Hải Châu", provinceId: "DN" },
    { id: "TK", name: "Quận Thanh Khê", provinceId: "DN" },
    { id: "ST", name: "Quận Sơn Trà", provinceId: "DN" },
    { id: "HP1", name: "Quận Hồng Bàng", provinceId: "HP" },
    { id: "HP2", name: "Quận Lê Chân", provinceId: "HP" },
    { id: "HP3", name: "Quận Ngô Quyền", provinceId: "HP" },
    { id: "CT1", name: "Quận Ninh Kiều", provinceId: "CT" },
    { id: "CT2", name: "Quận Bình Thủy", provinceId: "CT" },
    { id: "CT3", name: "Quận Cái Răng", provinceId: "CT" },
  ];

  const wards = [
    { id: "BN", name: "Phường Bến Nghé", districtId: "Q1" },
    { id: "BT", name: "Phường Bến Thành", districtId: "Q1" },
    { id: "DK", name: "Phường Đa Kao", districtId: "Q1" },
    { id: "TD", name: "Phường Thảo Điền", districtId: "Q2" },
    { id: "AD", name: "Phường An Phú", districtId: "Q2" },
    { id: "BP", name: "Phường Bình An", districtId: "Q2" },
    { id: "HB", name: "Phường Hàng Bạc", districtId: "HK" },
    { id: "TT", name: "Phường Tràng Tiền", districtId: "HK" },
    { id: "LT", name: "Phường Lý Thái Tổ", districtId: "HK" },
    { id: "CC", name: "Phường Cống Vị", districtId: "BD" },
    { id: "QT", name: "Phường Quán Thánh", districtId: "BD" },
    { id: "TP", name: "Phường Trúc Bạch", districtId: "BD" },
  ];

  // State quản lý
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Nguyễn Văn A",
      phone: "0909123456",
      provinceId: "HN",
      provinceName: "Hà Nội",
      districtId: "BD",
      districtName: "Ba Đình",
      wardId: "CC",
      wardName: "Phúc Xá",
      detailAddress: "123 Đường ABC",
      fullAddress: "123 Đường ABC, Phúc Xá, Ba Đình, Hà Nội",
      isDefault: true,
      label: "Mặc định",
    },
    {
      id: "2",
      name: "Nguyễn Văn A (Công ty)",
      phone: "0909123456",
      provinceId: "HN",
      provinceName: "Hà Nội",
      districtId: "HK",
      districtName: "Hoàn Kiếm",
      wardId: "HB",
      wardName: "Tràng Tiền",
      detailAddress: "456 Phố Tràng Tiền",
      fullAddress: "456 Phố Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội",
      isDefault: false,
      label: "",
    },
  ]);

  const [isAddAddressModalVisible, setIsAddAddressModalVisible] =
    useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

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

    // Đóng modal
    setIsAddAddressModalVisible(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Content */}
      <div className="w-full mx-auto bg-white min-h-screen shadow-xl">
        {/* Page header */}
        <div className="flex items-center gap-3 p-6 bg-white border-b border-gray-100 shadow-sm">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Địa Chỉ Của Tôi
          </h1>
        </div>

        {/* Thông báo hướng dẫn */}
        <div className="m-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl shadow-sm">
          <div className="flex gap-3">
            <MapPin
              size={18}
              className="text-orange-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <div className="font-semibold text-orange-700 mb-2 text-sm">
                Dán và nhập nhanh
              </div>
              <div className="text-xs text-orange-600 leading-relaxed mb-1">
                Dán hoặc nhập thông tin, chúng tôi đọng diện để nhận tự tài, số
                điện thoại và địa chỉ.
              </div>
              <div className="text-xs text-orange-500 leading-relaxed">
                Chúng tôi sẽ ghi nhận thông tin nhân, chính xác nhất gặp nhập
                tên, số điện thoại và địa chỉ chỉ.
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách địa chỉ */}
        <div className="px-6 space-y-4">
          {addresses.map((address, index) => (
            <div
              key={address.id}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg ${
                address.isDefault
                  ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-green-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="p-5">
                {/* Header với tên và nút update */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 text-base">
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                        Địa chỉ mặc định
                      </span>
                    )}
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                    Cập nhật
                  </button>
                </div>

                {/* Số điện thoại */}
                <div className="text-sm text-gray-600 mb-3 font-medium">
                  📞 {address.phone}
                </div>

                {/* Địa chỉ */}
                <div className="text-sm text-gray-700 mb-4 leading-relaxed bg-gray-50 p-3 rounded-xl">
                  📍 {address.fullAddress}
                </div>

                {/* Thông tin phân cấp hành chính */}
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 mb-3 bg-white p-3 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">
                      Tỉnh/TP:
                    </div>
                    <div className="text-gray-700">{address.provinceName}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">
                      Quận/Huyện:
                    </div>
                    <div className="text-gray-700">{address.districtName}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">
                      Phường/Xã:
                    </div>
                    <div className="text-gray-700">{address.wardName}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-400">
                    Địa chỉ #{index + 1} • Tạo lúc: 26/7/2025
                  </div>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-blue-600 text-xs hover:text-blue-700 font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Đặt làm địa chỉ mặc định
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 pb-32">
          <Button
            icon={<PlusOutlined />}
            className="w-full "
            onClick={() => setIsAddAddressModalVisible(true)}
          >
            Thêm địa chỉ
          </Button>
 
        </div>
      </div>

      {/* Modal */}

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

export default AddressManagement;
