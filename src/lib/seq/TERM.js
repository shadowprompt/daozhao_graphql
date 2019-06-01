const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('./DAO');

class TERM extends DAO {
  constructor(...arg) {
    super(...arg);
  }
  // get the category and tags info via the id of the post
  async findTermOfPost(_, {id}) {
    const factory = async (taxonomy, id) => {
      const result = await this.model.findAll({
        where: {
          term_id: {
            [Op.in]: Sequelize.literal(
              `( SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = '${taxonomy}' AND term_taxonomy_id in 
              (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = ${id} ))`,
            ),
          },
        },
      });
      return result.map((item) => item.get({ plain: true }));
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
