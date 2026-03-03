const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sections',
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
  },
  youtube_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Lesson;
