var later = require('later');
var config = require('../config');
var urllib = require('urllib');
var co = require('co');
var weibo = require('../utils/weibo');

var weChatUrl = config.wechat.url;

later.date.localTime();
console.log("Now:"+new Date());

console.log(later.hour.val(new Date()));
//var sched = later.parse.recur().on(15).hour();

var sched = later.parse.recur().every(5).minute();
//var sched = later.parse.recur().every(10).second();
//var sched = later.parse.recur().on('10:45:00').time();

var occurrences = later.schedule(sched).next(10);
console.log(occurrences)

var count = 1;
exports.sendWeChat = function (sched, action) {
  later.setInterval(function () {
    co(function* (){
      yield action();
    }).catch(function(err) {
      console.error(err);
    });
  }, sched);
};

function* sendMessage() {
  var content = yield weibo.getGitDaily();
  if (content) {
    var result = yield urllib.request(weChatUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "text": content.text,
        "desp": content.desp
      }
    });
    console.log(result.data.toString())
  }
}

exports.sendWeChat(sched, sendMessage);

//
//co(function* (){
//  //yield exports.sendSlack(sched, sendMessage);
//  yield sendMessage()
//}).catch(function(err) {
//  console.error(err);
//});


