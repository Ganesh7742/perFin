const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "perfin";

const connectDB = async () => {
  try {
    // Connect using the dbName option to handle Atlas URIs correctly
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);

    // Drop legacy index from "username_1" that causes E11000 duplicate key error
    try {
      await mongoose.connection.collection('users').dropIndex('username_1');
      console.log(`✅ Dropped legacy 'username_1' index from users collection.`);
    } catch (indexError) {
      // Silently ignore if the index doesn't exist
    }
  } catch (error) {
    console.log("------------------------------------------");
    console.log("❌ DATABASE CONNECTION CRITICAL ERROR");
    console.log("Error Message:", error.message);
    console.log("URI Used:", MONGO_URI);
    console.log("DB Name Used:", MONGO_DB);
    console.log("------------------------------------------");
    process.exit(1);
  }
};

module.exports = connectDB;
