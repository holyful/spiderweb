/**
 缓存进程
**/

var fs = require('fs'),
    configs = require(__dirname + '/../config.js'),
    http = require('http'),
    crypto = require('crypto'),
    cacheHash = null,
    date = function(){
        return (new Date());
    },
    cluster = require('cluster'),
    specialUrls = configs.specialUrl;

if (cluster.isMaster) {
    //创建集群
    for(su in specialUrls){
        cluster.fork({args : [su]});
        console.info('['+date().getTime()+'] worker dispatched for url '+su);
    }

    cluster.on('exit', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' died.');
    });

    cluster.on('online', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' is now running.');
    });

} else {

    var httpRequestOptions = {
        hostname: configs.address,
        port: configs.port,
        path: '/',
        headers: {
           // 'spider-host' : su
        }
    }
    console.log(process)
    /*http.get(httpRequestOptions, function(res){
        switch(res.statusCode){
            case 200:
                res.on('data', function (chunk) {
                    //console.log('BODY: ' + chunk);
                });

                res.on('end', function(){

                });

            case 404:
                return;
        }
    }).on('error', function(){
        console.error('['+date().getTime()+'] connection error');
        process.exit(-1);
    });*/
}







