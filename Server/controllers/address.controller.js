const Address = require("../models/address");

exports.addAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardId,
      wardName,
      detailAddress,
      fullAddress,
      isDefault,
    } = req.body;

    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    // Nếu isDefault = true => cập nhật tất cả địa chỉ khác thành false
    if (isDefault) {
      await Address.updateMany({ user_id }, { $set: { isDefault: false } });
    }

    const newAddress = await Address.create({
      user_id,
      name,
      phone,
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardId,
      wardName,
      detailAddress,
      fullAddress,
      isDefault: !!isDefault,
    });

    return res.status(201).json({
      message: "Thêm địa chỉ thành công",
      address: newAddress,
    });
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardId,
      wardName,
      detailAddress,
      fullAddress,
      isDefault,
    } = req.body;

    const existingAddress = await Address.findById(id);

    if (!existingAddress) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    // Nếu là mặc định => bỏ mặc định các địa chỉ khác
    if (isDefault) {
      await Address.updateMany(
        { user_id: existingAddress.user_id },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName,
        detailAddress,
        fullAddress,
        isDefault: !!isDefault,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Cập nhật địa chỉ thành công",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAddressesByUser = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const result = await Address.find({ user_id }).sort({
      isDefault: -1,
      updatedAt: -1,
    });

    return res.status(200).json({
      address: result,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ để xoá" });
    }

    return res.status(200).json({
      message: "Xoá địa chỉ thành công",
      address: deletedAddress,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
