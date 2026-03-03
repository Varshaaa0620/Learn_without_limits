const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for now - works everywhere including Render
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

module.exports = sequelize;
