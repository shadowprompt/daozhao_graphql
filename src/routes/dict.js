const router = require('express').Router();
const axios = require('axios');
const util = require('../util/index');

const queryStr = require('../queryStr/user.gql');

router.post('/', async (req, res) => {
  const { word } = req.body;
  axios
    .post('http://127.0.0.1:5050/graphql', {
      query: `
        mutation($word: String!){
          data:addWord(word: $word){
            ID
            word
            user
            updateTime
          }
        }
      `,
      variables: {
        word,
      },
    }).then((result) => {
      res.send(result.data.data.data)
  }).catch(err => {
    res.send({
      success: false,
    });
    console.log('dict err -> ', err);
  })
});

module.exports = router;
