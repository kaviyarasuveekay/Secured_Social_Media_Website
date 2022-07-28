// Importing mongoose
const mongoose = require("mongoose");

// MongoDb URI
const mongoUri = process.env.MONGO_URI;

const initDB = () => {
  // Connect to MongoDB
  mongoose.connect(
    mongoUri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("MongoDB connection successful");
    }
  );

  const db = mongoose.connection;

  // MongoDB Error Handling
  db.on("error", (error) => console.error(`MongoDB error occurred : ${error}`));
};

module.exports = { initDB };
