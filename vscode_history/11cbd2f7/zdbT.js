const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Controllers et Routes
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB (local, pour l'exercice)
mongoose.connect("mongodb://localhost:27017/usersDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/users", userRoutes);

// Lancer server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Users Service running on port ${PORT}`);
});