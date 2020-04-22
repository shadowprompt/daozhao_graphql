let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
// Defines the type
module.exports = new GraphQLObjectType({
  name: 'WXUser',
  description: 'userinfo',
  fields: {
    ID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    unionId: {
      type: GraphQLString,
    },
    openId: {
      type: new GraphQLNonNull(GraphQLString),
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
    registerTime: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    updateTime: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
