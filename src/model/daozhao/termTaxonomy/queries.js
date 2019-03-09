const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} = require('graphql')
const type = require('./type')
const Index = require("./index")

// Defines the queries
module.exports = {
  items: {
    type: new GraphQLList(type),
    args: {
      taxonomy: {
        type: GraphQLString
      },
      parent: {
        type: GraphQLInt
      },
    },
    resolve: Index.list.bind(Index)
  },
}