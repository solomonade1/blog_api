const User = require("../models/model.user");
const Post = require("../models/model.post");
const Tag = require("../models/model.tag");
const mongoose = require("mongoose");
const { createError } = require("../utils/error");
const ObjectId = mongoose.Types.ObjectId;

const createPost = async (req, res, next) => {
  const userId = req.params.userid;
  const newPost = new Post({
    ...req.body,
    author: req.user.id,
  });

  try {
    const savedPost = await (
      await newPost.save()
    ).populate("author", "firstName");
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
        $inc: { read_count: 1 },
      },
      { new: true }
    ).populate("author");

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const getallPost = async (req, res, next) => {
  try {
    const [results, itemCount] = await Promise.all([
      Post.find({})
        .populate("tags", "author")
        .sort({ createdAt: -1 })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Post.count({}),
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    return res.status(201).json({
      object: "list",
      has_more: paginate.hasNextPages(req)(pageCount),
      data: results,
      pageCount,
      itemCount,
      currentPage: req.query.page,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const myAllposts = async (req, res, next) => {
  try {
    const { query } = req;

    const {
      createdAt,
      state,
      title,
      order = "asc",
      order_by = "createdAt",
      page = 1,
      per_page = 20,
    } = query;

    const findQuery = {};

    if (createdAt) {
      findQuery.created_at = {
        $gt: createdAt.startOf("day").toDate(),
        $lt: createdAt.endOf("day").toDate(),
      };
    }

    if (state) {
      findQuery.state = state;
    }
    // if (search) {
    //   findQuery.search = search;
    // }
     if(title) {
      findQuery.title = title
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

    const posts = await Post.find(findQuery)
      .populate("author", "firstName")
      .sort(sortQuery)
      .skip(page)
      .limit(per_page);
    return res.status(200).json({ status: true, posts });
  } catch (err) {
    next(err);
  }
};

const getAllThePost = async (req, res, next) => {
  try {
    const post = await Post.find({});
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res) => {
  const match = {};
  try {
    const [results, itemCount] = await Promise.all([
      Post.find({})
        .populate()
        .sort({ createdAt: -1 })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Post.count({}),
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    return res.status(201).json({
      data: results,
      pageCount,
      itemCount,
      currentPage: req.query.page,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
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

const publishPost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const savePublished = await Post.findById(postId);
    if (savePublished.state === "published") {
      return next(createError(404, "Post has been Published!"));
    } else {
      await Post.findByIdAndUpdate(postId, {
        $set: {
          state: "published",
        },
      });
    }
    res.status(200).json("Post has been published");
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
  getByPublishedId,
  publishPost,
  myAllposts,
  getAll,
};
