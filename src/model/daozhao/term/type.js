let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const termFields = {
  term_id: {
    type: new GraphQLNonNull(GraphQLID),
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  slug: {
    type: new GraphQLNonNull(GraphQLString),
  },
  term_group: {
    type: new GraphQLNonNull(GraphQLInt),
  },
};

const termTaxonomyFields = {
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

// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Term',
  description: 'A term',
  fields: {
    ...termFields,
    ...termTaxonomyFields,
  },
});
