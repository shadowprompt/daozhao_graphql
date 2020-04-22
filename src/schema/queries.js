const {
  GraphQLObjectType
} = require('graphql');
const postQueries = require('../model/daozhao/post/queries');
const termQueries = require('../model/daozhao/term/queries');
const termTaxonomyQueries = require('../model/daozhao/termTaxonomy/queries');
const wxUserQueries = require('../model/wx/user/queries');

module.exports = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    prevNext: postQueries.prevNext,
    post: postQueries.item,
    posts: postQueries.items,
    archives: postQueries.archives,
    termTaxonomies: termTaxonomyQueries.items,
    term: termQueries.item,
    wxUsers: wxUserQueries.users,
    wxSelectUser: wxUserQueries.select,
  }
});
