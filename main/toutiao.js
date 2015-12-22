'use strict';

var co = require('co');
var utils = require('../utils');


function* sendTouTiao() {
  let content = yield utils.getTouTiao();
  if (content) {
    yield utils.sendMessage(content);
    console.log('send ok');
  }
}

function onerror(err) {
  let content = {
    text: 'error',
    desp: err.message
  };
  co(function* (){
    yield utils.sendMessage(content)
  });
  console.error(err);
}

setInterval(function(){
  console.log('enter')
  co(sendTouTiao).catch(onerror);
}, 1000);