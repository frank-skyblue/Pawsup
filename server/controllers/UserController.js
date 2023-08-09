const express = require("express");
const { UserModel } = require("../models/UserModel");
// Base route: /api/user
const UserController = express.Router();

// GET /api/user
UserController.get("/", async (req, res) => {
    try {
      const users = await UserModel.getUsers();
      res.json(users.map((user) => user.cleanCopy()));
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Encountered an error while fetching users" });
    }
});

//GET /api/user/:id
UserController.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await UserModel.getUserByID(uid);
    if (!user) {
      return res.status(404).json({
        message: `User with ID '${uid}' not found`,
      });
    }
    res.status(200).json(user.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching user with ID '${id}'" });
  }
});

//POST /api/user
UserController.post("/", async (req, res) => {
  const { username, email, password, fname, lname, city, phone_number } = req.body;

  if (!username || !email || !password || !fname || !lname || !city || !phone_number ) {
    return res.status(400).json({
      message: "[username, email, password, fname, lname, city, phone_number] cannot be empty in response body",
    });
  }

  const user_check = await UserModel.getUserByUsername(username);

  if (user_check) {
    return res.status(401).json({
      message: `A user with the chosen username already exists`,
    });
  }

  const user = new UserModel({
    username: username,
    email: email,
    password: password,
    fname: fname,
    lname: lname,
    city: city,
    phone_number: phone_number,
    //avatar: "https://i.imgur.com/QS8iSoig.jpg"
    avatar: "avatar1.png"
  });

  try {
    await user.insert();
    res.status(201).json(user.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating account" });
  }
});
// PUT /api/user/:uid
// Able to change user's password, email, location, avatar, or is_service_provider fields. Username cannot be changed.
// At least one of these fields must be in request body. 
UserController.put("/:uid", async(req, res) => {
  const { uid } = req.params;
  const { password, email, city, phone_number, avatar, is_service_provider } = req.body;

  if (!password && !email && !city && !phone_number && !avatar && !(is_service_provider != null)) {
    return res.status(400).json({
      message: "[password, email, city, phone_number, avatar, is_service_provider] cannot all be empty in response body. Nothing to edit!",
    });
  }

  try {
    const user = await UserModel.getUserByID(uid);
    if (!user) {
      return res.status(404).json({
        message: `User with ID '${uid}' not found`,
      });
    }

    if (password) {
      user.password = password;
    }

    if (email) {
      user.email = email;
    }

    if (city) {
      user.city = city;
    }

    if (phone_number){
      user.phone_number = phone_number;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    if (is_service_provider != null) {
      user.is_service_provider = is_service_provider;
    }

    await user.save();
    res.status(200).json(user.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while updating user" });
  }
});

exports.UserController = UserController;