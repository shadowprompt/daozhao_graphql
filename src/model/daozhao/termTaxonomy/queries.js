const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const termType = require('../term/type');
const instance = require('../../../lib/seq/instance/wp_term_taxonomy');

// Defines the queries
module.exports = {
  items: {
    type: new GraphQLList(type),
    args: {
      term_taxonomy_id: {
        type: GraphQLInt,
      },
      term_id: {
        type: GraphQLInt,
      },
      taxonomy: {
        type: GraphQLString,
      },
      parent: {
        type: GraphQLInt,
      },
      currentPage: {
        type: GraphQLInt,
      },
      pageSize: {
        type: GraphQLInt,
      },
    },
    resolve: instance.list.bind(instance),
  },
};
