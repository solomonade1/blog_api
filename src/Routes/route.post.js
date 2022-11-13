const express = require("express");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");
const {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getDraftPosts,
  getPublishedPosts,
  getPostById,
  publishPost,
} = require("../controllers/controller.post");

const postRoute = express.Router();

// CREATE POST
postRoute.post("/create/:userid", verifyUser, createPost);

// UPDATE POST
postRoute.put("update/:id", verifyUser, updatePost);

//DELETE POST
postRoute.delete("delete/:id/:userid", verifyUser, deletePost);

// GET PUBLISH POST
postRoute.get("/allpublish", getPublishedPosts);

// GET POST BY ID
postRoute.get("/mypost/:id", getPostById);

// PUBLISH POST
postRoute.put("/publishpost/:id", verifyUser, publishPost);

// GET ALL POSTS
postRoute.get("/getallpost", getAllPost);

// GET DRAFT POST
postRoute.get("/draft", verifyUser, getDraftPosts);

module.exports = postRoute;
