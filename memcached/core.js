var Memcached = require("./op");
var Http = require("http");
var Url = require('url');
var QueryString = require('querystring');

var __CONFIG__ = require(__dirname + '/../config.js');

// debug函数 调试对象
function dbg(o){
	Object.prototype.toString.call(o).indexOf("object Object") !== -1 ? 
		console.log(JSON.stringify(o)): console.log(o);
}

var server = Http.createServer(function(req,res){
	console.log("进入memcache的管理平台");

	//拿get参数
	var targetQuery = Url.parse(req.url).query ? Url.parse(req.url).query : null;
	
	//解析get参数
	var params = QueryString.parse(targetQuery);

	var memcached = new Memcached(__CONFIG__.memcached.location,__CONFIG__.memcached.options);

	try{
		memcached[(params && params.method) || "error"].apply(memcached,[params.key]);
	}catch(e){
		console.log("访问参数错误");
	}

}).listen(__CONFIG__.memcachedOp.port, __CONFIG__.memcachedOp.host);



console.log("memcached管理端口已启动。");
console.log(__CONFIG__.memcachedOp.host+":"+__CONFIG__.memcachedOp.port);