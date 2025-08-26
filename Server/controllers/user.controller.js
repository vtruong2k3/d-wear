const Address = require("../models/address");
const User = require("../models/users");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const profileUpdateSchema = require("../validate/profileValidate");
const path = require("path");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validate/userValidate");
const Cart = require("../models/carts");
const Order = require("../models/orders");
const OrderItem = require("../models/orderItems");
const fs = require("fs").promises;
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

exports.getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;

    const adminFirst =
      (req.query.adminFirst ?? "true").toString().toLowerCase() !== "false";

    const { q, role, roles, status, isActive } = req.query;

    const query = { isDelete: { $ne: true } };

    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), "i");
      query.$or = [{ username: rx }, { email: rx }];
    }

    if (role) {
      query.role = role;
    } else if (roles) {
      const list = roles
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (list.length) query.role = { $in: list };
    }

    if (typeof status !== "undefined") {
      const s = String(status).toLowerCase();
      if (s === "active") query.isActive = true;
      if (s === "inactive") query.isActive = false;
    }
    if (typeof isActive !== "undefined") {
      query.isActive = String(isActive).toLowerCase() === "true";
    }

    const sort =
      !role && adminFirst
        ? { role: 1, [sortBy]: order, _id: 1 }
        : { [sortBy]: order, _id: 1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      meta: {
        currentPage: page,
        pageSize: limit,
        totalPages,
        total,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        sortBy,
        order: order === 1 ? "asc" : "desc",
      },
      filters: {
        q: q || null,
        role: role || null,
        roles: roles
          ? roles
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : null,
        status: status || null,
        isActive: typeof query.isActive !== "undefined" ? query.isActive : null,
      },
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", error: error.message });
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

exports.createUser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { error } = createUserSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    // dữ liệu gửi lên dạng multipart/form-data
    const { username, email, password, phone, role, isActive } = req.body;

    console.log("avatar", req.file);

    if (!username || !email) {
      return res.status(400).json({ message: "username và email là bắt buộc" });
    }

    // kiểm tra trùng email
    const existed = await User.findOne({ email: email.toLowerCase().trim() });
    if (existed) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // hash password nếu có
    let hashed = undefined;
    if (password && password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
    }
    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      hashed = bcryptjs.hashSync(password, salt);
    }

    // xử lý avatar nếu upload
    let avatarUrl;
    if (req.file?.filename) {
      avatarUrl = `/uploads/avatar/${req.file.filename}`;
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      phone: phone?.trim(),
      avatar: avatarUrl,
      isGoogleAccount: false, // tạo thủ công
      role: role === "admin" ? "admin" : "user",
      isActive:
        typeof isActive !== "undefined"
          ? isActive === "true" || isActive === true
          : true,
      isDelete: false,
    });

    // ẩn password khi trả về
    const userObj = user.toObject();
    delete userObj.password;

    return res
      .status(201)
      .json({ message: "Tạo user thành công", data: userObj });
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error } = updateUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    // Cho phép id từ params hoặc body
    const id = req.params.id || req.body.id;
    const { username, email, password, phone, role, isActive } = req.body;

    if (!id) return res.status(400).json({ message: "Thiếu id người dùng" });
    if (!username || !email) {
      return res.status(400).json({ message: "username và email là bắt buộc" });
    }

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const normalizedEmail = String(email).toLowerCase().trim();
    // Kiểm tra trùng email (loại trừ chính user)
    const existed = await User.findOne({
      _id: { $ne: id },
      email: normalizedEmail,
    });
    if (existed) return res.status(409).json({ message: "Email đã tồn tại" });

    // Hash password nếu có
    let hashed;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
      }
      const salt = bcryptjs.genSaltSync(10);
      hashed = bcryptjs.hashSync(password, salt);
    }

    let avatarUrl = user.avatar;

    if (req.file?.filename) {
      const newAvatarRel = `/uploads/avatar/${req.file.filename}`;

      if (user.avatar && user.avatar !== newAvatarRel) {
        const absOld = path.join(process.cwd(), user.avatar.replace(/^\//, ""));
        try {
          await fs.unlink(absOld);
        } catch (e) {
          console.warn("Không xoá được avatar cũ:", e?.message);
        }
      }
      avatarUrl = newAvatarRel;
    }

    // Parse isActive an toàn
    const parsedActive =
      typeof isActive !== "undefined"
        ? isActive === true || String(isActive).toLowerCase() === "true"
        : user.isActive;

    // TÍNH ROLE MỚI: nếu client không gửi role -> giữ nguyên role hiện tại
    const nextRole =
      typeof role !== "undefined"
        ? role === "admin"
          ? "admin"
          : "user"
        : user.role;

    // NẾU ĐANG HẠ QUYỀN TỪ ADMIN -> USER: kiểm tra còn admin khác không
    if (user.role === "admin" && nextRole !== "admin") {
      const otherAdmins = await User.countDocuments({
        role: "admin",
        _id: { $ne: id },
        // (tuỳ bạn) nếu chỉ tính admin đang hoạt động, thêm: isActive: true
      });
      if (otherAdmins === 0) {
        return res
          .status(400)
          .json({ message: "Không thể hạ quyền quản trị viên cuối cùng." });
      }
    }

    const updateData = {
      username: String(username).trim(),
      email: normalizedEmail,
      phone: typeof phone !== "undefined" ? String(phone).trim() : user.phone,
      avatar: avatarUrl, // giữ nguyên nếu không upload mới
      role: nextRole,
      isActive: parsedActive,
    };

    if (hashed) updateData.password = hashed;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const userObj = updatedUser.toObject();
    delete userObj.password;

    return res
      .status(200)
      .json({ message: "Cập nhật người dùng thành công", data: userObj });
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Thiếu id người dùng" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    if (user.role === "admin") {
      const otherAdmins = await User.countDocuments({
        role: "admin",
        _id: { $ne: id },
        isActive: true,
      });
      if (otherAdmins === 0) {
        return res
          .status(400)
          .json({ message: "Không thể xoá quản trị viên cuối cùng." });
      }
    }
    await Cart.deleteMany({ user_id: id }).session(session);
    const order = await Order.find({ user_id: id })
      .select("_id")
      .lean()
      .session(session);
    const orderId = order.map((o) => o._id);
    if (orderId.length) {
      await OrderItem.deleteMany({ order_id: { $in: orderId } }).session(
        session
      );
    }
    if (order.length) {
      await Order.deleteMany({ user_id: id }).session(session);
    }
    await User.deleteOne({ _id: id }).session(session);
    res.status(200).json({ message: "Xoá người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá người dùng:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", error: error.message });
  }
};
