const Post = require("../models/model.post");
const User = require("../models/model.user");

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
     const { password, isAdmin, ...otherDetails } = updatedUser._doc;
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been Deleted.");
  } catch (err) {
    next(err);
  }
};
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, isAdmin, ...otherDetails} = user._doc

    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};
const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const populatePost = async (req ,res, next) => {
  try {
    const post = await User.findById(req.params.id).populate("post")
    res.status(200).json(post)
  } catch (err) {
    next(err)
  }
}
const getUserPost = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const postList = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post);
      })
    );
    res.status(200).json(postList);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  populatePost,
  getUserPost
};
