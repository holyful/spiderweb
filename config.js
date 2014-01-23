/**
 * 全局配置
 * @type object
 */
var options = {

    /**
     * 缓存路径
     */
    cacheDirectory: 'temp/',

    /**
     * 监听端口
     */
    port: 5541,

    /**
     * 监听地址
     */
    address: 'localhost',

    /**
     * 并发phantom进程数
     */
    concurrentWorkers: 10,

    /**
     * 是否启用并发
     */
    concurrent : true,

    /**
     * 需要特别处理的url规则，包括需要进行爬虫的url
     */
    specialUrl: {
       'http://mm.dianping.com/weixin/#detail~149306': ['test.js']
    },

    /**
     * seolink 处理
     */
    prettyAjaxKey:'?_escaped_fragment_=',
    prettyAjaxPattern: '#!'

};


module.exports = options;