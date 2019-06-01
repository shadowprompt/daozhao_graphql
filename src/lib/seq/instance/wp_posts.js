const Sequelize = require('sequelize');
const POST = require('../POST');

const instance = new POST({
    ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    post_author: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    post_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    post_date_gmt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    post_content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    post_title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    post_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    comment_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    post_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    post_parent: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    guid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    menu_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    post_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    comment_count: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  },
  {
    // underscored: true,
    timestamps: false,
    freezeTableName: true,
    tableName: 'wp_posts',
    modelName: 'wp_posts',
  }
);
module.exports = instance;