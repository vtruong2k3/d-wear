const Address = require("../models/address");
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
    res.status(500).json({ message: "Lỗi máy chủ" }, error.message);
  }
};

// Controller: userController.js
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDelete: { $ne: true } }; // Không lấy user có isDelete = true

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      users,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const addresses = await Address.find({ user_id: userId });

    res.status(200).json({
      user: existingUser,
      addresses,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
