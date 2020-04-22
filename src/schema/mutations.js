const { GraphQLObjectType } = require('graphql');
// const postMutation = require('../model/daozhao/post/mutations');
// const userMutation = require('../model/user/mutations');
// const dictMutation = require('../model/dict/mutations');
//
module.exports = new GraphQLObjectType({
  name: 'RootMutationsType',
  fields: {
    // getTag: postMutation.getTag,
    // getUser: userMutation.getUser,
    // updateUser: userMutation.updateUser,
    // addWord: dictMutation.findAndInsert,
  },
});
