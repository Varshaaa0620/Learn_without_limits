const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  order_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Section;
