const Sequelize = require('sequelize');
const TERM = require('../TERM');

const instance = new TERM({
    term_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    term_group: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'wp_terms',
    modelName: 'wp_terms',
  }
);
module.exports = instance;