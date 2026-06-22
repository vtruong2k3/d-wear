const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const path = require("path");
const connectDB = require("./configs/db");
const { initSocket } = require("./sockets/socketManager");
const routerManager = require("./routes/routerManager.routes");

const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Add production domain here later
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(routerManager);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  
  const status = err.status || 500;
  res.status(status).json({
    message: err.isOperational ? err.message : "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

connectDB();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
initSocket(server);
