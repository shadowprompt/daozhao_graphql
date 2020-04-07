let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const termFields = require('./fields');
const termTaxonomyFields = require('../termTaxonomy/fields');
// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Term',
  description: 'A term',
  fields: {
    ...termFields,
    ...termTaxonomyFields,
  },
});
