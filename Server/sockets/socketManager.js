const { Server } = require("socket.io"); // ✅ dùng CommonJS
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Đổi theo frontend của bạn
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Admin hoặc client join vào room cụ thể
    socket.on("joinRoom", (roomName) => {
      socket.join(roomName);
      console.log(`📥 Socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on("leaveRoom", (roomName) => {
      socket.leave(roomName);
      console.log(`📤 Socket ${socket.id} left room: ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });

    // Debug test ping
    socket.on("ping", (msg) => {
      console.log("📡 Ping từ client:", msg);
      socket.emit("pong", "Pong từ server");
    });
  });
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};
