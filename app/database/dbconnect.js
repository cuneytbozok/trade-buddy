// dbconnect.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

let isConnected = false; // Maintain a connection state

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    if (isConnected) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using existing MongoDB connection');
      }
      return;
    }

    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // Optional: Handle slow connections
    });

    isConnected = connection.connections[0].readyState === 1;

    if (process.env.NODE_ENV !== 'production') {
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error);

    // Propagate the error to handle gracefully
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = connectDB;