



var Util = require("../base/util");

//事件冒泡缓存
var _Cache = {};
var _Debug = false;


function _filter(url,reg){
	var result = false;

	if(url){
		for(key in reg){
			var ruler = new RegExp(key);
			if(ruler.test(url)){
				result = reg[key];
				break;
			}
		}
	}

	return {url:url,filter:result}
}


function dbg(str){
	_Debug ? console.log(str) : false;
}


function Page(options,debug){
	//初始化url匹配
	Util.mix(this,_filter(options.url,options.filter));

	_Debug = debug;

}


var STATUS = {
	
	BEFOREINIT:"beforeInit",

	AFTERBEFORE:"afterInit"
}


Page.prototype.init = function(){
	
	var self =  this;

	var page = self.page = require('webpage').create();

	//准备前
	self.fire(STATUS.BEFOREINIT);

	page.open(self.url,function(status){

		dbg("页面已打开，正在加入hook");

		self.regListener = self.filter.length || false;

		self.regListener ? self.injectHook() : self.fire("success");

	})

	//回调
	self._callback();

	//错误监听
	self.error();

	//触发初始化后事件
	self.fire(STATUS.AFTERBEFORE);

}	

Page.prototype._callback = function(){
	
	var self = this;

	this.page.onCallback = function(data) {

		self.regListener--;

	 	!self.regListener && (dbg("抓取结束!"),self.fire("success"));

	};

}

Page.prototype.injectHook = function(){

	var self = this;

	var item;

	while(item = self.filter.pop()){
		self.page.injectJs('./index/hook/'+item.replace(/(\.js)$/,"")+".js");
	}

}


Page.prototype.error = function(){

	this.page.onError = function(msg, trace) {

	  var msgStack = ['ERROR: ' + msg];

	  if (trace && trace.length) {
	    msgStack.push('TRACE:');
	    trace.forEach(function(t) {
	      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
	    });
	  }

	  dbg(msgStack.join('\n'));

	};

}


Page.prototype.on = function(type,fn){

	if(!_Cache[type]){
		_Cache[type] = [];
	}

	_Cache[type].push(fn);
	
	return this;
 }



Page.prototype.fire = function(type){
	
	var self = this;
	
	var params = _Cache[type] || [];

	if(params.length){

	    for(var index = 0;index < params.length ;index++){
	    	
	    	var item = params[index];

	    	Util.isFunction(item) && (item.call(self,self.page));
	   
	    }
	 }
}

var DefalutOpt = {
	limit:['css','img']
}


var UNLOAD = {
	CSS:/(\.css)$/,
	IMG:/\.(jpg|gif|bmp|bnp|png)$/
}


function noLoadLimitResourece(opt){
	var self  = this;

	dbg("开始下载资源");

	self.opt = Util.mix(DefalutOpt,opt);

	//禁止加载其他资源
	self.on(STATUS.BEFOREINIT,function(page){

		page.onResourceRequested = function(requestData, networkRequest) {
			
			var _limit = self.opt.limit || [];
			
			for(var index = 0;index <_limit.length ; index++){
				
				if(UNLOAD[_limit[index].toLocaleUpperCase()].test(requestData.url)){
					networkRequest.abort();
				}
			}

		};

		page.onResourceReceived = function(response) {
		     response.url ? dbg('正在加载' + response.url) : false;
		};

	
	});
}

Page.prototype.limitLoad = noLoadLimitResourece;


module.exports = Page;
