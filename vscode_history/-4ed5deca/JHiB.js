const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ordersDB")
  .then(() => console.log("MongoDB connected - Orders Service"))
  .catch(err => console.log(err));

app.use("/api/orders", orderRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Orders Service running on port ${PORT}`);
});