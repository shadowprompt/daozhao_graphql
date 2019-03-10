const DAO = require('../../lib/DAO');
const mysql = require('../../lib/dbWrapper');

class Index extends DAO {
  static get TABLE_NAME() {
    return 'test';
  }

  static get PRIMARY_KEY() {
    return 'openId';
  }

  static async getByID(_, { openId }) {
    return await this.find(openId);
  }

  static async findMatching(_, fields) {
    // Returns early with all posts if no criteria was passed
    if (Object.keys(fields).length === 0) return this.findAll();
    // Find matching posts
    return this.findByFields({
      fields,
    });
  }

  static async findOrCreateUser(_, fields) {
    const connection = await mysql.getConnectionFromPool();
    try {
      let result = await this.findMatching(_, fields);
      if (!result.length) {
        await this.insert(connection, {
          data: {
            ...fields,
            registerTime: Date.now(),
          },
        });
        result = await this.findMatching(_, fields);
      }
      return result[0] || {};
    } finally {
      // Releases the connection
      if (connection != null) connection.release();
    }
  }

  /**
   * Updates a post
   */
  static async updateUser(_, { openId, ...params }) {
    const connection = await mysql.getConnectionFromPool();
    try {
      await this.findOrCreateUser(_, {
        openId,
      });
      console.log('updateUser', JSON.stringify(params));
      await this.update(connection, {
        id: openId,
        data: {
          ...params,
          updateTime: Date.now(),
        },
      });

      return this.getByID(_, {
        openId,
      });
    } catch (e) {
      console.log('err', e);
    } finally {
      // Releases the connection
      if (connection != null) connection.release();
    }
  }
}

module.exports = Index;
