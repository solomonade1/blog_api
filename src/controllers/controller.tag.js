const Tag = require("../models/model.tag");
const Post = require("../models/model.post");

const createTag = async (req, res, next) => {
  const newTag = new Tag({
    ...req.body,
    post: req.params.id,
  });

  try {
    const savedTag = await newTag.save();
    try {
      
    } catch (err) {
      next(err)
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
        if(!deleted) {
            return res.status(404).json({
                message: "Item not found",
                success: false,
            });
        }
        return res.status(204).json({
            message: "Item successfully deleted",
            success: true,
        });
  
    res.status(200).json("Tag has been deleted");
  } catch (error) {
    next(error);
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
    const tags = await Tag.find()
    res.status(200).json(tags)
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
