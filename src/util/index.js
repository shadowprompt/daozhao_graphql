const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ApolloClient = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const { onError } = require('apollo-link-error');
const { ApolloLink, from } = require('apollo-link');

const { LocalStorage } = require('node-localstorage');
const {
  WXMIN_APPID,
  WXMIN_APPSECRET,
  WXMIN_API_URL,
  SIGN_SECRET,
  APOLLO_TOKEN,
} = require('../config/index');

const isProduction = () => process.env.NODE_ENV === 'production';

const nodeStore = (scope) => new LocalStorage(path.resolve(__dirname, scope));

const requestPayload = (req, saveFilePath) =>
  new Promise((resolve, reject) => {
    let result = '';
    if (saveFilePath) {
      fs.open(saveFilePath, (openErr, fd) => {
        if (err) {
          console.warn('开始写入文件失败');
          reject(openErr);
        }
        req.on('data', (chunk) => {
          result += chunk;
          fs.write(fd, chunk, (writeErr) => {
            if (writeErr) {
              console.warn('写入文件失败');
              reject(writeErr);
            }
          });
        });
        req.on('end', () => {
          resolve(result);
          fs.close(fd);
        });
        req.on('error', (error) => {
          fs.close(fd);
          reject(error);
        });
      });
    } else {
      req.on('data', (chunk) => {
        result += chunk;
      });
      req.on('end', () => {
        resolve(result);
      });
      req.on('error', (error) => {
        reject(error);
      });
    }
  });

const timeoutPromise = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(`Timeout after ${ms} ms`);
    }, ms);
  });

const time2Str = (timeStamp) => {
  console.log(timeStamp);
  if (!timeStamp) return;
  const datedTimeStamp = new Date(timeStamp);
  const year = datedTimeStamp.getFullYear();
  const month = datedTimeStamp.getMonth() + 1;
  const day = datedTimeStamp.getDate();
  const hours = datedTimeStamp.getHours();
  const minutes = datedTimeStamp.getMinutes();
  const seconds = datedTimeStamp.getSeconds();
  return `${year}-${padStart(month, 2, '0')}-${padStart(
    day,
    2,
    '0',
  )} ${hours}:${minutes}:${seconds}`;
};

const padStart = (word, ...args) => String.prototype.padStart.apply(word, args);

/**
 * 检测缓存中的微信access_token是否失效，有效期在一分钟内也算失效
 */
const isWXAccessTokenValidated = () =>
  new Promise((resolve) => {
    const localStorage = nodeStore('../localStorage/wxmin');
    const oldAccessToken = localStorage.getItem('accessToken');
    let expires_in = 0;
    let access_token, newAccessToken;
    if (oldAccessToken) {
      accessTokenObj = JSON.parse(oldAccessToken);
      expires_in = accessTokenObj.expires_in;
      access_token = accessTokenObj.access_token;
    }
    if (expires_in && expires_in - Date.now() > 60000) {
      resolve({
        access_token,
        expires_in,
      });
    } else {
      resolve();
    }
  });

/**
 * 获取最小的微信access_token，如果缓存里面的失效则重新获取获取并返回
 */
/**
 *
 * @param {*} response response the error msg directionly when get access_token failed
 * @param {*} direct // get the access_token from weixin, never search the stored one
 */
const getWXAccessToken = (response, direct = false) =>
  new Promise(async (resolve, reject) => {
    const queryAccessToken = () => {
      console.log('直接请求access_token');
      axios
        .get(
          `${WXMIN_API_URL}/cgi-bin/token?grant_type=client_credential&appid=${WXMIN_APPID}&secret=${WXMIN_APPSECRET}`,
        )
        .then((result) => {
          const newAccessToken = {
            access_token: result.data.access_token,
            expires_in: Date.now() + result.data.expires_in * 1000,
          };
          const localStorage = nodeStore('../localStorage/wxmin');
          localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
          resolve(newAccessToken);
        })
        .catch((err) => {
          const msg = {
            errMsg: 'get access_token failed',
          };
          response && response.send(msg);
          reject(msg);
        });
    };
    const queryAccessTokenFromDaozhao = () => {
      axios
        .post('https://api.daozhao.net/wxmin/getAccessToken')
        .then(({ data }) => {
          console.log('get access_token from Daozhao success');
          resolve(data);
        })
        .catch((err) => {
          console.log('get access_token from Daozhao failed');
          const msg = {
            errMsg: 'get access_token from Daozhao failed',
          };
          response && response.send(msg);
          reject(msg);
        });
    };

    if (process.env.NODE_ENV === 'development') {
      queryAccessTokenFromDaozhao();
      return;
    }

    // 直接用direct=true，来请求最新的access_token
    if (direct) {
      queryAccessToken();
      return;
    }
    const oldAccessToken = await isWXAccessTokenValidated();
    if (oldAccessToken) {
      resolve(oldAccessToken);
    } else {
      queryAccessToken();
    }
  });

const decryptData = (encryptedData, iv, sessionKey, appid) => {
  // base64 decode
  const encryptedDataNew = Buffer.from(encryptedData, 'base64');
  const sessionKeyNew = Buffer.from(sessionKey, 'base64');
  const ivNew = Buffer.from(iv, 'base64');

  let decoded = '';
  try {
    // 解密，使用的算法是 aes-128-cbc
    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      sessionKeyNew,
      ivNew,
    );
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedDataNew, 'binary', 'utf8');
    console.log('decoded', decoded);
    decoded += decipher.final('utf8');
    console.log('decoded str', decoded);
    decoded = JSON.parse(decoded);
    // decoded 是解密后的用户信息
  } catch (err) {
    throw new Error('Buffer parse error');
  }

  // 解密后的用户数据中会有一个 watermark 属性，这个属性中包含这个小程序的 appid 和时间戳，下面是校验 appid
  if (decoded.watermark.appid !== appid) {
    throw new Error('Illegal Buffer');
  }

  // 返回解密后的用户数据
  return decoded;
};

// JWT签名
const JWTSign = (data, expiresIn = 600) =>
  jwt.sign(data, SIGN_SECRET, {
    expiresIn,
  });

// JWT解码
const JWTDecode = (token, strict = true) => {
  if (!strict) {
    return jwt.decode(token, {
      complete: true,
    });
  }

  return jwt.verify(token, SIGN_SECRET, (err, decoded) => {
    if (err) {
      return;
    } else {
      return decoded;
    }
  });
};

/**
 *
 * @param hyphen 需要指定表名的，否则会直接使用tableName参数
 * @param stringKeys 字符串查询的key
 * @param searchKeys 搜索关键字
 * @param dateKeys 日期
 * @returns {function(*=, *=): string}
 */
const generateSqlConditions = (
  hyphen = [],
  stringKeys = [],
  searchKeys = [],
  dateKeys = [],
) => (obj, tableName = '') => {
  const tableMap = hyphen.reduce((total, curr) => {
    const [key, tableName] = curr.split('.');
    return {
      ...total,
      [key]: tableName,
    };
  }, {});
  const dateMap = (table, dateKey) => {
    return {
      year: `YEAR(${table}.post_date)`,
      month: `MONTH(${table}.post_date)`,
      day: `DAY(${table}.post_date)`,
    }[dateKey];
  };
  return Object.keys(obj)
    .map((key) => {
      const table = tableMap[key] || tableName || '';
      const value = obj[key];
      if (stringKeys.includes(key)) {
        // 值为字符串
        return searchKeys.includes(key)
          ? `((${table}.post_title LIKE '%${value}%') OR (${table}.post_excerpt LIKE '%${value}%') OR (${table}.post_content LIKE '%${value}%'))`
          : `${table}.${key} = "${value}"`;
      } else if (dateKeys.includes(key)) {
        return `${dateMap(table, key)} = ${value}`;
      } else {
        return `${table}.${key} = ${value}`;
      }
    })
    .join(' AND ');
};

module.exports = {
  isProduction,
  nodeStore,
  requestPayload,
  timeoutPromise,
  time2Str,
  padStart,
  isWXAccessTokenValidated,
  getWXAccessToken,
  decryptData,
  JWTSign,
  JWTDecode,
  // apollo,
  generateSqlConditions,
};
