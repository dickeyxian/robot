
'use strict';

const request = require('co-request');
const _ = require('lodash');

module.exports = function* (url, Cookie, options) {
  let headers = {
    'Accept': 'text/html, application/xhtml+xml, */*',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
    'Cookie': Cookie
  };

  if (!Cookie) {
    delete headers.Cookie;
  }

  let obj = {
    url: url,
    headers: headers
  };

  if (_.isObject(Cookie)) {
    options = _.assign(obj, Cookie);
  }

  let homePage = yield request(options);

  return homePage.body;
};