let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Term',
  description: 'A term',
  fields: {
    term_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString)
    },
    term_group: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
});