const { Server } = require("socket.io"); // ✅ dùng CommonJS
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // 🔁 Đổi URL frontend tại đây nếu cần
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });

    // Bạn có thể thêm xử lý tùy mục đích ở đây
    socket.on("ping", (msg) => {
      console.log("📡 Received ping:", msg);
      socket.emit("pong", "Pong từ server");
    });
  });
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};
