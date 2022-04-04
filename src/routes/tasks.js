const express = require("express");
const router = new express.Router();
const Task = require("../models/task");

// create task
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// read all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (tasks) res.send(tasks);
    else return res.status(404).send();
  } catch (e) {
    res.send(e);
  }
});

// read one task
router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) res.send(task);
    else return res.status(404).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// update task.
router.patch("/tasks/:id", async (req, res) => {
  const fieldsToUpdate = Object.keys(req.body);
  console.log("Fields", fieldsToUpdate);
  const updatableFields = ["description", "completed"];
  const isAllowedToUpdate = fieldsToUpdate.every((field) =>
    updatableFields.includes(field)
  );

  if (!isAllowedToUpdate)
    res.status(400).send({ error: "Field cannot be Updated" });

  try {
    const task = await Task.findById(req.params.id);

    fieldsToUpdate.forEach((field) => (task[field] = req.body[field]));

    task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) return res.status(404).send();
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// delete task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    const remainingTasks = await Task.find({});
    if (!task) return res.status(404).send();
    res.send(remainingTasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
