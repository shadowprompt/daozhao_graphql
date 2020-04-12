const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('./DAO');
const term = require('./instance/wp_terms');
const user = require('./instance/wp_users');
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
      generateSqlConditions(['slug.ter'], ['post_type', 'post_status', 'slug', 'keyword'],
        ['keyword'], ['year', 'month', 'day'])
      (fields, 'po');
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
        (
          SELECT DISTINCT po.ID
          ${sqlFrom}
          WHERE ${sqlConditions}
        ) abc
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
          ...{
            user: await user.find(user, {id: item.post_author}),
          }
        };
      }),
    );
    return {
      list,
      condition,
      date: [fields.year, fields.month, fields.day],
    };
  }
  archiveList(_) {
    const sql = `SELECT YEAR(post_date) AS 'year', MONTH(post_date) AS 'month', count(ID) as posts FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish' GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date DESC`
    return sequelize.query(sql).then(([result = []]) => result); // 两层数组
  }
  prevNext(_, fields)  {
    return Promise.all([this.model.findAll({
      order: [
        ['post_date', 'DESC'],
      ],
      limit: 1,
      where: {
        post_date: {
          [Op.lt]: fields.post_date,
        },
        post_status: 'publish',
        post_type: 'post',
      }
    }), this.model.findAll({
      limit: 1,
      order: [
        ['post_date', 'ASC']
      ],
      where: {
        post_date: {
          [Op.gt]: fields.post_date,
        },
        post_status: 'publish',
        post_type: 'post',
      }
    })]);
  }
  async item(_, {id})  {
    const result = await this.model.findByPk(id);
    return {
      ...result.get({ plain: true }),
      ...(await term.findTermOfPost(term, {id: result.ID})),
      user: await user.find(user, {id: result.post_author}),
    };
  }
}

module.exports = POST;
