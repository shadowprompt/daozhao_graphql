const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('./DAO');
const term = require('./instance/wp_terms');

class POST extends DAO {
  constructor(...arg) {
    super(...arg);
  }
  async list(_, fields = {}) {
    const { currentPage = 1, pageSize = 10, options = {} } = fields;
    Reflect.deleteProperty(fields, 'currentPage');
    Reflect.deleteProperty(fields, 'pageSize');
    Reflect.deleteProperty(fields, 'options');

    const list = await this.findAll({
      where: fields,
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      ...options,
    });
    return await Promise.all(
      list.map(async (item) => {
        return {
          ...item.get({ plain: true }),
          ...(await term.findTermOfPost(term, {id: item.ID})),
        };
      }),
    );
  }
}

module.exports = POST;
