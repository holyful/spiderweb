// var webserver = require('webserver');

// var server = webserver.create();

var Page = require("./index/page");

var __CONFIG__ = require("./config");

var Util = require('./base/util');
var system =require('system');

// var service = server.listen(__CONFIG__.port, function(req, res) {
var args = system.args;


var targetUrl = args[1];

// var query = Util.parse(req.url);

var reg = __CONFIG__["filter"];

var page = new Page({url:targetUrl,filter:reg},__CONFIG__.debug);

page.on('success',function(page){

	console.log(page.content);

    phantom.exit(-1);

});

page.limitLoad(__CONFIG__.limit)

page.init();



// });


// console.log("server started");


// process.argv.forEach(function (val, index, array) {
//     if(index === 2){
//         targetUrl = val;
//     }
// });
// //-------
// process.send({data:data });
// process.exit();