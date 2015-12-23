
'use strict';
const urllib = require('urllib');
const config = require('../config');
const toutiao = require('./lib/toutiao');
const weChatUrl = config.wechat.url;

exports.getTouTiao = toutiao.getTouTiao;

exports.getMovie = require('./lib/movie');

exports.sendMessage = function* (message) {
  return yield urllib.request(weChatUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "text": message.text,
      "desp": message.desp
    }
  });
};