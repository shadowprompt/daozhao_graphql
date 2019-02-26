let {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')
const Post = require('./index');
const termType = require('../term/type');
const termTaxonomy = require('../termTaxonomy/type');
// Defines the type
module.exports = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: {
    ID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    post_title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    post_content: {
      type: new GraphQLNonNull(GraphQLString)
    },
    post_type: {
      type: new GraphQLNonNull(GraphQLString)
    },
    post_status: {
      type: new GraphQLNonNull(GraphQLString)
    },
    post_parent: {
      type: new GraphQLNonNull(GraphQLID)
    },
    terms: {
      type: new GraphQLObjectType({
        name: 'Terms',
        fields: {
          categories: {
            type: new GraphQLList(termType),
          },
          tags: {
            type: new GraphQLList(termType),
          },
        }
      }),
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: Post.getTermTaxonomyName.bind(Post)
    }
  }
})