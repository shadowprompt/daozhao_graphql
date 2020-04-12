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
  name: 'User',
  description: 'A User',
  fields: {
    ID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    user_login: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_pass: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_nicename: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_registered: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_activation_key: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user_status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    display_name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
