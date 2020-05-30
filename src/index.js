const path = require('path');
const envPath = path.join(
  __dirname,
  process.env.NODE_ENV === 'development' ? '../.env.dev' : '../.env.prod',
);
require('env2')(envPath);
const express = require('express');
const bodyParser = require('body-parser');
const Routes = require('./routes');
const http = require('http');
const fs = require('fs');
const spdy = require('spdy');
const socket = require('socket.io-client');
const ws = require('ws');
const axios = require('axios');

class App {
  constructor() {
    this.expressApp = express();
    this.server = http.Server(this.expressApp);

    //Literal object containing the configurations
    this.configs = {
      get port() {
        return process.env.PORT || 5050;
      },
    };
    this.sslConfigs = {
      key: fs.readFileSync(__dirname + '/ssl/server.key'),
      cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
    };
  }

  applyMiddleware() {
    //Allows the server to parse json
    this.expressApp.use(
      bodyParser.json({
        limit : '2100000kb',
        extends: false,
      }),
    );

    this.setCORS();
    //Registers the routes used by the app
    new Routes(this.expressApp);
  }

  setStatic(){
    // this.expressApp.use('/static', express.static('./src/static')); // 跟执行node的路径有关
    this.expressApp.use(
      '/static',
      express.static(path.resolve(__dirname, './static')),
    );
    this.expressApp.use(
      '/.well-known',
      express.static(path.resolve(__dirname, './static/well-known')),
    );
    this.expressApp.use(express.static(path.resolve(__dirname, './static')));
  }

  run() {
    this.expressListen();
    this.setWebsocket();
    this.setSchedule();
    // this.setWS();
    this.setStatic();
  }
  spdyListen() {
    spdy
      .createServer(this.sslConfigs, this.expressApp)
      .listen(this.configs.port, (error) => {
        if (error) {
          console.error(error);
          return process.exit(1);
        } else {
          console.log('Listening on port: ' + this.configs.port + '.');
        }
      });
  }

  expressListen() {
    this.server.listen(this.configs.port, () => {
      console.log(
        'Express server running project on port ' + this.configs.port + '.',
      );
      console.log(`Environment: ${process.env.STAGE || 'development'}`);
    });
  }
  setWS() {
    this.wss = new ws.Server({
      server: this.server,
    });
    this.wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send(`${message} ${Math.random()}`);
      });
      ws.send('Connected');
    });
    this.wss.on('error', (err) => console.log(err));
  }

  setWebsocket() {
    this.io = socket(this.server);
    this.io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', function() {
        console.log('user disconnected');
      });
      socket.on('message', (msg) => {
        console.log('server received: ' + msg);
        socket.broadcast.emit('message', 'message to other subscriber');
      });
      socket.on('all', (msg) => {
        this.io.emit('message', 'all');
      });
    });
    this.io.on('error', (err) => console.log('err', err));
  }
  setCORS() {
    this.expressApp.use('*', (req, res, next) => {
      const getIp = () => {
        return req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
      };
      let ip = '';
      try {
        ip = getIp();
      } catch (e) {
        ip = 'ipError';
      }
      console.log(' req.headers.guest-> ', req.headers.guest);
      // if (/\.daozhao\.(com\.cn|com)$/.test(req.headers.origin) || req.headers.guest === 'Shadow') {
        console.log('+++', req.method, req.originalUrl, req.ip, ip, '+++');
        console.log(
          req.method.toLowerCase() === 'post' ? req.body : req.params,
        );
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header(
          'Access-Control-Allow-Methods',
          'PUT, GET, POST, DELETE, OPTIONS',
        );
        res.header('Access-Control-Allow-Headers', '*');

      // }
      next();
    });
  }
  setSchedule() {
    axios.post('http://127.0.0.1:5050/schedule');
  }
}

const app = new App();
app.applyMiddleware();
app.run();
