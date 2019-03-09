const DAO = require('../../../lib/DAO')
const mysql = require('../../../lib/dbWrapper')

class Index extends DAO {

  /**
   * Overrides TABLE_NAME with this class' backing table at MySQL
   */
  static get TABLE_NAME() {
    return 'wp_term_taxonomy'
  }

  /**
   * Returns a post by its ID
   */
  static async getByID(_, {
    id
  }) {
    return await this.find(id)
  }

  /**
   * Returns a list of posts matching the passed fields(page)
   * @param {*} fields - Fields to be matched
   */
  static async list(_, fields) {
    // Find current page posts
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

    const getNestCategories = (arr)  => {
      const sortedArr = JSON.parse(JSON.stringify(arr)).sort((a, b) => a.term_id > b.term_id);
      return sortedArr.filter(item => !item.parent).map(item => ({
        ...item,
        children: sortedArr.filter(sub => sub.parent === item.term_id)
      }))
    };

    const res = await mysql.createQuery({
      query: `SELECT * FROM wp_term_taxonomy, wp_terms WHERE wp_term_taxonomy.term_id = wp_terms.term_id AND wp_term_taxonomy.taxonomy = 'category'`,
      // query: baseQuery,
      params: [0]
    });
    return getNestCategories(res);
  }

  static async getTermOfPost(_, {
    id
  }) {
    const queryFactory = (taxonomy) => `SELECT * from wp_terms WHERE term_id in (SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = '${taxonomy}' AND term_taxonomy_id IN (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ?))`;
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