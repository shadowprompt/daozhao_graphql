const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('./DAO');
const term = require('./instance/wp_terms');
const sequelize = require('./index');
const {generateSqlConditions} = require('../../util/index');

class POST extends DAO {
  constructor(...arg) {
    super(...arg);
  }
  async list(_, fields = {}) {
    const { currentPage = 1, pageSize = 10, order = [], options = {} } = fields;
    Reflect.deleteProperty(fields, 'currentPage');
    Reflect.deleteProperty(fields, 'pageSize');
    Reflect.deleteProperty(fields, 'order');
    Reflect.deleteProperty(fields, 'options');

    const generateOrder = (tableName, arr) => {
      return `${tableName}.${arr[0]} ${arr[1]}`
    };
    console.log('fields -> ', fields);
    const { slug = '' } = fields;
    const condition = slug ? await term.findTermBySlug(term, {slug}).then(([detail = {}]) => detail) : {};

    const sqlConditions =
      generateSqlConditions(['slug.ter'], ['post_type', 'post_status', 'slug', 'keyword'], ['keyword'])(fields, 'po');
    const sqlLimit =
      currentPage && pageSize ? ` LIMIT ${(currentPage - 1) * pageSize}, ${pageSize}` : '';
    const sqlFrom = `
        FROM wp_posts po
        INNER JOIN wp_term_relationships rel on rel.object_id = po.ID
        INNER JOIN wp_term_taxonomy tax on tax.term_taxonomy_id =rel.term_taxonomy_id
        INNER JOIN wp_terms ter on ter.term_id = tax.term_id
        `;
    const sql = `
      SELECT t1.*, t2.* FROM
      (
        SELECT count(1) as total FROM
        (SELECT DISTINCT po.ID
        ${sqlFrom}
        WHERE ${sqlConditions}) abc
      ) t1
      left join (
          SELECT DISTINCT po.*
            ${sqlFrom}
            WHERE ${sqlConditions}
            ORDER BY ${generateOrder('po', order)}  ${sqlLimit}
      ) t2 on 1=1
    `;

    const res = await sequelize.query(sql).then(([result = []]) => result); // 两层数组
    const list = await Promise.all(
      res.map(async (item) => {
        return {
          // ...item.get({ plain: true }),
          ...item,
          ...(await term.findTermOfPost(term, {id: item.ID})),
        };
      }),
    );
    return {
      list,
      condition,
    };
  }
}

module.exports = POST;
