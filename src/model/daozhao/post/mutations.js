const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const Post = require('./index');
const TermRelationship = require('../termRelationship/index');
const TermRelationshipType = require('../termRelationship/type');

// Defines the mutations
module.exports = {
  getTag: {
    type: new GraphQLList(TermRelationshipType),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: TermRelationship.getByID.bind(TermRelationship),
  },
  addPost: {
    type,
    args: {
      type: {
        type: new GraphQLNonNull(GraphQLString),
      },
      price: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
    },
    resolve: Post.createEntry.bind(Post),
  },
  updatePost: {
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
    resolve: Post.updateEntry.bind(Post),
  },
};
