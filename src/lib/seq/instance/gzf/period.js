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
    apiId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    endTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'gzf_period',
    modelName: 'gzf_period',
  }
);
module.exports = instance;
