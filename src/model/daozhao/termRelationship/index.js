const DAO = require('../../../lib/DAO');
const mysql = require('../../../lib/dbWrapper');

class TermRelationship extends DAO {
  static get TABLE_NAME() {
    return 'wp_term_relationships';
  }

  static get PRIMARY_KEY() {
    return 'object_id';
  }

  static async getByID(_, { id }) {
    console.log('getByID', id);
    return await this.findByFields({
      fields: {
        object_id: id,
      },
    });
  }
}

module.exports = TermRelationship;
