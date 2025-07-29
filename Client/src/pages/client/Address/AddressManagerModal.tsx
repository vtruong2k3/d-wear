import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Phone } from "lucide-react";
import AddAddressModal from "../../../components/Client/Address/AddressModal";
import UpdateAddressModal from "../../../components/Client/Address/UpdateAddressModal";
import { Popconfirm } from "antd";
import {
  getUserAddresses,

  updateUserAddress,
  deleteUserAddress,
} from "../../../services/client/addressService";

import type {
  SavedAddress,
  Province,
  District,
  Ward,
  RawDistrict,
  RawWard,
} from "../../../types/address/IAddress";

import {
  getProvinces,
  getDistricts,
  getWards,
} from "../../../services/client/ghnService";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";

const AddressManagement = () => {
  const [isAddAddressModalVisible, setIsAddAddressModalVisible] =
    useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressToEdit, setAddressToEdit] = useState<SavedAddress | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [districtsUpdate, setDistrictsUpdate] = useState<RawDistrict[]>([]);
  const [wardsUpdate, setWardsUpdate] = useState<RawWard[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  // Log mở modal
  useEffect(() => {
    console.log("🟢 Add Modal visible:", isAddAddressModalVisible);
    console.log("🟢 Edit Modal visible:", isEditModalVisible);
  }, [isAddAddressModalVisible, isEditModalVisible]);

  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getUserAddresses();
      const fetched = res?.data?.address;
      console.log(" Fetched addresses:", fetched);
      setAddresses(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      console.log(" Provinces API response:", res.data);
      if (res.status === 200 && Array.isArray(res.data.provinces)) {
        setProvinces(res.data.provinces);
      } else {
        console.error("⚠️ Sai cấu trúc provinces:", res.data);
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      console.log("📌 Province selected:", selectedProvince);
      fetchDistricts(selectedProvince);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  const fetchDistricts = async (provinceId: number) => {
    try {
      const res = await getDistricts(provinceId);
      console.log(" Districts API:", res.data);
      if (res.status === 200 && Array.isArray(res.data)) {
        const mapped: District[] = res.data.map((raw: RawDistrict) => ({
          id: raw.DistrictID.toString(),
          name: raw.DistrictName,
          DistrictID: raw.DistrictID,
          DistrictName: raw.DistrictName,
          ProvinceID: raw.ProvinceID,
        }));
        console.log(" Mapped Districts:", mapped);
        setDistricts(mapped);
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (selectedDistrict) {
      console.log(" District selected:", selectedDistrict);
      fetchWards(selectedDistrict);
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const fetchWards = async (districtId: number) => {
    try {
      const res = await getWards(districtId);
      console.log("🌐 Wards API:", res.data);
      if (res.status === 200 && Array.isArray(res.data)) {
        console.log(" Wards:", res.data);
        setWards(res.data);
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleAddNewAddress = async () => {
    fetchAddresses(); // chỉ refetch thôi
    setIsAddAddressModalVisible(false);
  };


  const handleSetDefault = async (addressId: string) => {
    console.log(" Đặt mặc định cho:", addressId);
    try {
      await updateUserAddress(addressId, { isDefault: true });
      fetchAddresses();
    } catch (error) {
      console.error(" Lỗi khi đặt mặc định:", error);
    }
  };

  const handleEditClick = (address: SavedAddress) => {
    console.log(" Edit Click:", address);
    setAddressToEdit(address);
    setIsEditModalVisible(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    console.log(" Xoá địa chỉ:", addressId);
    try {
      await deleteUserAddress(addressId);
      fetchAddresses();
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto min-h-screen">
        <div className="flex items-center gap-3 p-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 !m-0">
            Địa Chỉ Của Tôi
          </h1>
        </div>

        <div className="p-4 space-y-3">
          {addresses.map((address, index) => (
            <div
              key={address._id || address.id || index}
              className={`bg-white rounded-lg p-4 relative shadow-sm overflow-hidden transition-all ${address.isDefault
                ? "!border-2 !border-green-400"
                : "!border !border-gray-200"
                }`}
            >
              {address.isDefault && (
                <div className="absolute top-0 right-0 w-24 h-7 bg-green-500 rounded-bl-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    Địa chỉ mặc định
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
                <span
                  className={`font-medium ${address.isDefault ? "text-green-600" : "text-gray-900"
                    }`}
                >
                  {address.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Phone size={14} />
                <span>{address.phone}</span>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-800 mb-4">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{address.fullAddress}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs mb-4 bg-gray-100 p-3 rounded-lg">
                <div>
                  <div className="text-gray-500 mb-1">Tỉnh/TP:</div>
                  <div className="font-medium text-gray-700">
                    {address.provinceName}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Quận/Huyện:</div>
                  <div className="font-medium text-gray-700">
                    {address.districtName}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Phường/Xã:</div>
                  <div className="font-medium text-gray-700">
                    {address.wardName}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-400">
                  Địa chỉ #{index + 1}
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cập nhật
                  </button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xoá địa chỉ này không?"
                    okText="Xoá"
                    cancelText="Huỷ"
                    onConfirm={() => handleDeleteAddress(address._id)}
                  >
                    <button className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                      Xoá
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={() => setIsAddAddressModalVisible(true)}
            className="w-full bg-black text-white hover:opacity-90 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
          >
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
        savedAddresses={addresses}
      />

      <UpdateAddressModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        addressToUpdate={addressToEdit}
        provinces={provinces}
        districts={districtsUpdate}
        wards={wardsUpdate}
        onProvinceChange={(provinceId: string) =>
          setSelectedProvince(Number(provinceId))
        }
        onDistrictChange={(districtId: string) =>
          setSelectedDistrict(Number(districtId))
        }
        onSuccess={() => {
          fetchAddresses();
          setIsEditModalVisible(false);
        }}
      />
    </div>
  );
};

export default AddressManagement;
