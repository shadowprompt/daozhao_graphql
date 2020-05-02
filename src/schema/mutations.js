const { GraphQLObjectType } = require('graphql');
// const postMutation = require('../model/daozhao/post/mutations');
// const userMutation = require('../model/user/mutations');
// const dictMutation = require('../model/dict/mutations');
//
const gzfMutation = require('../model/gzf/mutations');

module.exports = new GraphQLObjectType({
  name: 'RootMutationsType',
  fields: {
    dbSync: gzfMutation.dbSync,
    queue: gzfMutation.queue,
  },
});
