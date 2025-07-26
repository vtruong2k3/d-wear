import { useState } from "react";
import { ArrowLeft, MapPin, Plus, Phone } from "lucide-react";
import AddAddressModal from '../../../components/Client/Address/AddressModal';
const AddressManagement = () => {
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
  const [isAddAddressModalVisible, setIsAddAddressModalVisible] = useState(false);

  const handleAddNewAddress = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setIsAddAddressModalVisible(false);
  };

  const provinces = []; // Tạm để tránh lỗi
  const districts = [];
  const wards = [];
  const savedAddresses = addresses;
  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 ">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 !m-0">
            Địa Chỉ Của Tôi
          </h1>
        </div>

        {/* Address List */}
        <div className="p-4 space-y-3">
          {addresses.map((address, index) => (
            <div
              key={address.id}
              className={`bg-white rounded-lg p-4 relative shadow-sm overflow-hidden transition-all ${address.isDefault
                ? "!border-2 !border-green-400"
                : "!border !border-gray-200"
                }`}
            >
              {/* Green accent line for default address */}
              {address.isDefault && (
                <div className="absolute top-0 right-0 w-24 h-7 bg-green-500 rounded-bl-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Địa chỉ mặc định</span>
                </div>
              )}

              {/* User Icon and Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
                <span className={`font-medium ${address.isDefault ? 'text-green-600' : 'text-gray-900'}`}>
                  {address.name}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Phone size={14} />
                <span>{address.phone}</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-gray-800 mb-4">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{address.fullAddress}</span>
              </div>

              {/* Location Details Grid */}
              <div className="grid grid-cols-3 gap-4 text-xs mb-4 bg-gray-100 p-3 rounded-lg">
                <div>
                  <div className="text-gray-500 mb-1">Tỉnh/TP:</div>
                  <div className="font-medium text-gray-700">{address.provinceName}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Quận/Huyện:</div>
                  <div className="font-medium text-gray-700">{address.districtName}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Phường/Xã:</div>
                  <div className="font-medium text-gray-700">{address.wardName}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 !border-t !border-gray-200">
                <div className="text-xs text-gray-400">
                  Địa chỉ #{index + 1} • Tạo lúc: 26/7/2025
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address Button */}
        <div className="p-4">
          <button
            onClick={() => setIsAddAddressModalVisible(true)}
            className="w-full bg-black text-white hover:opacity-90 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-sm">
            <Plus size={20} />
            Thêm địa chỉ mới
          </button>

        </div>
      </div>
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