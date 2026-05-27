const sequelize = require('../config/database');
const User = require('./User');
const Application = require('./Application');

module.exports = {
  sequelize,
  User,
  Application
};
