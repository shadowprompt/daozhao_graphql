const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');
// const commonOptions = require('../commonOptions');
const type = require('./type');
const instance = require('../../../lib/seq/instance/wp_posts');

// Defines the queries
module.exports = {
  items: {
    type: new GraphQLList(type),
    args: {
      post_status: {
        type: GraphQLString,
      },
      post_type: {
        type: GraphQLString,
      },
      currentPage: {
        type: GraphQLInt,
      },
      pageSize: {
        type: GraphQLInt,
      },
      order: {
        type: new GraphQLList(GraphQLString),
      },
      slug: {
        type: GraphQLString,
      }
    },
    resolve: instance.list.bind(instance),
  },
  item: {
    type,
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: instance.find.bind(instance),
  },
};
