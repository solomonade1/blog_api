const Tag = require("../models/model.tag")


const creatTag = async (req, res, next) => {
   const postId = req.params.postid;
  const newTag = new Post(req.body);
  

  try {
    const savedTag = await newTag.save();
    try {
      await User.findByIdAndUpdate(userId, {
        $push: { tags: savedTag._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

