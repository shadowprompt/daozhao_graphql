const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('./DAO');
const sequelize = require('./index');

class USER extends DAO {
  constructor(...arg) {
    super(...arg);
  }

  // findUserName(_, {id}) {
  //   this.model.findByPk(id);
  // }
}

module.exports = USER;
