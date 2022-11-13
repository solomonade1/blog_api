const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
      required: false,
    },
    reading_time: {
      type: Number,
      default: 1,
      required: false,
    },
    tags: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("blog", PostSchema);
module.exports = Post;
