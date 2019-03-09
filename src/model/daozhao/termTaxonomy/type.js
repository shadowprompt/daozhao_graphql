let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const termTaxonomyTypeFields = {
  term_taxonomy_id: {
    type: new GraphQLNonNull(GraphQLInt)
  },
  term_id: {
    type: new GraphQLNonNull(GraphQLInt)
  },
  taxonomy: {
    type: new GraphQLNonNull(GraphQLString)
  },
  description: {
    type: GraphQLString
  },
  parent: {
    type: new GraphQLNonNull(GraphQLInt)
  },
  count: {
    type: new GraphQLNonNull(GraphQLInt)
  },
  name: {
    type: GraphQLString,
  },
  slug: {
    type: GraphQLString,
  },
  // categories: {
  //   type: new GraphQLObjectType({
  //
  //   })
  // }
};

// Defines the type
const termTaxonomyType = new GraphQLObjectType({
  name: 'TermTaxonomy',
  description: 'A termTaxonomy',
  fields: {
    ...termTaxonomyTypeFields,
    children: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'TermTaxonomy2',
        description: 'A termTaxonomy2',
        fields: {
          ...termTaxonomyTypeFields,
        }
      }))
    }
  }
});


module.exports = termTaxonomyType;