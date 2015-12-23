'use strict';

var co = require('co');
var utils = require('../utils');


function* sendMovieInfo() {
  let content = yield utils.getMovie();
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

co(sendMovieInfo).catch(onerror);
setInterval(function(){
  co(sendMovieInfo).catch(onerror);
}, 5*60*1000);