const Sequelize = require('sequelize');
const USER = require('../USER');

const instance = new USER({
    ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_login: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_pass: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_nicename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_registered: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    user_activation_key: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    display_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'wp_users',
    modelName: 'wp_users',
  }
);
module.exports = instance;
