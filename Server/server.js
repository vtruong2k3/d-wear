const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const path = require("path");
const connectDB = require("./configs/db");
const { initSocket } = require("./sockets/socketManager");
const routerManager = require("./routes/routerManager.routes");
const colorRoutes = require("./routes/color.routes");
const sizeRoutes = require("./routes/size.routes");
const productWithVariantRoute = require("./routes/productWithVariant.routes");



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products-with-variants", productWithVariantRoute);

app.use(routerManager);

app.use("/api/colors", colorRoutes);
app.use("/api/sizes", sizeRoutes);

connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
initSocket(server);
