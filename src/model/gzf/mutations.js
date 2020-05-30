const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
} = require('graphql');
const type = require('./type');
const queue = require('../../lib/seq/instance/gzf/queue');
const emove = require('../../lib/seq/instance/gzf/emove');
const project = require('../../lib/seq/instance/gzf/project');
const house = require('../../lib/seq/instance/gzf/house');
const period = require('../../lib/seq/instance/gzf/period');
const qualification = require('../../lib/seq/instance/gzf/qualification');

// Defines the queries
module.exports = {
  dbSync: {
    type,
    args: {
      jsonData: {
        type: GraphQLString,
      },
      jsonKeys: {
        type: GraphQLString,
      },
    },
    resolve: queue.sync.bind(queue, project, house, emove, period, qualification),
  },
  qualificationStore: {
    type,
    args: {
      jsonData: {
        type: GraphQLString,
      },
    },
    resolve: qualification.store.bind(qualification),
  },
  queue: {
    type,
    args: {
      jsonData: {
        type: GraphQLString,
      },
      jsonKeys: {
        type: GraphQLString,
      },
    },
    resolve: queue.queue.bind(queue, project, house, emove,  period, qualification),
  },
};
