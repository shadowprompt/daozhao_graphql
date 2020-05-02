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
  name: 'gzf',
  description: 'gzf',
  fields: {
    ID: {
      type: GraphQLID,
    },
    apiId: {
      type: GraphQLString,
    },
    propertyName: {
      type: GraphQLString,
    },
    typeName: {
      type: GraphQLString,
    },
    rent: {
      type: GraphQLString,
    },
    area: {
      type: GraphQLString,
    },
    emoveInDate: {
      type: GraphQLString,
    },
    queueCount: {
      type: GraphQLString,
    },
  },
});
