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
    pstructId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    houseCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    rentableCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    province: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    regionName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    township: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    townshipName: {
      type: Sequelize.STRING,
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
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'gzf_project',
    modelName: 'gzf_project',
  }
);
module.exports = instance;
