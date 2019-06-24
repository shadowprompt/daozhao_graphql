const Sequelize = require('sequelize');
class Database {
  get MYSQL_DB_HOST() {
    return process.env.MYSQL_DB_HOST
  }
  get MYSQL_DB_PORT() {
    return process.env.MYSQL_DB_PORT || 3306
  }
  get MYSQL_DB_USER() {
    return process.env.MYSQL_DB_USER || 'root'
  }
  get MYSQL_DB_PASSWORD() {
    return process.env.MYSQL_DB_PASSWORD || '123456'
  }
  get MYSQL_DB_NAME() {
    return process.env.MYSQL_DB_NAME || 'daozhao'
  }

  constructor(){
    this.seq = new Sequelize(this.MYSQL_DB_NAME, this.MYSQL_DB_USER, this.MYSQL_DB_PASSWORD, {
      host: this.MYSQL_DB_HOST,
      port: this.MYSQL_DB_PORT,
      dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    });
  }
}
module.exports = new Database().seq;