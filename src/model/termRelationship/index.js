const DAO = require('../../lib/DAO')
const mysql = require('../../lib/dbWrapper')

class TermRelationship extends DAO {

  /**
   * Overrides TABLE_NAME with this class' backing table at MySQL
   */
  static get TABLE_NAME() {
    return 'wp_term_relationships'
  }

  /**
   * Overrides PRIMARY_KEY with this class' backing table at MySQL
   */
  static get PRIMARY_KEY() {
    return "object_id"
  }

  /**
   * Returns a term_relationships by its ID
   */
  static async getByID(_, {
    id
  }) {
    console.log('getByID', id);
    return await this.findByFields({
      fields: {
        object_id: id
      }
    });
  }
}

module.exports = TermRelationship