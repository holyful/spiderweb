var modMemcached = require("memcached");

var DEFALUT_OPTIONS = {

}
// debug函数 调试对象
function dbg(o){
	Object.prototype.toString.call(o).indexOf("object Object") !== -1 ? 
		console.log(JSON.stringify(o)): console.log(o);
}


// mix 函数
function _mix(first,second,m){
    for (key in second) {
          if (!m) { 
               if(first[key]){
                    continue;
               }
               first[key] = second[key];
          }else{
          	  	first[key] = second[key];
          }
     }
    return first;
}

function Memcached(location,option){
	
	var _option = this.opt = _mix(DEFALUT_OPTIONS,option);

	this.core = new modMemcached(location,_option);

	return this;
}

Memcached.prototype.error = function(obj){
	!key && dbg("method参数错误");
}

Memcached.prototype.add = function(obj){
	var _core = this.core;
	try{
		var item = obj.split("~");
		
		if(item[0] && item[1]){
			_core.add(item[0], item[1], 5000, function(err,res){
				if(res){
					dbg("储存"+item[0]+"~成功");
				}else{
					dbg("储存"+item[0]+"~失败,可能该值已经存在");
				}
			});
		}else{
			dbg("key参数错误");
		}
	}catch(e){
		dbg("key参数错误");
	}
}

Memcached.prototype.delete = function(key){
	var _core = this.core;

	_core.del(key, function(err,res){
		if(res){
			dbg("删除"+key+"~成功");
		}else{
			dbg("删除"+key+"~失败,可能该值已经被删除");
		}
	});
}


Memcached.prototype.get = function(key){
	var _core = this.core;

	_core.get(key, function(err,data){
		if(data){
			dbg("查找成功~"+key+"："+data);
		}else{
			dbg("没有查到"+key+"的值");
		}
	});
}

module.exports = Memcached;