var webserver = require('webserver');

var server = webserver.create();

var Page = require("./index/page");

var __CONFIG__ = require("./config");

var Util = require('./base/util');


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


var service = server.listen(__CONFIG__.port, function(req, res) {


	var query = Util.parse(req.url);

	var reg = __CONFIG__["filter"];

	console.log("开始抓页面:"+query.url)

	var page = new Page({url:query.url,filter:reg},__CONFIG__.debug);

	page.limitLoad(__CONFIG__.limit)

	page.init();

	page.on('success',function(page){
		res.writeHead(200, {
	  		'Content-Type': 'text/html; charset=utf-8' 
		});

		res.write(page.content);

		console.log("成功抓取:"+query.url);

		clearTimeout(timer);

		res.close();

		phantom.exit(-1);

		
	});

	//抓取延时
	timer = setTimeout(function(){
		console.log("抓取失败！原因：超时。");
		
		res.writeHead(200, {
	  		'Content-Type': 'text/html; charset=utf-8' 
		});

		res.write("抓取失败。");
		
		res.close();		

		phantom.exit(-1);

	},30000)
	
});


console.log("server start:"+__CONFIG__.port)
