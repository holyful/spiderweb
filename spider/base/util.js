var fun ={};

fun.isString = function(str){
	return typeof str === "string" ? true : false;
}
fun.isArray = function(array){
	return Object.prototype.toString.call(array).indexOf("Array") !== -1 ? true : false;
}
fun.isObject = function(obj){
	return Object.prototype.toString.call(obj).indexOf("object Object") !== -1 ? true : false;
}
fun.isNumber = function(num){
	return typeof num === "number" ? true : false;
}
fun.isFunction = function(fn){
	return Object.prototype.toString.call(fn).indexOf("object Function") !== -1 ? true : false;
}


fun.trim = function(str){
	return str.replace(/(^\s*)|(\s*$)/g,"");
}
fun.indexOf = function(arr,val){
	var index = arr.length-1;
	for(;index+1;index--){
		if(arr[index] == val)
			return index
	}
	return -1;
}
fun.keyIndexOf = function(obj,val){
	for(key in obj){
		if(key == val)
			return true;
	}
	return false;
}
fun.valueIndexOf = function(obj,val,deep){
	if(!deep){
		for(key in obj){
			if(obj[key] == val)
				return true
		}
		return false;
	}
	if(deep === true){
		var flag = false;
		var _fun = function(obj,val){
			for(key in obj){
				if(obj[key] == val)
					return true				
				if(typeof obj[key] == "object")
					flag = arguments.callee(obj[key],val,true);
				if(flag == true)
					return true 
			}
			return false
		}
		return _fun(obj,val);
	}
}
fun.mix = function(first,second,m){
    if(fun.isObject(first) && fun.isObject(second)){   
	    for (key in second) {
	          if (!m) { //不像 for in operator, hasownproperty 不追踪prototype chain
	               if(first[key]){
	                    continue;
	               }
	               first[key] = second[key];
	          }else{
	          	  	first[key] = second[key];
	          }
	     }
	}
     
    return first;
}


fun.parse = function(query){
	if(query){
		var result = {};

		query = query.replace(/^\/\?/,"");

		var  params = query.split("&");
		

		
		
		var item ;		
		
		while(item = params.pop()){
			
			var seq = item.split("=");

			var key = seq[0],
				value = seq[1];

			!(key && value) ? false : 
				!result[key] ? result[key] = value : false;

		}


	}

	return result;
}

fun.bind = function(fn,bind){
    return function(){
        return fun.isFunction(fn)? fn.apply (bind, arguments):false;
    }
}


fun.dbg = function(obj){
	console.log(JSON.stringify(obj));
}

module.exports  = fun;