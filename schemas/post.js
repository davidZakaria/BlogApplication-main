const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  //Hashtags: { type: String, required: trueNumber, required: true },
  // imageUrl: { type: String, required: true },
  // created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
var imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("post", postSchema);
