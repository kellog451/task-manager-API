const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

// creating records
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// reading/getting records
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    if (users) res.send(users);
    else res.status(404).send();
  } catch (e) {
    res.send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// get one user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) res.send(user);
    else return res.status(404).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// update user.
router.patch("/users/:id", async (req, res) => {
  const fieldsToUpdate = Object.keys(req.body);
  const allowedToUpdate = ["name", "password", "age", "email"];
  isValidOperation = fieldsToUpdate.every((field) =>
    allowedToUpdate.includes(field)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: "Invalid Operation: Field not editable!" });
  }

  try {
    const user = await User.findById(req.params.id);

    fieldsToUpdate.forEach((field) => (user[field] = req.body[field]));

    await user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    const remainingUsers = await User.find({});
    if (!user) return res.status(404).send();
    res.send(remainingUsers);
  } catch (e) {
    res.status(500).send(e);
  }
});

// login in users
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
