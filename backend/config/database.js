const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if we're in production or have MySQL credentials
const isProduction = process.env.NODE_ENV === 'production';
const hasMySQL = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud');

let sequelize;

if (isProduction || hasMySQL) {
  // Aiven MySQL Configuration for Render production
  sequelize = new Sequelize(
    process.env.DB_NAME || 'defaultdb',
    process.env.DB_USER || 'avnadmin',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 13376,
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
