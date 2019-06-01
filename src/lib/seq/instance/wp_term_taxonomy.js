const Sequelize = require('sequelize');
const TAXONOMY = require('../TAXONOMY');

const instance = new TAXONOMY({
    term_taxonomy_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    term_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    taxonomy: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    parent: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    count: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'wp_term_taxonomy',
    modelName: 'wp_term_taxonomy',
  }
);
module.exports = instance;