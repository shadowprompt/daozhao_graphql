const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat
} = require('graphql')
const type = require('./type')
const Index = require("./index")

// Defines the queries
module.exports = {
  tagsByObjectId: {
    type: new GraphQLList(type),
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: Index.getByID.bind(Index)
  }
}