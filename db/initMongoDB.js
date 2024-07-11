const mongoose = require('mongoose');
const env = require('../helpers/envFunction');

const initMongoDB = async () => {
  try {
    const USER = env('MONGODB_USER');
    const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
    const MONGODB_URL = env('MONGODB_URL');
    const MONGODB_NAME = env('MONGODB_NAME');

    const DB_HOST = `mongodb+srv://${USER}:${MONGODB_PASSWORD}@${MONGODB_URL}.yy6y8we.mongodb.net/${MONGODB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(DB_HOST);
  } catch (err) {
    console.log('error db');
    throw err;
  }
};

module.exports = initMongoDB;
