const { Server } = require("socket.io");
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Khi admin kết nối, họ sẽ gửi sự kiện này để tham gia vào kênh chung
    socket.on("adminJoin", (adminId) => {
      socket.join("admin_room");
      console.log(` Admin ${adminId} joined admin_room`);
    });
    // ------------------------------------

    // Admin hoặc client join vào room chat cụ thể
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
  });
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};
