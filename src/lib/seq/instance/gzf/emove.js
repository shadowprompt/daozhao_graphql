const Sequelize = require('sequelize');
const GZF = require('../../GZF');

const instance = new GZF({
    T_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    emoveInDate: {
      type: Sequelize.DATE,
      unique: true,
      allowNull: true,
    },
    pstructId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'gzf_emove',
    modelName: 'gzf_emove',
  }
);
module.exports = instance;
