const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('./DAO');
const sequelize = require('./index');
const {generateSqlConditions} = require('../../util/index');

class TAXONOMY extends DAO {
  constructor(...arg) {
    super(...arg);
  }
  async list(_, fields = {}) {
    const { currentPage, pageSize } = fields;
    Reflect.deleteProperty(fields, 'currentPage');
    Reflect.deleteProperty(fields, 'pageSize');
    const sqlConditions =
      generateSqlConditions(['post_type', 'post_status'], ['taxonomy'])(fields, this.model.tableName) +
      ' AND wp_term_taxonomy.term_id = wp_terms.term_id';
    const sqlLimit =
      currentPage && pageSize ? `limit ${currentPage - 1}, ${pageSize}` : '';

    const res = await sequelize
      .query(
        `SELECT * FROM wp_term_taxonomy, wp_terms WHERE ${sqlConditions} ${sqlLimit}`
      )
      .then(([result = []]) => result); // 两层数组
    return DAO.getNestCategories(res);
  }
}

module.exports = TAXONOMY;
