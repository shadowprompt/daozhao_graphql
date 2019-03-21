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
const Index = require('./');

// Defines the mutations
module.exports = {
  findAndInsert: {
    type,
    args: {
      word: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: Index.findAndInsert.bind(Index),
  },
};
