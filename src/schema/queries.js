const {
  GraphQLObjectType
} = require('graphql');
const postQueries = require('../model/daozhao/post/queries');
const termRelationshipQueries = require('../model/daozhao/termRelationship/queries');
const termTaxonomyQueries = require('../model/daozhao/termTaxonomy/queries');
const userQueries = require('../model/user/queries');

module.exports = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    post: postQueries.item,
    posts: postQueries.items,
    tag: termRelationshipQueries.tagsByObjectId,
    categories: termTaxonomyQueries.items,
    termOfPost: termTaxonomyQueries.getTermOfPost,
    users: userQueries.users,
    selectUser: userQueries.select,
  }
});