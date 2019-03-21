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
  name: 'word',
  description: 'word',
  fields: {
    ID: {
      type: GraphQLID,
    },
    word: {
      type: GraphQLString,
    },
    user: {
      type: GraphQLString,
    },
    updateTime: {
      type: GraphQLFloat,
    },
    total: {
      type: GraphQLInt,
    }
  },
});
