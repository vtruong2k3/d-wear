const User = require("../models/users");
const profileUpdateSchema = require("../validate/profileValidate");

exports.updateUserProfile = async (req, res) => {
  try {
    const { error } = profileUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const userId = req.user.id;
    const { username, phone } = req.body;
    const avatarFile = req.file;

    if (!username || !phone) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin username hoặc phone" });
    }

    const updateData = {
      username,
      phone,
    };

    if (avatarFile && avatarFile.filename) {
      updateData.avatar = `/uploads/avatar/${avatarFile.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // Trả về user đã cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
