const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
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

taskSchema.pre("save", async function (next) {
  console.log("Task successfully saved");
  next();
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;
