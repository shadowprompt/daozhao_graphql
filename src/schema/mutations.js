const {
  GraphQLObjectType
} = require('graphql')
const postMutation = require('../model/post/mutations');
const userMutation = require('../model/user/mutations');

module.exports = new GraphQLObjectType({
  name: 'RootMutationsType',
  fields: {
    addPost: postMutation.addPost,
    updatePost: postMutation.updatePost,
    getTag: postMutation.getTag,
    getUser: userMutation.getUser,
    updateUser: userMutation.updateUser,
  }
})