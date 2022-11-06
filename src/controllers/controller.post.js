const User = require("../models/model.user");
const Post = require("../models/model.post");
const Tag = require("../models/model.tag");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// import { createError } from "../utils/error.js";

const createPost = async (req, res, next) => {
  const userId = req.params.userid;
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    try {
      await User.findByIdAndUpdate(userId, {
        $push: { posts: savedPost._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};
const updatePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  const userId = req.params.userid;
  try {
    await Post.findByIdAndDelete(req.params.id);
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { posts: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Post has been Deleted.");
  } catch (error) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { read_count: +1 },
      },
      { new: true }
    );

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const getallPost = async (req, res, next) => {
  try {
    const { query } = req;

    const {
      createdAt,
      state,
      author,
      title,
      read_count,
      reading_time,
      order = "asc",
      order_by = "createdAt",
      page = 1,
      per_page = 10,
    } = query;

    const findQuery = {};

    if (createdAt) {
      findQuery.createdAt = {
        $gt: moment(createdAt).startOf("day").toDate(),
        $lt: moment(createdAt).endOf("day").toDate(),
      };
    }

    if (state) {
      findQuery.state = state;
    }
    if (author) {
      findQuery.author = author;
    }

    const sortQuery = {};

    const sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      if (order === "asc" && order_by) {
        sortQuery[attribute] = 1;
      }

      if (order === "desc" && order_by) {
        sortQuery[attribute] = -1;
      }
    }

    const orders = await OrderModel.find(findQuery)
      .sort(sortQuery)
      .skip(page)
      .limit(per_page);

    return res.status(200).json({ status: true, orders });
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// const getOrders = async (req, res) => {
// const { query } = req;

// const {
//   created_at,
//   state,
//   order = "asc",
//   order_by = "created_at",
//   page = 1,
//   per_page = 10,
// } = query;

// const findQuery = {};

// if (created_at) {
//   findQuery.created_at = {
//     $gt: moment(created_at).startOf("day").toDate(),
//     $lt: moment(created_at).endOf("day").toDate(),
//   };
// }

// if (state) {
//   findQuery.state = state;
// }

// const sortQuery = {};

// const sortAttributes = order_by.split(",");

// for (const attribute of sortAttributes) {
//   if (order === "asc" && order_by) {
//     sortQuery[attribute] = 1;
//   }

//   if (order === "desc" && order_by) {
//     sortQuery[attribute] = -1;
//   }
// }

// const orders = await OrderModel.find(findQuery)
//   .sort(sortQuery)
//   .skip(page)
//   .limit(per_page);

// return res.status(200).json({ status: true, orders });
// };

const getPublished = async (req, res, next) => {
  try {
    const publishedPost = await Post.find({ state: "published" });
    res.status(200).json(publishedPost);
  } catch (err) {
    next(err);
  }
};
const getByPublishedId = async (req, res, next) => {
  try {
    await Post.find({ state: "published" });
    try {
      const publishedPostId = await Post.findById(req.params.id);
      res.status(200).json(publishedPostId);
    } catch (err) {
      next(err);
    }
    return;
  } catch (err) {
    next(err);
  }
};

const populateAuthor = async (req, res, next) => {
  authorId = ObjectId(req.params.authorid);
  try {
    const author = await Post.findById(req.params.authorid).populate({
      path: "author",
      model: "User",
    });

    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getallPost,
  getPublished,
  getByPublishedId,
  populateAuthor,
};
