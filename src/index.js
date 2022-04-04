const express = require("express");
require("./db/mongoose");

const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const jwt = require("jsonwebtoken");

const app = express();

const port = process.env.PORT || 3000;

// defining middleware
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// app.use((req, res, next) => {
//   if (req.path === "/users/login") {
//     res.status(503).send("System is Currently Under Maintenance");
//   } else next();
// });

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log("listening on port ", port);
});

const myFunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse");
  console.log(token);

  const data = jwt.verify(token, "thisismynewcourse", {
    expiresIn: "1 hour",
  });

  return data;
};
