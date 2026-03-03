const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
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
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'dropped'),
    defaultValue: 'active'
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  createdAt: 'enrolled_at',
  updatedAt: false
});

module.exports = Enrollment;
