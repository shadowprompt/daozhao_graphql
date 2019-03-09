const DAO = require('../../../lib/DAO')
const mysql = require('../../../lib/dbWrapper')

class Index extends DAO {

  /**
   * Overrides TABLE_NAME with this class' backing table at MySQL
   */
  static get TABLE_NAME() {
    return 'wp_posts'
  }

  /**
   * Returns a post by its ID
   */
  static async getByID(_, {
    id
  }) {
    return await this.find(id)
  }

  static async getTermTaxonomyName(_, {
    id
  }) {
    console.log('getTermTaxonomyName ', id);
    const queryFactory = (taxonomy) => `SELECT * from wp_terms WHERE term_id in (SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = '${taxonomy}' AND term_taxonomy_id IN (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ?))`;
    // let baseQuery = `SELECT * from wp_terms WHERE term_id in (SELECT term_id FROM wp_term_taxonomy WHERE term_taxonomy_id in (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ?))`;
    // let baseQuery = `SELECT * FROM wp_term_taxonomy WHERE term_taxonomy_id in (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ?)`;
    const params = [id];
    const [categories, tags] = await Promise.all([mysql.createQuery({
      query: queryFactory('category'),
      params
    }), mysql.createQuery({
      query: queryFactory('post_tag'),
      params
    })]);
    return {
      categories,
      tags,
    };
  }
  /**
   * Returns a list of posts matching the passed fields
   * @param {*} fields - Fields to be matched
   */
  static async findMatching(_, fields) {
    // Returns early with all posts if no criteria was passed
    if (Object.keys(fields).length === 0) return this.findAll()

    // Find matching posts
    return this.findByFields({
      fields
    })
  }

  /**
   * Creates a new post
   */
  static async createEntry(_, {
    type,
    price
  }) {
    const connection = await mysql.getConnectionFromPool()
    try {
      let _result = await this.insert(connection, {
        data: {
          type,
          price
        }
      })

      return this.getByID(_, {
        id: _result.insertId
      })
    } finally {
      // Releases the connection
      if (connection != null) connection.release()
    }
  }

  /**
   * Updates a post 
   */
  static async updateEntry(_, {
    id,
    type,
    price
  }) {
    const connection = await mysql.getConnectionFromPool()
    try {
      await this.update(connection, {
        id,
        data: {
          type,
          price
        }
      })

      return this.getByID(_, {
        id
      })
    } finally {
      // Releases the connection
      if (connection != null) connection.release()
    }
  }
}

module.exports = Index