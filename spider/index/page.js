var Util = require("./base/util");

var _HOOK = require(".base/hook")

Page.extend = function(s,ext){
	for ( var i in ext ) {
		s[i] = ext[i];
	}
}


function Page(options){
	
	Util.mix(this,options);
	
	


}


Page.prototype.init = function(){
	
}	











module.exports = Page;