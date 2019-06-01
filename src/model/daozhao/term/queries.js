const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const instance = require('../../../lib/seq/instance/wp_terms');

// Defines the queries
module.exports = {
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
