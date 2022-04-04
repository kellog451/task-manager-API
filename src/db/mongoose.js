const mongoose = require("mongoose");

const connURL =
  "mongodb+srv://mongoAdmin:mongoAdmin@cluster0.baz2h.mongodb.net/task-manager-test?retryWrites=true&w=majority";

mongoose.connect(connURL, (error, client) => {
  if (error) console.log(error);
});
