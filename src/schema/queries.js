const {
  GraphQLObjectType
} = require('graphql');
const postQueries = require('../model/daozhao/post/queries');
const termQueries = require('../model/daozhao/term/queries');
const termTaxonomyQueries = require('../model/daozhao/termTaxonomy/queries');
const userQueries = require('../model/user/queries');

module.exports = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    prevNext: postQueries.prevNext,
    post: postQueries.item,
    posts: postQueries.items,
    archives: postQueries.archives,
    termTaxonomies: termTaxonomyQueries.items,
    term: termQueries.item,
    // users: userQueries.users,
    // selectUser: userQueries.select,
  }
});
