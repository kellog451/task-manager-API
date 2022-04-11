const mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

taskSchema.pre("save", async function (next) {
  console.log("Task successfully saved");
  next();
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;
