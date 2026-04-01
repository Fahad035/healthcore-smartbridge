const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is missing in environment variables.');
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
