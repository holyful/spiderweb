var Page = require("./index/page");

var __CONFIG__ = require("./config");

var Util = require('./base/util');
var system =require('system');

var args = system.args;


var targetUrl = args[1];

var reg = __CONFIG__["filter"];

var page = new Page({url:targetUrl,filter:reg},__CONFIG__.debug);

page.on('success',function(page){

	console.log(page.content);

    phantom.exit(-1);

});

page.limitLoad(__CONFIG__.limit)

page.init();


