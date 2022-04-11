const mongoose = require("mongoose");

const connURL = process.env.MONGO_DB_URL;

mongoose.connect(connURL, (error, client) => {
  if (error) console.log(error);
});
