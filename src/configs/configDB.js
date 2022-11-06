const mongoose = require("mongoose");


const connectToMongoDB = () => {
  mongoose.connect(process.env.MONGODB_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDb Disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
  });
};

module.exports = { connectToMongoDB };
