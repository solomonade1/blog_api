const User = require("../models/model.user");
const { createError } = require("../utils/error");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));
    bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (result) {
          const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT,
            { expiresIn: "1h" }
          );
          const { password, isAdmin, ...otherDetails } = user._doc;
          res
            .cookie("access_token", token, {
              httpOnly: true,
              expire: 360000 + Date.now(),
            })
            .status(200)
            .json({ details: { ...otherDetails } });
        } else {
          next(createError(400, "Wrong Password or Username"));
        }
      })
      .catch((err) => console.error(err));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
