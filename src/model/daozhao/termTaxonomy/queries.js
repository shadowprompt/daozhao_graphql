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
const Index = require('./index');

// Defines the queries
module.exports = {
  items: {
    type: new GraphQLList(type),
    args: {
      taxonomy: {
        type: GraphQLString,
      },
      parent: {
        type: GraphQLInt,
      },
    },
    resolve: Index.list.bind(Index),
  },
  getTermOfPost: {
    type: new GraphQLObjectType({
      name: 'termOfPost',
      fields: {
        categories: {
          type: new GraphQLList(termType),
        },
        tags: {
          type: new GraphQLList(termType),
        },
      },
    }),
    args: {
      id: {
        type: GraphQLInt,
      },
    },
    resolve: Index.getTermOfPost.bind(Index),
  },
};
