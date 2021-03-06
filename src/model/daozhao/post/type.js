let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const termType = require('../term/type');
const userType = require('../user/type');
// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: {
    ID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    post_title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    post_content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    post_type: {
      type: new GraphQLNonNull(GraphQLString),
    },
    post_status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    post_parent: {
      type: new GraphQLNonNull(GraphQLID),
    },
    post_name: {
      type: GraphQLString,
    },
    post_date: {
      type: GraphQLString,
    },
    categories: {
      type: new GraphQLList(termType),
    },
    tags: {
      type: new GraphQLList(termType),
    },
    user: {
      type: userType,
    },
    total: {
      type: GraphQLInt,
    }
  },
});
