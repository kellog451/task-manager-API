require("./db/mongoose");
const express = require("express");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const jwt = require("jsonwebtoken");

const app = express();

const port = process.env.PORT || 3000;

console.log("Process =========>", process);

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log("listening on port ", port);
});
