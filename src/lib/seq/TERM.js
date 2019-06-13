const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('./index');
const DAO = require('./DAO');

class TERM extends DAO {
  constructor(...arg) {
    super(...arg);
  }
  // get the category and tags info via the id of the post
  async findTermOfPost(_, { id }) {
    const factory = async (taxonomy, id) => {
      // const result = await this.model.findAll({
      //   where: {
      //     term_id: {
      //       [Op.in]: Sequelize.literal(
      //         `( SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = '${taxonomy}' AND term_taxonomy_id in
      //         (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ${id} ))`,
      //       ),
      //     },
      //   },
      // });
      // return result.map((item) => item.get({ plain: true }));

      return await sequelize
        .query(
          `SELECT * FROM wp_terms AS wp_terms, wp_term_taxonomy WHERE wp_term_taxonomy.term_id = wp_terms.term_id AND  wp_terms.term_id IN ( SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = '${taxonomy}' AND term_taxonomy_id in (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ${id}))`,
        )
        .then(([result = []]) => result);
    };

    const [categories, tags] = await Promise.all([
      factory('category', id),
      factory('post_tag', id),
    ]);
    return {
      categories,
      tags,
    };
  }
}

module.exports = TERM;
