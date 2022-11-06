const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  populatePost,
  getUserPost,
} = require("../controllers/controller.user");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");
const userRoute = express.Router();

//UPDATE
userRoute.put("/:id", verifyUser, updateUser);

//DELETE
userRoute.delete("/:id", verifyUser, deleteUser);

//GET
userRoute.get("/:id", verifyUser, getUser);

//GET ALL
userRoute.get("/", verifyAdmin, getAllUser);

// Populate post

userRoute.get("/pop/:id", populatePost)
userRoute.get("/userpost/:id", verifyUser, getUserPost)

module.exports = userRoute;
