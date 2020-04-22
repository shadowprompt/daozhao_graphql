const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const instance = require('../../../lib/seq/instance/wx_user');

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
    resolve: instance.list.bind(instance),
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
    resolve: instance.findMatching.bind(instance),
  },
};
