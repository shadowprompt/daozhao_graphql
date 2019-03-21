const DAO = require('../../lib/DAO');
const mysql = require('../../lib/dbWrapper');

class Index extends DAO {
  static get TABLE_NAME() {
    return 'dict';
  }

  static get PRIMARY_KEY() {
    return 'id';
  }

  static async getByID(_, { openId }) {
    return await this.find(openId);
  }

  static async findMatching(_, fields) {
    if (Object.keys(fields).length === 0) return this.findAll();
    return this.findByFields({
      fields,
      order: {
        by: 'ID',
        direction: 'desc',
      },
      count: true,
    });
  }

  static async findAndInsert(_, fields = {}) {
    console.log('fields -> ', fields);
    if(fields.word === undefined || fields.word.trim() === '') return;
    const connection = await mysql.getConnectionFromPool();
    const updateTime = Date.now();
    try {
      await this.insert(connection, {
        data: {
          ...fields,
          updateTime,
        },
      });
      const result = await this.findMatching(_, fields);
      console.log('result', result);
      // return {};
      return result[0] ? {
        ...result[0],
        count: 3,
      } : {};
    } finally {
      // Releases the connection
      if (connection != null) connection.release();
    }
  }
}

module.exports = Index;
