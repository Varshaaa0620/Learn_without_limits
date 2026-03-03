const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('completed', 'in_progress'),
    defaultValue: 'in_progress'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'progress',
  timestamps: false
});

module.exports = Progress;
