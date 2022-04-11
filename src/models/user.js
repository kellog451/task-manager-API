const mongoose = require("mongoose");
const myValidator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate: {
        validator: (value) => {
          if (value < 0) throw new Error("Age must be greater than zero");
        },
        message: "Age must be greater than zero",
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: {
        validator: (value) => {
          if (!myValidator.isEmail(value)) throw new Error("Email is invalid");
        },
        message: "Email is invalid",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate: {
        validator: (value) => {
          if (value.toLowerCase().includes("password"))
            throw new Error("Password is invalid");
        },
        message: "Password is invalid",
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: { type: Buffer },
  },
  { timestamps: true }
);

// relationship btn users and tasks (virtual property)
userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id", // key used in task table
  foreignField: "createdBy", // key used in task table = to localField.
});

// hash password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// remove tasks after account is deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ createdBy: user._id });
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found!");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid Login credentials");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_TOKEN);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
