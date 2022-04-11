const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/account");

// creating user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    sendWelcomeEmail(user.email, user.name);
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
// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (user) res.send(user);
//     else return res.status(404).send();
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// update user.
router.patch("/users/update", auth, async (req, res) => {
  const fieldsToUpdate = Object.keys(req.body);
  const allowedToUpdate = ["name", "password", "age", "email"];
  isValidOperation = fieldsToUpdate.every((field) =>
    allowedToUpdate.includes(field)
  );

  console.log("Request Data", req);

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: "Invalid Operation: Field not editable!" });
  }

  try {
    const user = await User.findById(req.user._id);

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

// delete user account
router.delete("/users/account", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendGoodbyeEmail(req.user.email, req.user.name);
    res.send(req.user);
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

// logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// logout user (from all devices || clear all tokens)
router.post("/users/logout-all", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("User Logged out of all devices!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// upload user profile pic

const upload = multer({
  // dest: "images/avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    // if (!file.originalname.match(/\.(doc|docx)$/))
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/))
      return cb(new Error("Please Upload an image. (Max file size: 1MB)"));

    cb(undefined, true);
  },
});

router.post(
  "/users/account/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// delete account avatar
router.delete("/users/account/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// get account avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
