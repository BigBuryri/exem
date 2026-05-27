const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: 'new',
    validate: {
      isIn: [['new', 'assigned', 'completed']]
    }
  },
  type: {
    type: DataTypes.STRING(64),
    allowNull: false,
    defaultValue: 'banquet_booking'
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  adminComment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'applications',
  underscored: true,
  timestamps: true
});

Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });

module.exports = Application;
