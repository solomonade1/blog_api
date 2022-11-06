const jwt = require("jsonwebtoken");
const { createError } = require("./error");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    try {
        if (req.user.id === req.params.id || req.user.isAdmin === true) {
          next();
        } else {
          return next(createError(403, "You are not authorized!"));
        }
    } catch (error) {
      next(createError(401, "You are not authenticated!"));
    }
  
  });
};
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    try {
      if (req.user.isAdmin === true) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    } catch (error) {
      next(createError(403, "You are not authenticated!"));
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
};
