const Sequelize = require('sequelize');
const USER = require('../wxUSER');

const instance = new USER({
    ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    unionId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    openId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nickName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    sessionKey: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    registerTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    updateTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    formId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'test',
    modelName: 'test',
  }
);
module.exports = instance;
