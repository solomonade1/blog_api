const express = require("express");
const { verifyUser } = require("../utils/verifyToken");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
  getallPost,

  getByPublishedId,
  publishPost,
  myAllposts,
  getAll,
} = require("../controllers/controller.post");

const postRoute = express.Router();

postRoute.get("/all", getallPost);
postRoute.get("/getall", getAll)

postRoute.get("/pub/:id", getByPublishedId);
postRoute.put("/publish/:id/", verifyUser, publishPost);

postRoute.get("/allpost", myAllposts)

postRoute.post("/:userid", verifyUser, createPost);

postRoute.put("/:id", verifyUser, updatePost);

postRoute.delete("/:id/:userid", verifyUser, deletePost);

postRoute.get("/:id", getPost);

postRoute.get("/", getallPost);

// postRoute.get("/pub", getPublished);

module.exports = postRoute;
