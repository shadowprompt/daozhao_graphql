const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const DAO = require('../lib/seq/DAO');

const postModel = require('../lib/seq/instance/wp_posts');
const termModel = require('../lib/seq/instance/wp_terms');
const relationModel = require('../lib/seq/instance/wp_term_relationships');
const taxModel = require('../lib/seq/instance/wp_term_taxonomy');


// SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = 'category' AND term_taxonomy_id IN (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = 8707)

// relationModel.findAll({
//   offset: 0,
//   limit: 3
// }).then(res => {
//   res.forEach((post) => {
//     console.log(
//       ' post-> ',
//       post.get({
//         plain: true,
//       }),
//     );
//   });
// })
taxModel.model.belongsTo(relationModel.model, {
  foreignKey:'term_taxonomy_id'
});

// for(var key in taxModel.model) {
//   console.log('taxModel -> ', key);
// }
//
// for(var key in relationModel.model) {
//   console.log('relationModel -> ', key);
// }

// taxModel.findAll({
//   where: {
//     taxonomy: 'category',
//     term_taxonomy_id: {
//       [Op.in]: Sequelize.literal('(SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = 8707 )'),
//       // [Op.in]: 'SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = 8707'
//     }
//   },
//   offset: 0,
//   limit: 3,
//   attributes: ['term_id'],
// }).then((taxs) =>  {
//   taxs.forEach((post) => {
//     console.log(
//       ' post-> ',
//       post.get({
//         plain: true,
//       }),
//     );
//   });
// });

termModel.findAll({
  where: {
    term_id: {
      [Op.in]: Sequelize.literal('( SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = \'category\' and term_taxonomy_id in (SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = 8707 ))'),

      // [Op.in]: Sequelize.literal('( SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = \'category\' )'),
      // [Op.and]: {
      //   term_taxonomy_id: {
      //     [Op.in]: Sequelize.literal('(SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id = 8707 )'),
      //   }
      // }
    }
  }
}).then(items => {
  items.forEach(item => console.log('item ', item.get({
    plain: true
  })))
})

// postModel.findByFields({
//   fields: {
//     // post_title: 'QQ餐厅偷匪隔三差五的出毛病'
//   },
//   page: {
//     currentPage: 1,
//     pageSize: 2,
//   },
// }, {
//   // attributes: ['post_title']
// }).then((posts) => {
//   posts.forEach((post) => {
//     console.log(
//       ' post-> ',
//       post.get({
//         plain: true,
//       }),
//     );
//   });
// });

// const Model = Sequelize.Model;
//
// const sequelize = require('../lib/seq/index');
//
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });
//
// class User extends Model {}
// User.init(
//   {
//     firstName: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     lastName: {
//       type: Sequelize.STRING,
//     },
//   },
//   {
//     underscored: true,
//     sequelize,
//     modelName: 'user',
//   },
// );
// class Task extends Model {}
// Task.init({
//   title: Sequelize.STRING
// }, {
//   underscored: true,
//   sequelize,
//   modelName: 'task'
// });
// User.hasMany(Task);
// sequelize.sync().then(() => {
//   createData();
// });
//
// async function createData(){
//   const [user] =  await User.findOrCreate({
//     where: { firstName: 'John9' },
//     attributes: ['id', 'firstName'],
//   });
//
//   const task = await Task.create({
//     title: 't1' + Date.now(),
//     user_id: 1,
//   });
//
//   user.addTask(task);
// }
//
// // User.findAll({
// //   include: [{
// //     model: Task,
// //   }]
// // }).then((users) => {
// //   console.log('All users:', JSON.stringify(users, null, 4));
// // });
// //
// // User.findOrCreate({
// //   where: { firstName: 'John2' },
// //   attributes: ['id', 'firstName'],
// //   include: [{
// //     model: Task,
// //   }]
// // }).then((users) => {
// //   console.log('findOne users:', JSON.stringify(users, null, 4));
// // });
// //
// // User.findOrCreate({
// //   where: { firstName: 'test' },
// //   defaults: { lastName: 'Prompt' },
// // }).then(([user, created]) => {
// //   console.log(
// //     user.get({
// //       plain: true,
// //     }),
// //   );
// //   console.log('created:', JSON.stringify(created, null, 4));
// // });
//
// // User.findAndCountAll({
// //   // order: [['firstName', 'DESC']],
// //   // offset: 0,
// //   // limit: 10,
// //   include: [{
// //     model: Pub,
// //     where: {
// //       firstName: {
// //         [Op.like]: '%o%',
// //       },
// //     },
// //   }]
// // }).then((result) => {
// //   console.log('result.rows', result.rows);
// // });
//
// // class Pub extends Model {}
// // Pub.init(
// //   {
// //     firstName: { type: Sequelize.STRING },
// //     lastName: { type: Sequelize.STRING },
// //     address: { type: Sequelize.STRING },
// //     latitude: {
// //       type: Sequelize.INTEGER,
// //       allowNull: true,
// //       defaultValue: null,
// //       validate: { min: -90, max: 90 },
// //     },
// //     longitude: {
// //       type: Sequelize.INTEGER,
// //       allowNull: true,
// //       defaultValue: null,
// //       validate: { min: -180, max: 180 },
// //     },
// //   },
// //   {
// //     hooks: {
// //       beforeValidate: (pub, options) => {
// //         console.log('beforeCreate -> ', pub);
// //       },
// //       afterValidate: (pub, options) => {
// //         console.log('afterValidate -> ', pub);
// //         pub.longitude = 54;
// //       },
// //     },
// //     validate: {
// //       bothCoordsOrNone() {
// //         if ((this.latitude === null) !== (this.longitude === null)) {
// //           throw new Error(
// //             'Require either both latitude and longitude or neither',
// //           );
// //         }
// //       },
// //     },
// //     sequelize,
// //   },
// // );
// // // Pub.belongsTo(User);
// // // User.hasMany(Pub);
// // // Pub.create({
// // //   firstName: '瞎斗',
// // //   lastName: 'Prompt',
// // //   longitude: 155,
// // //   latitude: 23,
// // // }).then(() => {
// // //   Pub.findAll({}, {}).then((pubs) => {
// // //     console.log('All pubs:', JSON.stringify(pubs, null, 4));
// // //   });
// // // });
// //
// // Pub.findAll({
// //   where: {
// //     firstName: 'test',
// //   },
// // }).then((pubs) => {
// //   console.log('pubs.length -> ', pubs.length);
// //   return Pub.destroy({
// //     where: {
// //       longitude: 754
// //     }
// //   }).then(() => {
// //     Pub.findAll({
// //       where: {
// //         firstName: 'dad',
// //       },
// //     }).then((pubs) => {
// //       console.log('2 - pubs.length -> ', pubs.length);
// //     })
// //   })
//   // pubs
//   //   .forEach((pub) =>
//   //     pub.update({
//   //       firstName: 'dad',
//   //     }, {
//   //       fields: ['lastName']
//   //     }).then((pub) => console.log('updated', pub))
//   //   )
//
// // });
// //
// // User.beforeBulkCreate((users, options) => {
// //   for (const user of users) {
// //     if (user.lastName) {
// //       user.firstName = user.firstName + new Date();
// //     }
// //   }
// //
// //   // Add memberSince to updateOnDuplicate otherwise the memberSince date wont be
// //   // saved to the database
// //   options.updateOnDuplicate.push('memberSince');
// // });
//
// // Pub.findByPk(10).then(pub => {
// //   console.log('findByPk', pub.get({
// //     plain: true
// //   }));
// //   return pub.increment({
// //     'latitude': 50,
// //     longitude: 98
// //   })
// // }).then(() => console.log('成功'))
