const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const TermRelationship = require('./termRelationship');

// Defines the mutations
module.exports = {
  addTermRelationships: {
    type,
    args: {
      type: {
        type: new GraphQLNonNull(GraphQLString),
      },
      price: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
    },
    resolve: TermRelationships.createEntry.bind(TermRelationships),
  },
  updateTermRelationships: {
    type,
    args: {
      id: {
        type: GraphQLID,
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
      },
      price: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
    },
    resolve: TermRelationships.updateEntry.bind(TermRelationships),
  },
};
