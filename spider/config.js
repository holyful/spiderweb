var globalConfigs = require('../config.js');
module.exports = {

	port: 2000,

	filter:{
		//匹配列表页
		"^(http:\\/\\/)?mm.dianping.com\\/weixin((\\/\\?)|(\\/\\/)|(\\/)|(\\/\\?\\/))?#?$":["weixin/index"],
		//匹配详情页
		"^(http:\\/\\/)?mm.dianping.com\\/weixin((\\/\\?)|(\\/\\/)|(\\/)|(\\/\\?\\/))?#detail~\\d+$":["weixin/detail"],

		"^(http:\\/\\/)?m.dianping.com\\/waimai((\\/\\?)|(\\/\\/)|(\\/)|(\\/\\?\\/))?#?$":["waimai/index"]

	},

	debug: globalConfigs.debug || false

}


