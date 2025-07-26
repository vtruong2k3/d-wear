import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, MapPin, MoreVertical } from 'lucide-react';

const AddressManagement = () => {
  // Mock data cho các dropdown
  const provinces = [
    { id: "HCM", name: "TP.Hồ Chí Minh", shippingFee: 25000 },
    { id: "HN", name: "Hà Nội", shippingFee: 30000 },
    { id: "DN", name: "Đà Nẵng", shippingFee: 35000 },
    { id: "HP", name: "Hải Phòng", shippingFee: 32000 },
    { id: "CT", name: "Cần Thơ", shippingFee: 28000 }
  ];

  const districts = {
    HCM: [
      { id: "Q1", name: "Quận 1" },
      { id: "Q2", name: "Quận 2" },
      { id: "Q3", name: "Quận 3" },
      { id: "Q4", name: "Quận 4" },
      { id: "Q5", name: "Quận 5" }
    ],
    HN: [
      { id: "HK", name: "Quận Hoàn Kiếm" },
      { id: "BD", name: "Quận Ba Đình" },
      { id: "CG", name: "Quận Cầu Giấy" },
      { id: "TH", name: "Quận Tây Hồ" },
      { id: "LB", name: "Quận Long Biên" }
    ],
    DN: [
      { id: "HC", name: "Quận Hải Châu" },
      { id: "TK", name: "Quận Thanh Khê" },
      { id: "ST", name: "Quận Sơn Trà" }
    ]
  };

  const wards = {
    Q1: [
      { id: "BN", name: "Phường Bến Nghé" },
      { id: "BT", name: "Phường Bến Thành" },
      { id: "DK", name: "Phường Đa Kao" }
    ],
    Q2: [
      { id: "TD", name: "Phường Thảo Điền" },
      { id: "AD", name: "Phường An Phú" },
      { id: "BP", name: "Phường Bình An" }
    ],
    HK: [
      { id: "HB", name: "Phường Hàng Bạc" },
      { id: "TT", name: "Phường Tràng Tiền" },
      { id: "LT", name: "Phường Lý Thái Tổ" }
    ]
  };

  // State quản lý
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Nguyễn Huy Thuận",
      phone: "(+84) 354 114 885",
      provinceId: "HN",
      provinceName: "Hà Nội",
      districtId: "HK",
      districtName: "Quận Hoàn Kiếm",
      wardId: "HB",
      wardName: "Phường Hàng Bạc",
      detailAddress: "Trai Trung-Hoàng Diệu-Chương Mỹ",
      fullAddress: "Trai Trung-Hoàng Diệu-Chương Mỹ-Hà Nội, Xã Hoàng Diệu, Huyện Chương Mỹ, Hà Nội",
      isDefault: true,
      label: "Mặc định"
    },
    {
      id: "2", 
      name: "Huy Thuận",
      phone: "(+84) 354 114 885",
      provinceId: "HN",
      provinceName: "Hà Nội",
      districtId: "BD",
      districtName: "Quận Ba Đình",
      wardId: "HB",
      wardName: "Phường Hàng Bạc",
      detailAddress: "Trâm Y Tế Xã Minh Khai",
      fullAddress: "Trâm Y Tế Xã Minh Khai, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội",
      isDefault: false,
      label: ""
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, add, edit
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    detailAddress: '',
    isDefault: false,
    label: ''
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      detailAddress: '',
      isDefault: false,
      label: ''
    });
  };

  // Xử lý mở modal xem chi tiết
  const handleViewAddress = (address) => {
    setSelectedAddress(address);
    setModalMode('view');
    setShowModal(true);
  };

  // Xử lý thêm địa chỉ mới
  const handleAddAddress = () => {
    resetForm();
    setSelectedAddress(null);
    setModalMode('add');
    setShowModal(true);
  };

  // Xử lý chỉnh sửa địa chỉ
  const handleEditAddress = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      provinceId: address.provinceId,
      districtId: address.districtId,
      wardId: address.wardId,
      detailAddress: address.detailAddress,
      isDefault: address.isDefault,
      label: address.label
    });
    setSelectedAddress(address);
    setModalMode('edit');
    setShowModal(true);
  };

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      setShowModal(false);
    }
  };

  // Xử lý đặt làm mặc định
  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
      label: addr.id === id ? "Mặc định" : (addr.label === "Mặc định" ? "" : addr.label)
    })));
  };

  // Xử lý lưu địa chỉ
  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone || !formData.provinceId || !formData.districtId || 
        !formData.wardId || !formData.detailAddress) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const province = provinces.find(p => p.id === formData.provinceId);
    const district = districts[formData.provinceId]?.find(d => d.id === formData.districtId);
    const ward = wards[formData.districtId]?.find(w => w.id === formData.wardId);

    const fullAddress = `${formData.detailAddress}, ${ward?.name}, ${district?.name}, ${province?.name}`;

    const addressData = {
      ...formData,
      provinceName: province?.name || '',
      districtName: district?.name || '',
      wardName: ward?.name || '',
      fullAddress,
      label: formData.isDefault ? "Mặc định" : formData.label
    };

    if (modalMode === 'add') {
      const newAddress = {
        ...addressData,
        id: Date.now().toString()
      };
      
      let updatedAddresses = [...addresses, newAddress];
      
      // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === newAddress.id,
          label: addr.id === newAddress.id ? "Mặc định" : (addr.label === "Mặc định" ? "" : addr.label)
        }));
      }
      
      setAddresses(updatedAddresses);
    } else if (modalMode === 'edit') {
      let updatedAddresses = addresses.map(addr => 
        addr.id === selectedAddress.id ? { ...addr, ...addressData } : addr
      );
      
      // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === selectedAddress.id,
          label: addr.id === selectedAddress.id ? "Mặc định" : (addr.label === "Mặc định" ? "" : addr.label)
        }));
      }
      
      setAddresses(updatedAddresses);
    }

    setShowModal(false);
  };

  // Xử lý thay đổi tỉnh/thành phố
  const handleProvinceChange = (provinceId) => {
    setFormData({
      ...formData,
      provinceId,
      districtId: '',
      wardId: ''
    });
  };

  // Xử lý thay đổi quận/huyện
  const handleDistrictChange = (districtId) => {
    setFormData({
      ...formData,
      districtId,
      wardId: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button className="p-1">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Địa Chỉ Của Tôi</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Thông báo */}
        <div className="bg-orange-50 border border-orange-200 m-4 p-3 rounded-lg">
          <div className="flex gap-2">
            <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-orange-700 mb-1">Dán và nhập nhanh</div>
              <div className="text-orange-600 text-xs leading-relaxed">
                Dán hoặc nhập thông tin, chúng tôi đọng diện để nhận tự tài, số điện thoại và địa chỉ.
              </div>
              <div className="text-orange-500 text-xs mt-2 leading-relaxed">
                Chúng tôi sẽ ghi nhận thông tin nhân, chính xác nhất gặp nhập tên, số điện thoại và địa chỉ chỉ.
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách địa chỉ */}
        <div className="px-4 space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-orange-500 rounded-full flex-shrink-0 mt-0.5">
                      {address.isDefault && <span className="w-2 h-2 bg-orange-500 rounded-full block m-0.5"></span>}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">{address.name}</div>
                      <div className="text-sm text-gray-600">{address.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded border border-orange-300">
                        Mặc định
                      </span>
                    )}
                    <button
                      onClick={() => handleViewAddress(address)}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {address.fullAddress}
                </div>

                {/* Mini map placeholder */}
                <div className="h-24 bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
                  <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-2 right-2 bg-white text-xs px-1 py-0.5 rounded shadow text-gray-600">
                    Google
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin size={20} className="text-red-500" />
                  </div>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Đặt làm địa chỉ mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nút thêm địa chỉ */}
        <div className="p-4 mt-6">
          <button
            onClick={handleAddAddress}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Thêm Địa Chỉ Mới
          </button>
        </div>

        {/* Bottom buttons */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Xóa địa chỉ
            </button>
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              HOÀN THÀNH
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {modalMode === 'view' && 'Chi tiết địa chỉ'}
                {modalMode === 'add' && 'Thêm địa chỉ mới'}  
                {modalMode === 'edit' && 'Chỉnh sửa địa chỉ'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {modalMode === 'view' && selectedAddress ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tên người nhận</label>
                    <p className="mt-1 text-gray-900">{selectedAddress.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-gray-900">{selectedAddress.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                    <p className="mt-1 text-gray-900 leading-relaxed">{selectedAddress.fullAddress}</p>
                  </div>
                  {selectedAddress.isDefault && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-green-700 text-sm font-medium">✓ Địa chỉ mặc định</span>
                    </div>
                  )}
                  
                  {/* Action buttons cho view mode */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleEditAddress(selectedAddress)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(selectedAddress.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Form inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập tên người nhận"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết *</label>
                    <input
                      type="text"
                      value={formData.detailAddress}
                      onChange={(e) => setFormData({...formData, detailAddress: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                  </div>

                  {/* Select dropdowns */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/TP *</label>
                      <select
                        value={formData.provinceId}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="">Chọn tỉnh/TP</option>
                        {provinces.map(province => (
                          <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện *</label>
                      <select
                        value={formData.districtId}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        disabled={!formData.provinceId}
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts[formData.provinceId]?.map(district => (
                          <option key={district.id} value={district.id}>{district.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã *</label>
                      <select
                        value={formData.wardId}
                        onChange={(e) => setFormData({...formData, wardId: e.target.value})}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        disabled={!formData.districtId}
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards[formData.districtId]?.map(ward => (
                          <option key={ward.id} value={ward.id}>{ward.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                      Đặt làm địa chỉ mặc định
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn địa chỉ</label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ví dụ: Nhà riêng, Văn phòng"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;