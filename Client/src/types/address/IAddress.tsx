export interface SavedAddress {
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

// Interface cho tỉnh/thành phố, quận/huyện, phường/xã
export interface Province {
  id:string;
  name:string;
  ProvinceID: number;
  ProvinceName: string;
  shippingFee: number;
}
export interface District {
  id: string;
  ProvinceID: string;
  DistrictID: string;
  DistrictName:string;
  name: string;
}

export interface Ward {
  id: string;
  name: string;
  wardId:string;
  wardName:string;
  districtId: string;
}
