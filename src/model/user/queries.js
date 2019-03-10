const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const Index = require('./index');

// Defines the queries
module.exports = {
  users: {
    type: new GraphQLList(type),
    args: {
      nickName: {
        type: GraphQLString,
      },
      unionId: {
        type: GraphQLString,
      },
      openId: {
        type: GraphQLString,
      },
      sessionKey: {
        type: GraphQLString,
      },
      formId: {
        type: GraphQLString,
      },
    },
    resolve: Index.list.bind(Index),
  },
  select: {
    type: new GraphQLList(type),
    args: {
      nickName: {
        type: GraphQLString,
      },
      unionId: {
        type: GraphQLString,
      },
      openId: {
        type: GraphQLString,
      },
      sessionKey: {
        type: GraphQLString,
      },
      formId: {
        type: GraphQLString,
      },
    },
    resolve: Index.findMatching.bind(Index),
  },
};
