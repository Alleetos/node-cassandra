// database/database.js

const { Client } = require('cassandra-driver');
require('dotenv').config();

const client = new Client({
  cloud: { secureConnectBundle: process.env.ASTRA_DB_SECURE_BUNDLE_PATH },
  credentials: { username: 'token', password: process.env.ASTRA_DB_APPLICATION_TOKEN }
});

module.exports = client;
