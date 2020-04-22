const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const Index = require('./index');
const instance = require('../../../lib/seq/instance/wp_term_relationships');


// Defines the queries
module.exports = {
  tagsByObjectId: {
    type: new GraphQLList(type),
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: instance.find.bind(instance),
  },
};
