const Sequelize = require('sequelize');
const GZF_HOUSE_RECODE = require('../../GZF');

const instance = new GZF_HOUSE_RECODE({
    T_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: true,
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pstructId: { // house相关
      type: Sequelize.STRING,
      allowNull: true,
    },
    serverAccountId: { // qualification相关
      type: Sequelize.STRING,
      allowNull: true,
    },
    periodId: { // 自行添加的,跟period相关
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updateTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    cancelTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'gzf_queue',
    modelName: 'gzf_queue',
  }
);
module.exports = instance;
