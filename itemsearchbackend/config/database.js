const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://rootmentsit_db_user:Brynex@cluster0.afnmxc4.mongodb.net/itemsearch?appName=Cluster0',
      {
        maxPoolSize: 10,          // reuse up to 10 connections instead of creating new ones
        serverSelectionTimeoutMS: 5000,  // fail fast if mongo is unreachable
        socketTimeoutMS: 45000,   // close idle sockets after 45s
        connectTimeoutMS: 10000,  // connection timeout
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

