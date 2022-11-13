const express = require("express");
const cookieParser = require("cookie-parser");

const { connectToMongoDB } = require("./configs/configDB");
const authRoute = require("./Routes/route.auth");
const userRoute = require("./Routes/route.user");
const postRoute = require("./Routes/route.post");
const tagRoute = require("./Routes/route.tag");

const app = express();

connectToMongoDB();

// Middlewares
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/tag", tagRoute);

// Error Handle middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

module.exports = app;
