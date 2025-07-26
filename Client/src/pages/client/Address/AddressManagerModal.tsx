
import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, MapPin } from 'lucide-react';

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
    ],
    HP: [
      { id: "HP1", name: "Quận Hồng Bàng" },
      { id: "HP2", name: "Quận Lê Chân" },
      { id: "HP3", name: "Quận Ngô Quyền" }
    ],
    CT: [
      { id: "CT1", name: "Quận Ninh Kiều" },
      { id: "CT2", name: "Quận Bình Thủy" },
      { id: "CT3", name: "Quận Cái Răng" }
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
    ],
    BD: [
      { id: "CC", name: "Phường Cống Vị" },
      { id: "QT", name: "Phường Quán Thánh" },
      { id: "TP", name: "Phường Trúc Bạch" }
    ]
  };

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
      detailAddress: "123 Đường ABC, Phúc Xá, Ba Đình, Hà Nội",
      fullAddress: "123 Đường ABC, Phúc Xá, Ba Đình, Hà Nội",
      isDefault: true,
      label: "Mặc định"
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
      detailAddress: "456 Phố Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội",
      fullAddress: "456 Phố Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội",
      isDefault: false,
      label: ""
    }
  ]);

  const [showModal, setShowModal] = useState(true);
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

  // Tạo địa chỉ đầy đủ từ các trường đã chọn
  const getFullAddressPreview = () => {
    if (!formData.provinceId || !formData.districtId || !formData.wardId) {
      return '';
    }
    
    const province = provinces.find(p => p.id === formData.provinceId);
    const district = districts[formData.provinceId]?.find(d => d.id === formData.districtId);
    const ward = wards[formData.districtId]?.find(w => w.id === formData.wardId);
    
    return `${ward?.name}, ${district?.name}, ${province?.name}`;
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
          <h1 className="text-xl font-semibold text-gray-900">Địa Chỉ Của Tôi</h1>
        </div>

        {/* Thông báo hướng dẫn */}
        <div className="m-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl shadow-sm">
          <div className="flex gap-3">
            <MapPin size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-orange-700 mb-2 text-sm">Dán và nhập nhanh</div>
              <div className="text-xs text-orange-600 leading-relaxed mb-1">
                Dán hoặc nhập thông tin, chúng tôi đọng diện để nhận tự tài, số điện thoại và địa chỉ.
              </div>
              <div className="text-xs text-orange-500 leading-relaxed">
                Chúng tôi sẽ ghi nhận thông tin nhân, chính xác nhất gặp nhập tên, số điện thoại và địa chỉ chỉ.
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách địa chỉ */}
        <div className="px-6 space-y-4">
          {addresses.map((address, index) => (
            <div key={address.id} className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg ${
              address.isDefault 
                ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-green-100' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <div className="p-5">
                {/* Header với tên và nút update */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 text-base">{address.name}</span>
                    {address.isDefault && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                        Địa chỉ mặc định
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewAddress(address)}
                    className="text-blue-600 text-sm hover:text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
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
                    <div className="font-semibold text-gray-600 mb-1">Tỉnh/TP:</div>
                    <div className="text-gray-700">{address.provinceName}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">Quận/Huyện:</div>
                    <div className="text-gray-700">{address.districtName}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">Phường/Xã:</div>
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

        {/* Bottom section */}
        <div className="p-6 pb-32">
          <button
            onClick={handleAddAddress}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Thêm Địa Chỉ Mới
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'view' && 'Chi tiết địa chỉ'}
                {modalMode === 'add' && 'Thêm địa chỉ mới'}  
                {modalMode === 'edit' && 'Chỉnh sửa địa chỉ'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 text-xl hover:bg-gray-200 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalMode === 'view' && selectedAddress ? (
                <div className="space-y-5">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Tên người nhận</label>
                    <p className="text-gray-900 font-medium">{selectedAddress.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Số điện thoại</label>
                    <p className="text-gray-900 font-medium">{selectedAddress.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Địa chỉ</label>
                    <p className="text-gray-900 leading-relaxed">{selectedAddress.fullAddress}</p>
                  </div>
                  {selectedAddress.isDefault && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                      <span className="text-green-700 text-sm font-semibold">✓ Địa chỉ mặc định</span>
                    </div>
                  )}
                  
                  {/* Action buttons cho view mode */}
                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={() => handleEditAddress(selectedAddress)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(selectedAddress.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Form inputs */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {/* Select dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tỉnh/Thành phố *</label>
                      <select
                        value={formData.provinceId}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-all"
                      >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {provinces.map(province => (
                          <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Quận/Huyện *</label>
                      <select
                        value={formData.districtId}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-all disabled:bg-gray-100"
                        disabled={!formData.provinceId}
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts[formData.provinceId]?.map(district => (
                          <option key={district.id} value={district.id}>{district.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phường/Xã *</label>
                      <select
                        value={formData.wardId}
                        onChange={(e) => setFormData({...formData, wardId: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-all disabled:bg-gray-100"
                        disabled={!formData.districtId}
                      >
                        <option value="">Chọn Phường/Xã</option>
                        {wards[formData.districtId]?.map(ward => (
                          <option key={ward.id} value={ward.id}>{ward.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preview địa chỉ đầy đủ */}
                  {getFullAddressPreview() && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="text-sm text-blue-700">
                        <strong>Địa chỉ sẽ được tạo:</strong> {getFullAddressPreview()}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ cụ thể *</label>
                    <textarea
                      value={formData.detailAddress}
                      onChange={(e) => setFormData({...formData, detailAddress: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                      placeholder="Nhập số nhà, tên đường, tòa nhà..."
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                      Đặt làm địa chỉ mặc định
                    </label>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
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