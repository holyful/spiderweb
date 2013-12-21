



var Util = require("../base/util");


dbg = function(p){
	console.log(!Util.isObject(p) ? p : JSON.stringify(p));
}


var _Cache = {};

Page.extend = function(s,ext){
	for ( var i in ext ) {
		s[i] = ext[i];
	}
}


function Page(options){
	
	Util.mix(this,options);

}


Page.prototype.init = function(){
	
	var self =  this;

	var page = self.page = require('webpage').create();


	page.open(self.url,function(){
		self.injectHook();
	})

	//回调
	self._callback();


	//错误监听
	self.error();

}	



Page.prototype._callback = function(){
	var self = this;

	this.page.onCallback = function(data) {

	 	self.fire("success");

	};


}

Page.prototype.injectHook = function(){

	var self = this;

	return	self.filter ? self.page.injectJs('./index/hook/'+self.filter.replace(/(\.js)$/,"")+".js") : false;
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

	  console.error(msgStack.join('\n'));

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

	    	Util.isFunction(item) && (item.call(self.page));
	   
	    }
	 }
}




module.exports = Page;
