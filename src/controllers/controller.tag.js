const Tag = require("../models/model.tag");
const Post = require("../models/model.post");

const createTag = async (req, res, next) => {
  const postId = req.params.postid;
  const newTag = new Tag(req.body);

  try {
    const savedTag = await newTag.save();
     try {
       await Post.findByIdAndUpdate(postId, {
         $push: { tags:  savedTag.name},
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

  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    try {
      await Post.findByIdAndUpdate(postId, {
        $pull: { tags: deleted.name },
      });
    } catch (err) {
      next(err);
    }

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
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTag,
  updateTag,
  deleteTag,
  getTag,
  getAllTags,
};
