const {
  GraphQLObjectType
} = require('graphql')
const postQueries = require('../model/post/queries')
const termRelationshipQueries = require('../model/termRelationship/queries')
const termTaxonomyQueries = require('../model/termTaxonomy/queries')
const userQueries = require('../model/user/queries')

module.exports = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    post: postQueries.item,
    posts: postQueries.items,
    tag: termRelationshipQueries.tagsByObjectId,
    categories: termTaxonomyQueries.items,
    users: userQueries.users,
    selectUser: userQueries.select,
  }
});