const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if we have all required MySQL credentials
const hasMySQLCredentials = process.env.DB_HOST && 
                            process.env.DB_USER && 
                            process.env.DB_PASSWORD &&
                            process.env.DB_NAME;

const isRender = process.env.RENDER || process.env.NODE_ENV === 'production';

let sequelize;

if (isRender && hasMySQLCredentials) {
  // Render production with MySQL credentials
  console.log('Using MySQL database for production');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_NAME:', process.env.DB_NAME);
  
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
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
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // Fallback to SQLite (for local dev or if MySQL credentials missing)
  console.log('Using SQLite database');
  if (isRender && !hasMySQLCredentials) {
    console.warn('WARNING: MySQL credentials not found, falling back to SQLite');
  }
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
