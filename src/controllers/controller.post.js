const User = require("../models/model.user");
const Post = require("../models/model.post");
const Tag = require("../models/model.tag");
const mongoose = require("mongoose");
const { createError } = require("../utils/error");
const ObjectId = mongoose.Types.ObjectId;

const createPost = async (req, res, next) => {
  const userId = req.params.userid;
  const newPost =  new Post({
    ...req.body,
    author: req.user.id,
  });

  try {
    const savedPost = await newPost.save().populate("author");
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
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    let tag = req.query.tag || "All";
    let sort = req.query.sort;

    const tagArray = await Tag.find();
    let tagOptions = tagArray.map((tag) => {
      return tag.name;
    });
    // const tagOptions = [
    //   "business",
    //   "business",
    //   "new politics",
    //   "new politics",
    //   "music",
    //   "life style",
    // ];
    tag === "All"
      ? tag = [...tagOptions]
      : (tag = req.query.tag.split(","));
    req.query.sort ? sort.query.sort.split(",") : (sort = [sort]);

    console.log(tagOptions);
    let sortBy = {};

    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }
    // {author: {$regex: search, $options: "i"}}
    const posts = await Post.find({
      $or: [
        // { author: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ],
    })
      .where("tag")
      .in(...tag)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Post.countDocuments({
      tag: { $in: [...tag] },
      // author: { $regex: search, $options: "i" },
      title: { $regex: search, $options: "i" },
    });

    const response = {
      error: false,
      object: "lists",
      total,
      page: page + 1,
      limit,
      tag: tagOptions,
      posts,
    };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};


const getAllThePost = async (req, res, next) => {
  try {
    const post = await Post.find({})
  } catch (err) {
    next(err)
  }
}


const getAll = async (req, res) => {
  const match = {}
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
  getAll
};
