const DAO = require('../../../lib/DAO');
const mysql = require('../../../lib/dbWrapper');

const TermTaxonomy = require('../termTaxonomy/index');

class Index extends DAO {

  static get TABLE_NAME() {
    return 'wp_posts';
  }

  static async getByID(_, { id }) {
    return await this.find(id);
  }

  static async list(_, fields) {
    this.handlePagination(fields);
    const lists = await this.findByFields({
      fields,
      page: {
        currentPage,
        pageSize,
      },
      order: {
        direction: 'desc',
        by: 'ID',
      },
    });
    return lists.map(async (item) => ({
      ...item,
      ...(await TermTaxonomy.getTermOfPost(TermTaxonomy, { id: item.ID })),
    }));
  }

  static async getTermTaxonomyName(_, { id }) {
    const queryFactory = (taxonomy) =>
      `SELECT * from wp_terms WHERE term_id in (SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = '${taxonomy}' AND term_taxonomy_id IN (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ?))`;
    const params = [id];
    const [categories, tags] = await Promise.all([
      mysql.createQuery({
        query: queryFactory('category'),
        params,
      }),
      mysql.createQuery({
        query: queryFactory('post_tag'),
        params,
      }),
    ]);
    return {
      categories,
      tags,
    };
  }

  /**
   *
   * @param _
   * @param fields
   * @returns {Promise<*>}
   */
  static async findMatching(_, fields) {
    // Returns early with all posts if no criteria was passed
    if (Object.keys(fields).length === 0) return this.findAll();

    // Find matching posts
    return this.findByFields({
      fields,
    });
  }
}

module.exports = Index;
