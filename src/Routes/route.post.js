const express = require("express");
const { verifyUser } = require("../utils/verifyToken");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
  getallPost,
  getPublished,
  getByPublishedId,
  populateAuthor,
} = require("../controllers/controller.post");

const postRoute = express.Router();

postRoute.get("/all", getallPost);
postRoute.get("/pub", getPublished);
postRoute.get("/pub/:id", getByPublishedId);
postRoute.get("/author/:authorid", populateAuthor);

postRoute.post("/:userid", verifyUser, createPost);

postRoute.put("/:id", verifyUser, updatePost);

postRoute.delete("/:id/:userid", verifyUser, deletePost);

postRoute.get("/:id", getPost);

postRoute.get("/", getallPost);

// postRoute.get("/pub", getPublished);

module.exports = postRoute;
