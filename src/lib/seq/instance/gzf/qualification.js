const Sequelize = require('sequelize');
const GZF = require('../../GZF');

const instance = new GZF({
    T_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    code: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    dataId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    used: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    maxSelectableHouseType: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    serverAccountId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'gzf_qualification',
    modelName: 'gzf_qualification',
  }
);
module.exports = instance;
