/**
 缓存进程
**/

var fs = require('fs'),
    configs = require(__dirname + '/../config.js'),
    http = require('http'),
    crypto = require('crypto'),
    cheerio = require('cheerio'),
    cacheHash = null,
    date = function(){
        return (new Date());
    },
    cluster = require('cluster'),
    specialUrls = configs.specialUrl,
    fs = require('fs');

if (cluster.isMaster) {
    //创建集群
    for(su in specialUrls){
        cluster.fork({targetUrl : su});
        console.info('['+date().getTime()+'] worker dispatched for url '+su);
    }

    cluster.on('exit', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' died.');
    });

    cluster.on('online', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' is now running.');
    });

} else {

    var targetUrl = process.env.targetUrl ? process.env.targetUrl : null,
        httpRequestOptions = null,
        fullData = '',
        fileHash = crypto.createHash('md5').update(targetUrl+"").digest('hex'),
        filePath = __dirname + '/../' + configs.cacheDirectory  + fileHash + '.html';


    var urlCheckingLoop = function(targetUrl){
        if(targetUrl){
            httpRequestOptions = {
                hostname: configs.address,
                port: configs.port,
                path: '/',
                headers: {
                    'spider-host' : targetUrl
                }
            }
        }
        http.get(httpRequestOptions, function(res){
            switch(res.statusCode){
                case 200:
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.info('['+date().getTime()+'] data read ...');
                        fullData += chunk;
                    });
                    res.on('end', function(){
                        console.info('['+date().getTime()+'] finish reading url '+ targetUrl + ', cache generated ' );

                        console.info('['+date().getTime()+'] analysing cache content' );

                        var $ = cheerio.load(fullData), actives = $('a');

                        console.info('['+date().getTime()+'] found '+ actives.length + ' links' );


                        actives.each(function(){

                            var link = $(this).attr('href');
                            if(link === '#' || typeof link !== 'string'){
                                return;
                            }

                            if(link.match(/^http/)){
                                link = link;
                                console.info('['+date().getTime()+'] dispatcher worker for ' + link);
                                urlCheckingLoop(link);

                            }else if(link.match(/^\//)){
                                link = targetUrl + link;
                                console.info('['+date().getTime()+'] dispatcher worker for ' + link);
                                urlCheckingLoop(link);
                            }else if(link.match(/^#/)){
                                if(targetUrl.split('#').length){
                                    link = targetUrl.split('#')[0] + link;
                                }else{
                                    link = targetUrl + link;
                                }

                                console.info('['+date().getTime()+'] dispatcher worker for ' + link);
                                urlCheckingLoop(link);
                            }



                        });

                    });

                case 404:
                    //process.exit(-1);
                    return;
            }
        }).on('error', function(e){
            console.error('['+date().getTime()+'] '+ e.message);
            return;
        });
    }

    urlCheckingLoop(targetUrl);



}







