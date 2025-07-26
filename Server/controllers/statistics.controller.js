const dayjs = require("dayjs");
const Order = require("../models/orders");
const OrderItem = require("../models/orderItems");
const Product = require("../models/products");
const User = require("../models/users");
const weekOfYear = require("dayjs/plugin/weekOfYear");

dayjs.extend(weekOfYear);
exports.getSummary = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const startOfDay = new Date(`${today}T00:00:00Z`);
    const endOfDay = new Date(`${today}T23:59:59Z`);

    const [orders, users, shippingCount] = await Promise.all([
      Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      User.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      Order.countDocuments({
        status: "shipped",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.finalAmount,
      0
    );

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      shippingOrders: shippingCount, //  thêm đơn đang giao
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy thống kê tổng quan",
      error: err.message,
    });
  }
};

exports.getDailyData = async (req, res) => {
  try {
    const days = 30;
    const today = dayjs();
    const data = [];

    for (let i = 0; i < days; i++) {
      const date = today.subtract(i, "day").format("YYYY-MM-DD");
      const nextDay = today
        .subtract(i - 1, "day")
        .startOf("day")
        .toDate();
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(nextDay);

      const orders = await Order.find({
        createdAt: { $gte: startDate, $lt: endDate },
      });
      const revenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
      const customers = await User.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      data.unshift({
        date,
        displayDate: dayjs(date).format("DD/MM"),
        revenue,
        orders: orders.length,
        customers,
      });
    }

    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy dữ liệu theo ngày", error: err.message });
  }
};

exports.getLatestOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("user_id", "username email")
      .populate("orderItems"); // vẫn giữ nếu sau này cần

    const result = orders.map((order) => ({
      orderId: order._id,
      order_code: order.order_code,
      customer: order.receiverName,
      phone: order.phone,
      amount: order.finalAmount,
      status: order.status,
      date: dayjs(order.createdAt).format("YYYY-MM-DD"),
      displayDate: dayjs(order.createdAt).format("DD/MM/YYYY"),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: err.message,
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const statusList = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const result = [];

    const thirtyDaysAgo = dayjs().subtract(30, "day").startOf("day").toDate();

    for (let status of statusList) {
      const count = await Order.countDocuments({
        status,
        createdAt: { $gte: thirtyDaysAgo },
      });

      result.push({ name: status, value: count });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi thống kê trạng thái đơn hàng (30 ngày gần nhất)",
      error: err.message,
    });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const items = await OrderItem.aggregate([
      {
        $group: {
          _id: {
            product_id: "$product_id",
            product_name: "$product_name",
            product_image: "$product_image",
          },
          sold: { $sum: "$quantity" },
          revenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 6 },
    ]);

    const result = items.map((item) => ({
      name: item._id.product_name,
      image: item._id.product_image,
      sold: item.sold,
      revenue: item.revenue,
      growth: (Math.random() * 30).toFixed(1), // giả lập tăng trưởng
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy sản phẩm bán chạy",
      error: err.message,
    });
  }
};

exports.filterByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate)
      return res.status(400).json({ message: "Thiếu khoảng ngày" });

    const from = new Date(startDate + "T00:00:00Z");
    const to = new Date(endDate + "T23:59:59Z");

    const orders = await Order.find({ createdAt: { $gte: from, $lte: to } });
    const revenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);
    const customers = await User.countDocuments({
      createdAt: { $gte: from, $lte: to },
    });

    const result = [];

    for (
      let d = dayjs(startDate);
      d.isBefore(endDate) || d.isSame(endDate);
      d = d.add(1, "day")
    ) {
      const dayStr = d.format("YYYY-MM-DD");
      const dayStart = new Date(`${dayStr}T00:00:00Z`);
      const dayEnd = new Date(`${dayStr}T23:59:59Z`);
      const ordersInDay = orders.filter(
        (order) =>
          new Date(order.createdAt) >= dayStart &&
          new Date(order.createdAt) <= dayEnd
      );
      result.push({
        date: dayStr,
        displayDate: d.format("DD/MM"),
        revenue: ordersInDay.reduce((s, o) => s + o.finalAmount, 0),
        orders: ordersInDay.length,
        customers: await User.countDocuments({
          createdAt: { $gte: dayStart, $lte: dayEnd },
        }),
      });
    }
    const shippingOrders = orders.filter((o) => o.status === "shipped").length;
    res.json({
      totalRevenue: revenue,
      totalOrders: orders.length,
      totalCustomers: customers,
      shippingOrders,
      dailyData: result,
      orders: orders.map((order) => ({
        orderId: order.order_code,
        customer: order.receiverName,
        amount: order.finalAmount,
        status: order.status,
        date: dayjs(order.createdAt).format("YYYY-MM-DD"),
        displayDate: dayjs(order.createdAt).format("DD/MM/YYYY"),
      })),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lọc theo ngày", error: err.message });
  }
};

exports.summaryByWeek = async (req, res) => {
  try {
    const { week, year } = req.params;
    if (!week || !year) {
      return res.status(400).json({ message: "Thiếu tuần hoặc năm" });
    }

    const firstDay = dayjs().year(year).week(week).startOf("week").toDate();
    const lastDay = dayjs().year(year).week(week).endOf("week").toDate();

    const orders = await Order.find({
      createdAt: { $gte: firstDay, $lte: lastDay },
    });
    const users = await User.find({
      createdAt: { $gte: firstDay, $lte: lastDay },
    });
    const revenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);
    const shippingOrders = orders.filter((o) => o.status === "shipped").length;

    const dailyData = [...Array(7)].map((_, i) => {
      const day = dayjs(firstDay).add(i, "day");
      const ordersInDay = orders.filter((o) =>
        dayjs(o.createdAt).isSame(day, "day")
      );
      const customersInDay = users.filter((u) =>
        dayjs(u.createdAt).isSame(day, "day")
      );

      return {
        date: day.format("YYYY-MM-DD"),
        displayDate: day.format("DD/MM"),
        revenue: ordersInDay.reduce((s, o) => s + o.finalAmount, 0),
        orders: ordersInDay.length,
        customers: customersInDay.length,
      };
    });

    res.json({
      totalRevenue: revenue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      shippingOrders,
      dailyData,
      orders: orders.map((order) => ({
        orderId: order.order_code,
        customer: order.receiverName,
        amount: order.finalAmount,
        status: order.status,
        date: dayjs(order.createdAt).format("YYYY-MM-DD"),
        displayDate: dayjs(order.createdAt).format("DD/MM/YYYY"),
      })),
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Lỗi thống kê tuần", error: err.message });
  }
};
exports.summaryByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const result = [];

    for (let month = 0; month < 12; month++) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59);

      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
      });
      const users = await User.find({ createdAt: { $gte: start, $lte: end } });

      result.push({
        month: month + 1,
        revenue: orders.reduce((sum, o) => sum + o.finalAmount, 0),
        orders: orders.length,
        customers: users.length,
      });
    }

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi thống kê theo năm", error: err.message });
  }
};
