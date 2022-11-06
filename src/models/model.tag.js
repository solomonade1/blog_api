const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamp: true }
);
const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
