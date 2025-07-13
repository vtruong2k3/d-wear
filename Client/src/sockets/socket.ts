import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // 🔁 backend chạy port 3000

export default socket;
