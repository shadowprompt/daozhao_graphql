const websocket = require('./websocket');
const graphql = require('./graphql');
const push = require('./push');
const wxmin = require('./wxmin');
const schedule = require('./schedule');
const store = require('./store');
const user = require('./user');

const mainfest = require('./mainfest');
const serviceWorker = require('./serviceWorker');

module.exports = class Routes {

  /**
   * Applies the routes to specific paths
   * @param {*} app - The instance of express which will be serving requests.
   */
  constructor(app) {
    //Throws if no instance of express was passed
    if (app == null) throw new Error("You must provide an instance of express")

    app.use('/', websocket)
    app.use('/graphql', graphql);
    app.use('/push', push);
    app.use('/wxmin', wxmin);
    app.use('/schedule', schedule);
    app.use('/store', store);
    app.use('/user', user);

    app.use('/manifest', mainfest);
    app.use('/service-worker.js', serviceWorker);
  }

}