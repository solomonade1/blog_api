const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    author: {
      type: ObjectId,
      ref: "User",
    },
    desc: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
      require: false,
    },
    reading_time: {
      type: Number,
      default: 1,
      require: false,
    },
    tags: {
      type: ObjectId,
      ref: "Tag"
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("blog", PostSchema);
module.exports = Post;
