const express = require("express");
const { verifyUser } = require("../utils/verifyToken");

const {
  createTag,
  updateTag,
  getTag,
  getAllTags,
  deleteTag,
} = require("../controllers/controller.tag");

const tagRouter = express.Router();

tagRouter.post("/create/:postid", verifyUser, createTag);

tagRouter.put("/:id", verifyUser, updateTag);

tagRouter.get("/:id", getTag);

tagRouter.get("/", getAllTags);

tagRouter.delete("/:tagid/:postid", verifyUser, deleteTag);


module.exports = tagRouter;