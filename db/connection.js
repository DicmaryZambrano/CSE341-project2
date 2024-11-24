const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let isConnected = false;

const initDb = (callback) => {
  if (isConnected) {
    console.log('Database is already connected');
    return callback(null);
  }

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      isConnected = true;
      console.log('Database connected successfully');
      callback(null);
    })
    .catch((err) => {
      console.error('Error connecting to the database:', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!isConnected) {
    throw new Error('Database not initialized');
  }
  return mongoose.connection;
};

module.exports = {
  initDb,
  getDatabase,
};
