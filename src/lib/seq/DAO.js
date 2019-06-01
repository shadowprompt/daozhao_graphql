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

  async find(_, {id}) {
    return await this.model.findByPk(id);
  }
  async list(_, fields) {
    return await this.model.findAll(fields);
  }
  findOne(options) {
    return this.model.findOne(options);
  }
  findAll(options) {
    return this.model.findAll(options);
  }
  findByFields({
    fields = {},
    page = { currentPage: 1, pageSize: 10 },
    order =[],
  } = {}, options = {}) {
    return this.findAll({
      where: fields,
      offset: (page.currentPage - 1) * page.pageSize,
      limit: page.pageSize,
      order,
      ...options
    });
  }

  findMatching(fields, options){
    if(Object.keys(fields).length ===0 ){
      return this.findAll(fields);
    }
    return this.findByFields({
      fields,
      ...options
    });
  }
}
module.exports = DAO;
