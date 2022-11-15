const Tag = require("../models/model.tag");
const Post = require("../models/model.post");
const { createError } = require("../utils/error");

const createTag = async (req, res, next) => {
  const postId = req.params.postid;
  const newTag = new Tag(req.body);

  try {
    const posts = await Post.findById(postId);
    if (!posts) {
      return next(createError(404, "Post not found"));
    }
    const savedTag = await newTag.save();
    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { tags: savedTag.name },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedTag);
  } catch (error) {
    next(error);
  }
};

const updateTag = async (req, res, next) => {
  const tagId = req.params.id;

  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedTag);
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  const postId = req.params.postid;
  const tagId = req.params.tagid;

  try {
    const posts = await Post.findById(postId);
    const tagName = await Tag.findById(tagId);
    if (!posts) {
      return next(createError(404, "Post not found"));
    }
    if (!tagName) {
      return next(createError(404, "Tag not found"));
    }
    try {
      await Post.findByIdAndUpdate(postId, {
        $pull: { tags: tagName.name },
      });
    } catch (err) {
      next(err);
    }
    await Tag.findByIdAndDelete(tagId);

    res.status(200).json("Tag has been deleted");
  } catch (err) {
    next(err);
  }
};

const getTag = async (req, res, next) => {
  const tagId = req.params.id;
  try {
    const tag = await Tag.findById(tagId);
    res.status(200).send(tag);
  } catch (err) {
    next(err);
  }
};

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
      const filteredtags = tags.filter((tag) => {
        let isValid = true;
        for (key in filters) {
          isValid = isValid && tag[key] === filters[key];
        }
        return isValid;
      });
    res.status(200).json(filteredtags);
  } catch (err) {
    next(err);
  }
};

const deleteAll = async (req, res, next) => {
  try {
    await Tag.deleteMany()
    res.status(200).json("Tags has been deleted")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createTag,
  updateTag,
  deleteTag,
  getTag,
  getAllTags,
  deleteAll
};
