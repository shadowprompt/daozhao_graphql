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
  name: 'TermRelationship',
  description: 'A termRelationship',
  fields: {
    object_id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    term_taxonomy_id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    term_order: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});
