const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

module.exports = {
  term_taxonomy_id: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  term_id: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  taxonomy: {
    type: new GraphQLNonNull(GraphQLString),
  },
  description: {
    type: GraphQLString,
  },
  parent: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  count: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  name: {
    type: GraphQLString,
  },
  slug: {
    type: GraphQLString,
  },
};
