const mongoDB = require("mongodb");
const { MongoClient, ObjectId } = mongoDB;

const connURL = process.env.MONGO_BD_URL;
const dbName = "task-manager";

MongoClient.connect(connURL, (error, client) => {
  if (error) {
    return console.log("Unable to connect to db");
  }

  const db = client.db(dbName);
  console.log("Connected to db ...........");

  // ------------ CREATE --------------//
  // db.collection("users").insertMany(
  //   [
  //     {
  //       name: "Jimmy",
  //       age: 32,
  //     },
  //     {
  //       name: "Paul",
  //       age: 12,
  //     },
  //     {
  //       name: "Jolly",
  //       age: 23,
  //     },
  //   ],
  //   (error, result) => {
  //     if (error) console.log("Unable to Insert documents");
  //     console.log(result);
  //   }
  // );

  // db.collection("tasks").insertMany(
  //   [
  //     {
  //       description: "Clean the house",
  //       completed: true,
  //     },
  //     {
  //       description: "Renew inspection",
  //       completed: false,
  //     },
  //     {
  //       description: "Pot plants",
  //       completed: false,
  //     },
  //   ],
  //   (error, result) => {
  //     if (error) {
  //       return console.log("Unable to insert tasks!");
  //     }

  //     console.log(result.insertedIds);
  //   }
  // );

  //----------- READ -------------//
  // db.collection("users").findOne({ name: "Jolly" }, (error, response) => {
  //   if (error) {
  //     console.log("Unable to fetch");
  //   } else console.log(response);
  // });

  // db.collection("tasks")
  //   .find({ completed: false })
  //   .toArray((error, response) => {
  //     console.log(response);
  //   });

  // db.collection("tasks").findOne(
  //   { _id: new ObjectId("620b140ecbe994b681b41f55") },
  //   (error, response) => {
  //     console.log(response);
  //   }
  // );

  /* ------------- UPDATE ------------ */
  // db.collection("users")   // update single record
  //   .updateOne(
  //     { _id: new ObjectId("6203a4332f479bcb72408b84") },
  //     {
  //       $set: {
  //         name: "Mike",
  //       },
  //     }
  //   )
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // db.collection("tasks") // update many records
  //   .updateMany(
  //     { completed: false },
  //     {
  //       $set: {
  //         completed: true,
  //       },
  //     }
  //   )
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  /* ----------- DELETE ------------- */
  db.collection("users")
    .deleteOne({ name: "Mike" })
    .then((response) => {
      console.log("One Delete ====>", response);
    })
    .catch((error) => {
      console.log(error);
    });

  db.collection("users")
    .deleteMany({ age: 12 })
    .then((response) => {
      console.log("Many Delete =====>", response);
    })
    .catch((error) => {
      console.log(error);
    });
});
