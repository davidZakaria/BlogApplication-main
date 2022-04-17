const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, required: true, default: "USER" },
  googleId: { type: String, required: false },
});

module.exports = mongoose.model("user", schema);
