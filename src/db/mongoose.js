const mongoose = require("mongoose");
const myValidator = require("validator");

const connURL =
  "mongodb+srv://mongoAdmin:mongoAdmin@cluster0.baz2h.mongodb.net/task-manager-test?retryWrites=true&w=majority";

mongoose.connect(connURL, (error, client) => {
  if (error) console.log(error);
});

const User = mongoose.model("User", {
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
});

const Tasks = mongoose.model("Tasks", {
  task: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const newTasks = new Tasks({
  task: "Learn React JS",
  description: "Practice React JS to build real world front-end apps",
  completed: true,
});

const newUser = new User({
  name: "Jude",
  age: 21,
  email: "jude@email.com",
  password: "qwe",
});

newUser
  .save()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });

// newTasks
//   .save()
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
