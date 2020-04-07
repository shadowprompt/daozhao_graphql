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
