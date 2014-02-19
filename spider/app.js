var Page = require("./index/page");

var __CONFIG__ = require("./config");

var Util = require('./base/util');
var system =require('system');

var args = system.args;


var targetUrl = args[1];

var reg = __CONFIG__["filter"];

// 一切为了微信
phantom.addCookie({
  'name'     : 'test',   /* required property */
  'value'    : '2332',  /* required property */
  'domain'   : 'mm.dianping.com',           /* required property */
  'path'     : '',
  'httponly' : true,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)
});

var page = new Page({url:targetUrl,filter:reg},__CONFIG__.debug);

page.on('success',function(page){

	console.log(page.content);

    phantom.exit(-1);

});

page.limitLoad(__CONFIG__.limit)

page.init();


