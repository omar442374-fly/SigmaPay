'use strict';

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB Atlas.
 * Reads MONGODB_URI from environment variables (set in .env).
 */
async function connectToAtlas() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set. Copy .env.example to .env and fill in your Atlas credentials.');
  }

  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || 'sigmapay',
  });

  console.log(`Connected to MongoDB Atlas — db: ${mongoose.connection.db.databaseName}`);
}

async function disconnectFromAtlas() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB Atlas.');
}

module.exports = { connectToAtlas, disconnectFromAtlas };
