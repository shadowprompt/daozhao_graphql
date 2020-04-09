const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
} = require('graphql');
// const commonOptions = require('../commonOptions');
const type = require('./type');
const instance = require('../../../lib/seq/instance/wp_posts');

const termFields = require('../term/fields');
const dateFiles = {
  year: {
    type: new GraphQLNonNull(GraphQLString),
  },
  month: {
    type: new GraphQLNonNull(GraphQLString),
  },
  day: {
    type: new GraphQLNonNull(GraphQLString),
  },
};
const archiveType = new GraphQLObjectType({
  name: 'archiveType',
  fields: {
    year: {
      type: new GraphQLNonNull(GraphQLString),
    },
    month: {
      type: new GraphQLNonNull(GraphQLString),
    },
    posts: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

const conditionListObj = new GraphQLObjectType({
  name: 'PostsByCondition',
  fields: {
    condition: {
      type: new GraphQLObjectType({
        name: 'termObj',
        fields: termFields,
      }),
    },
    date: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
    },
    list: {
      type: new GraphQLList(type),
    }
  }
});

// Defines the queries
module.exports = {
  items: {
    // type: new GraphQLList(type),
    type: conditionListObj,
    args: {
      post_status: {
        type: GraphQLString,
      },
      post_type: {
        type: GraphQLString,
      },
      currentPage: {
        type: GraphQLInt,
      },
      pageSize: {
        type: GraphQLInt,
      },
      order: {
        type: new GraphQLList(GraphQLString),
      },
      slug: {
        type: GraphQLString,
      },
      keyword: {
        type: GraphQLString,
      },
      year: {
        type: GraphQLString,
      },
      month: {
        type: GraphQLString,
      },
      day: {
        type: GraphQLString,
      },
    },
    resolve: instance.list.bind(instance),
  },
  item: {
    type,
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: instance.find.bind(instance),
  },
  archives: {
    type: new GraphQLList(archiveType),
    resolve: instance.archiveList.bind(instance),
  }
};
