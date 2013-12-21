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
    address: '127.0.0.1',

    /**
     * 并发phantom进程数
     */
    concurrentWorkers: 10,

    /**
     * 需要特别处理的url规则
     */
    specialUrl: {
       'http://mm.dianping.com/weixin': ['test.js']
    }



};


module.exports = options;