const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('./index');

class DAO {
  constructor(args = {}, options = {}) {
    class subModel extends Model {}
    subModel.init(args, {
      ...options,
      sequelize,
    });
    this.model = subModel;
  }

  find(_, {id}) {
    return this.model.findByPk(id);
  }
  list(_, options) {
    return this.model.findAll(options);
  }
  findOne(_, options) {
    return this.model.findOne(options);
  }
  findAll(_, options) {
    return this.model.findAll(options);
  }
  findByFields(_, {
    fields = {},
    page = { currentPage: 1, pageSize: 10 },
    order =[],
  } = {}, options = {}) {
    return this.findAll(_, {
      where: fields,
      offset: (page.currentPage - 1) * page.pageSize,
      limit: page.pageSize,
      order,
      ...options
    });
  }

  findMatching(_, fields, options){
    if(Object.keys(fields).length ===0 ){
      return this.findAll(_, fields);
    }
    return this.findByFields(_, {
      fields,
      ...options
    });
  }

  static handlePagination(fields) {
    let currentPage = 1;
    let pageSize = 10;
    if (fields.currentPage !== undefined) {
      currentPage = fields.currentPage;
      Reflect.deleteProperty(fields, 'currentPage');
    }
    if (fields.pageSize !== undefined) {
      pageSize = fields.pageSize;
      Reflect.deleteProperty(fields, 'pageSize');
    }
    return fields;
  }

  static getNestCategories(arr) {
    const sortedArr = JSON.parse(JSON.stringify(arr)).sort(
        (a, b) => a.term_id > b.term_id,
    );
    return sortedArr
        .filter((item) => !item.parent)
        .map((item) => ({
          ...item,
          children: sortedArr.filter((sub) => sub.parent === item.term_id),
        }));
  }
}
module.exports = DAO;
