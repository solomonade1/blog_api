const express = require("express");

const { login, register } = require("../controllers/controller.auth");

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);

module.exports = authRoute;
