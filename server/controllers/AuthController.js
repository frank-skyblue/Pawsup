const express = require("express");
const { passport } = require("../config/passport-config");
// Base route: /api/auth
const AuthController = express.Router();

// POST /api/auth/login
AuthController.post("/login", passport.authenticate("local"), (req, res) => {
  // req.user can now be accessed in subsequent requests to know which logged in user is sending the request
  res.json({ message: "Successfully logged in", user: req.user });
});

// POST /api/auth/logout
AuthController.post("/logout", (req, res) => {
  req.logOut();
  res.json({ message: "Successfully logged out" });
});

// GET /api/auth/user
AuthController.get("/user", (req, res) => {
  if (req.user) {
    res.json({
      isLoggedIn: true,
      user: req.user,
    })
  } else {
    res.json({ 
      isLoggedIn: false,
      user: null,
    });
  }
});

exports.AuthController = AuthController;
