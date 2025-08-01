// Địa chỉ người dùng đã lưu trong hệ thống (MongoDB)
export interface IAddress {
  _id?: string; // nếu có dùng trong client
  user_id: string; // hoặc mongoose.Types.ObjectId nếu dùng ở backend
  name: string;
  phone: string;

  provinceId: number;
  provinceName: string;

  districtId: number;
  districtName: string;

  wardId: string;
  wardName: string;

  detailAddress: string;
  fullAddress: string;

  isDefault: boolean;

  createdAt: string; // ISO format hoặc Date
  updatedAt: string;
}

export interface SavedAddress {
  id: string;             // ID tạm cho FE
  _id: string;            // ID thực từ Mongo
  name: string;
  phone: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: string;         // WardCode vẫn là string từ GHN
  wardName: string;
  detailAddress: string;
  fullAddress: string;
  isDefault?: boolean;
}

// Dữ liệu thô từ GHN
export interface RawProvince {
  ProvinceID: number;
  ProvinceName: string;
  shippingFee?: number;
}

export interface RawDistrict {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}

export interface RawWard {
  WardCode: string;     // string từ GHN
  WardName: string;
  DistrictID: number;
}

// Dữ liệu đã chuẩn hóa (dùng trong form, select)
export interface Province {
  id: number;             // ProvinceID
  name: string;           // ProvinceName
  ProvinceID: number;
  ProvinceName: string;
  shippingFee: number;
}

export interface District {
  id: string;
  name: string;
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}

export interface Ward {
  id: string;             // WardCode
  name: string;           // WardName
  wardId: string;         // = WardCode
  wardName: string;
  districtId: number;
}
