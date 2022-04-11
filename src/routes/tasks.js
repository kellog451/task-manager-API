const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

// create task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, createdBy: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// read all tasks (by the owner fetching)
// paginate with skip() and limit()
// sort with sort() asc or desc (-1)
router.get("/tasks", auth, async (req, res) => {
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1];
  }
  try {
    const tasks = await Task.find({
      createdBy: req.user._id,
      // completed: req.query.completed,
    })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .sort(sort);

    if (!tasks) res.status(404).send();
    res.send(tasks);
  } catch (e) {
    res.send(e);
  }
});

// read one task
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (task) res.send(task);
    else return res.status(404).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// update task.
router.patch("/tasks/:id", auth, async (req, res) => {
  const fieldsToUpdate = Object.keys(req.body);
  console.log("Fields", fieldsToUpdate);
  const updatableFields = ["description", "completed"];
  const isAllowedToUpdate = fieldsToUpdate.every((field) =>
    updatableFields.includes(field)
  );

  if (!isAllowedToUpdate)
    res.status(400).send({ error: "Field cannot be Updated" });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) return res.status(404).send();

    fieldsToUpdate.forEach((field) => (task[field] = req.body[field]));

    task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// delete task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) return res.status(404).send();

    const remainingTasks = await Task.find({ createdBy: req.user._id });
    res.send(remainingTasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
