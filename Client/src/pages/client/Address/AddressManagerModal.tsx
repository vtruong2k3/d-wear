import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Phone } from "lucide-react";
import AddAddressModal from "../../../components/Client/Address/AddressModal";
import UpdateAddressModal from "../../../components/Client/Address/UpdateAddressModal";

import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
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

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null); //  Thêm state
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null); //  Thêm state

  //  Fetch danh sách địa chỉ và Tỉnh/TP lúc đầu
  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getUserAddresses();
      const fetched = res?.data?.address;
      setAddresses(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      console.error(" Lỗi khi lấy danh sách địa chỉ:", error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      console.log("Provinces API response:", res.data);
      if (res.status === 200 && Array.isArray(res.data.provinces)) {
        setProvinces(res.data.provinces);
      } else {
        console.error(" Sai cấu trúc provinces:", res.data);
      }
    } catch (error) {
      console.error(" Lỗi khi lấy Tỉnh/TP:", error);
    }
  };

  //  Fetch quận huyện khi chọn Tỉnh
  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  const fetchDistricts = async (provinceId: any) => {
    try {
      const res = await getDistricts(provinceId);
      console.log("Districts API:", res.data);

      if (res.status === 200 && Array.isArray(res.data)) {
        const mapped: District[] = res.data.map((raw: RawDistrict) => ({
          id: raw.DistrictID.toString(),
          name: raw.DistrictName,
          DistrictID: raw.DistrictID,
          DistrictName: raw.DistrictName,
          ProvinceID: raw.ProvinceID.toString(),
        }));
        setDistricts(mapped);
      }
    } catch (error) {
      console.error(" Lỗi khi lấy Quận/Huyện:", error);
    }
  };
  

  //  Fetch xã phường khi chọn Quận
  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const fetchWards = async (districtId: number) => {
    try {
      const res = await getWards(districtId);
      console.log("Wards API:", res.data);
      if (res.status === 200 && Array.isArray(res.data)) {
        setWards(res.data);
      }
    } catch (error) {
      console.error(" Lỗi khi lấy Phường/Xã:", error);
    }
  };

  const handleAddNewAddress = async (newAddress: any) => {
    try {
      const res = await addUserAddress(newAddress);
      if (res.status === 200 || res.status === 201) {
        fetchAddresses();
        setIsAddAddressModalVisible(false);
      }
    } catch (error) {
      console.error(" Thêm địa chỉ thất bại:", error);
    }
  };

  const handleSetDefault = async (addressId: any) => {
    try {
      await updateUserAddress(addressId, { isDefault: true });
      fetchAddresses();
    } catch (error) {
      console.error(" Lỗi khi đặt mặc định:", error);
    }
  };

  const handleEditClick = (address: any) => {
    setAddressToEdit(address);
    setIsEditModalVisible(true);
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
              className={`bg-white rounded-lg p-4 relative shadow-sm overflow-hidden transition-all ${
                address.isDefault
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
                  className={`font-medium ${
                    address.isDefault ? "text-green-600" : "text-gray-900"
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
        key={provinces.length}
        visible={isAddAddressModalVisible}
        onCancel={() => setIsAddAddressModalVisible(false)}
        onAddAddress={handleAddNewAddress}
        provinces={provinces}
        districts={districts}
        wards={wards}
        savedAddresses={addresses}
      />
      <UpdateAddressModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        addressToUpdate={addressToEdit}
        provinces={provinces}
        districts={districtsUpdate}
        wards={wardsUpdate} //  chuẩn RawWard[]
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
