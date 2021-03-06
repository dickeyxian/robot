'use strict';

const getContent = require('../tool/spider');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

module.exports = function* () {
  let badLandUrl = 'http://www.xiamp4.com/Html/GP22063.html';
  let lvjianUrl = 'http://www.xiamp4.com/Html/GP21765.html';
  let mainUrl = 'http://www.xiamp4.com/';
  let result = yield {
    badLand: getContent(badLandUrl, {encoding: null}),
    lvjian: getContent(lvjianUrl, {encoding: null}),
    main: getContent(mainUrl, {encoding: null})
  };
  let banLandHtml = result.badLand;
  let lvjianHtml = result.lvjian;
  let mainHtml = result.main;

  banLandHtml = iconv.decode(new Buffer(banLandHtml, 'binary'), 'gbk');
  lvjianHtml = iconv.decode(new Buffer(lvjianHtml, 'binary'), 'gbk');
  mainHtml = iconv.decode(new Buffer(mainHtml, 'binary'), 'gbk');

  let $badLand = cheerio.load(banLandHtml, {decodeEntities: false});
  let $lvjian = cheerio.load(lvjianHtml, {decodeEntities: false});
  let $ = cheerio.load(mainHtml, {decodeEntities: false});

  let badLandTime = $badLand('#main .view .info ul li').first().contents().filter(function() {
    return this.nodeType === 3;
  }).last().text();

  let lvjianTime = $lvjian('#main .view .info ul li').first().contents().filter(function() {
    return this.nodeType === 3;
  }).last().text();

  let mainMovie = [];
  $('#main .newbox .content .img-list.dis li b a').each(function(){
    mainMovie.push($(this).text());
  });

  let time = {};
  time.badLandTime = badLandTime;
  time.lvjianTime = lvjianTime;
  time.mainMovie = mainMovie;

  let file = path.resolve('./log/movie.json');
  let oldContent = fs.readFileSync(file, 'utf-8');
  if (!oldContent) {
    return fs.writeFileSync(file, JSON.stringify(time));
  }
  oldContent = JSON.parse(oldContent);
  let oldMovie = oldContent.mainMovie;
  let newMovie = _.difference(mainMovie, oldMovie);
  if (newMovie.length) {
    fs.writeFileSync(file, JSON.stringify(time));
    let desp = newMovie.map(function(movie) {
      return `- ${movie}`
    });
    return {
      text: '又有新的电影更新了',
      desp: desp
    }
  }
  if (oldContent.badLandTime !== badLandTime) {
    fs.writeFileSync(file, JSON.stringify(time));
    return {
      text: '荒原' + badLandTime,
      desp: 'xiamp4'
    }
  }
  if (oldContent.lvjianTime !== lvjianTime) {
    fs.writeFileSync(file, JSON.stringify(time));
    return {
      text: '绿箭侠' + lvjianTime,
      desp: 'xiamp4'
    }
  }
};
