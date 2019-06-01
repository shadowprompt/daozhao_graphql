const Sequelize = require('sequelize');
const DAO = require('../DAO');

const instance = new DAO({
    object_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    term_taxonomy_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    term_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'wp_term_relationships',
    modelName: 'wp_term_relationships',
  }
);
module.exports = instance;