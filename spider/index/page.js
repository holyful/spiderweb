



var Util = require("../base/util");


var _Cache = {};

Page.extend = function(s,ext){
	for ( var i in ext ) {
		s[i] = ext[i];
	}
}

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



function Page(options){
	
	Util.mix(this,_filter(options.url,options.filter));

}


Page.prototype.init = function(){
	
	var self =  this;

	var page = self.page = require('webpage').create();


	page.open(self.url,function(){

		self.regListener = self.filter.length || false;

		self.regListener ? self.injectHook() : self.fire("success");

	})

	//回调
	self._callback();


	//错误监听
	self.error();

}	



Page.prototype._callback = function(){
	var self = this;

	this.page.onCallback = function(data) {

		self.regListener--;

	 	!self.regListener && self.fire("success");

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

	    	Util.isFunction(item) && (item.call(self.page,self.page));
	   
	    }
	 }
}




module.exports = Page;
