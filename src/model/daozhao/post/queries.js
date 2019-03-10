const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const Index = require('./index');

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
    },
    resolve: Index.list.bind(Index),
  },
  item: {
    type,
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: Index.getByID.bind(Index),
  },
};
