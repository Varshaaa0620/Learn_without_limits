const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if MySQL credentials are available and working
const useMySQL = process.env.DB_HOST && process.env.DB_HOST !== 'localhost';

let sequelize;

if (useMySQL) {
  // Aiven MySQL Configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
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
