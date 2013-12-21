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
     * 并发phantom进程数
     */
    concurrentWorkers: 10,

    /**
     * 需要特别处理的url规则
     */
    specialUrl: {
        weixin : 'http://mm.dianping.com/weixin'
    }



};


module.exports = options;