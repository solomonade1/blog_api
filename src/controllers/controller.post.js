const User = require("../models/model.user");
const Post = require("../models/model.post");
const { createError } = require("../utils/error");
const { readingTime } = require("../utils/readingTime");

// CREATE POST
const createPost = async (req, res, next) => {
  const userId = req.params.userid;
  const newPost = new Post({
    ...req.body,
    reading_time: readingTime(req.body.body),
    author: req.user.id,
  });

  try {
    const postUsername = await User.findById(userId);
    if (req.body.username !== postUsername.username) {
      next(createError(404, "Username not match!"));
    } else {
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
    }
  } catch (error) {
    next(error);
  }
};

//UPDATE POST
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

// DELETE POST
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

// GET POST BY ID
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { read_count: 1 },
      },
      { new: true }
    ).populate("author");

    const { author, ...otherDetails } = post._doc;
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};

// GET ALL PUBLISHED POSTS
const getPublishedPosts = async (req, res, next) => {
  const username = req.query.user;
  const tagName = req.query.tag;
  const title = req.query.title;
  const sortBy = req.query.sortBy;
  const perPage = 20;
  const page = Math.max(0, req.params.page);

  const sortQuery = {};

  if (req.query.sortBy) {
    const str = req.query.sortBy.split(":");
    sortQuery[str[0]] = str[1] === "desc" ? -1 : 1;
  }
  try {
    const publishedPost = await Post.find({ state: "published" });
    if (publishedPost.length >= 0) {
      try {
        let posts;
        if (username) {
          posts = await Post.find({ username, state: "published" }).populate(
            "author",
            "firstName"
          );
        } else if (tagName) {
          posts = await Post.find({
            tags: {
              $in: [tagName],
            },
          }).populate("author", "firstName");
        } else if (title) {
          posts = await Post.find({ state: "published", title }).populate(
            "author",
            "firstName"
          );
        } else if (sortBy) {
          posts = await Post.find({ state: "published" })
            .sort(sortQuery)
            .populate("author", "firstName");
        } else {
          posts = await Post.find({ state: "published" })
            .limit(perPage)
            .skip(perPage * page)
            .populate("author", "firstName");
        }

        res.status(200).json(posts);
      } catch (err) {
        next(err);
      }
    } else {
      next(createError(401, "No publish post found!"));
    }
  } catch (err) {
    next(err);
  }
};

// GET ALL DRAFT POST
const getDraftPosts = async (req, res, next) => {
  const username = req.query.user;
  const tagName = req.query.tag;
  const title = req.query.title;
  const sortBy = req.query.sortBy;
  const perPage = 20;
  const page = Math.max(0, req.params.page);

  const sortQuery = {};

  if (req.query.sortBy) {
    const str = req.query.sortBy.split(":");
    sortQuery[str[0]] = str[1] === "desc" ? -1 : 1;
  }
  try {
    const publishedPost = await Post.find({ state: "draft" });
    if (publishedPost.length === 0) {
      return next(createError(404, "No Post Publish Yet!"));
    } else if (publishedPost.length >= 1) {
      try {
        let posts;
        if (username) {
          posts = await Post.find({state: "draft", username }).populate("author", "firstName");
        } else if (tagName) {
          posts = await Post.find({state: "draft",
            tags: {
              $in: [tagName],
            },
          }).populate("author", "firstName");
        } else if (title) {
          posts = await Post.find({state: "draft", title }).populate("author", "firstName");
        } else if (sortBy) {
          posts = await Post.find({ state: "draft" })
            .sort(sortQuery)
            .populate("author", "firstName");
        } else {
          posts = await Post.find({ state: "draft" })
            .limit(perPage)
            .skip(perPage * page)
            .populate("author", "firstName");
        }

        res.status(200).json(posts);
      } catch (err) {
        next(err);
      }
    } else {
      return;
    }
  } catch (err) {
    next(err);
  }
};

// GET ALL POSTS (BOTH DRAFT AND PUBLISHED)
const getAllPost = async (req, res, next) => {
  const username = req.query.user;
  const tagName = req.query.tag;
  const title = req.query.title;
  const sortBy = req.query.sortBy;
  const perPage = 20;
  const page = Math.max(0, req.params.page);

  const sortQuery = {};

  if (req.query.sortBy) {
    const str = req.query.sortBy.split(":");
    sortQuery[str[0]] = str[1] === "desc" ? -1 : 1;
  }
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username }).populate("author", "firstName");
    } else if (tagName) {
      posts = await Post.find({
        tags: {
          $in: [tagName],
        },
      }).populate("author", "firstName");
    } else if (title) {
      posts = await Post.find({ title }).populate("author", "firstName");
    } else if (sortBy) {
      posts = await Post.find().sort(sortQuery).populate("author", "firstName");
    } else {
      posts = await Post.find()
        .limit(perPage)
        .skip(perPage * page)
        .populate("author", "firstName");
    }

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// // GET BY PUBLISH ID
// const getByPublishedId = async (req, res, next) => {
//   try {
//     const publishedPost = await Post.find({ state: "published" });
//     if (!publishedPost) {
//       return next(createError(404, "Post not Found!"));
//     }
//     try {
//       const publishedPostId = await Post.findById(req.params.id);
//       res.status(200).json(publishedPostId);
//     } catch (err) {
//       next(err);
//     }
//     return;
//   } catch (err) {
//     next(err);
//   }
// };

// PUBLISH POST
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
  getPostById,
  getAllPost,
  getDraftPosts,
  getPublishedPosts,
  publishPost,
};
