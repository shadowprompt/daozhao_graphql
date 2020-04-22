const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const instance = require('../../../lib/seq/instance/wx_user');

// Defines the mutations
module.exports = {
  getUser: {
    type,
    args: {
      openId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      nickName: {
        type: GraphQLString,
      },
    },
    resolve: Index.findOrCreateUser.bind(Index),
  },
  updateUser: {
    type,
    args: {
      openId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      unionId: {
        type: GraphQLString,
      },
      nickName: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      avatarUrl: {
        type: GraphQLString,
      },
      gender: {
        type: GraphQLInt,
      },
      sessionKey: {
        type: GraphQLString,
      },
      formId: {
        type: GraphQLString,
      },
    },
    resolve: Index.updateUser.bind(Index),
  },
};
