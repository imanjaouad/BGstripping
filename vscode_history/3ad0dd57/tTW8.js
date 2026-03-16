const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB local
mongoose.connect("mongodb://localhost:27017/productsDB")
  .then(() => console.log("MongoDB connected - Products Service"))
  .catch(err => console.log(err));

// Routes
app.use("/api/products", productRoutes);

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Products Service running on port ${PORT}`);
});