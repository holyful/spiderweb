var webserver = require('webserver');
var system = require('system');
var server = webserver.create();

var Page = require("./index/page");

var __CONFIG__ = require("./base/config");

var Util = require('./base/util');

var targetUrl = system.args[1] || '';

var page = new Page({url:targetUrl,filter:'test'});
page.on('success',function(result){
    var content = result.content;
    console.log(content);
});
page.init();
