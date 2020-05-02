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
    fullName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    floorName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    propertyName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    propertyPstructId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pstructId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    typeName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    area: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rent: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isSearchRoom: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    selectable: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    splitedMark: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    splitedSex: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'gzf_house',
    modelName: 'gzf_house',
  }
);
module.exports = instance;
