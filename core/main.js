/**
 * 创建一个对nginx的门面，适用http服务
 */
var http = require('http'),
    url = require('url'),
    queryString = require('querystring'),
    configs = require(__dirname + '/../config.js'),
    childProcess = require('child_process'),
    fork = childProcess.fork,
    spawn = childProcess.spawn,
    exec = childProcess.exec,
    crypto = require('crypto'),
    fs = require('fs'),
    spawnCount = 0,
    requestQueue = [],
    date = null,
    cluster = require('cluster'),
    Memcached = require('memcached'),
    numWks = configs.concurrentWorkers,
    date = function(){
        return (new Date());
    },
    //创建memcached实例
    memcached = new Memcached(configs.memcached.location,configs.memcached.options);

if (cluster.isMaster && configs.concurrent) {
    //创建集群
    for (var i = 0; i < numWks; i++) {
        cluster.fork();
    }
    console.info('['+date().getTime()+'] '+numWks+' worker(s) dispatched');
    cluster.on('exit', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' died.');
    });

    cluster.on('online', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' is now serving.');
    });

} else {

    var server = http.createServer().listen(configs.port, configs.address);
    server.on('error',function(e){
        console.error('['+date().getTime()+']' + e.message);
    });
    server.on('request',function(req, res){

        req.setEncoding('utf8');
        var targetQuery = url.parse(req.url).query ? url.parse(req.url).query : null,
            targetUrl = null, resData = null;
        if(targetQuery){
            targetUrl = queryString.parse(targetQuery).targetUrl;
        }else{
            targetUrl = req.headers['spider-host'];
        }
        var resData = '', crawl = null;

        console.info('['+date().getTime()+'] Worker '+ process.pid + ' start to handle request');
        if(targetUrl){
            try{
                console.info('['+date().getTime()+'] -----------------------------------------');
                console.info('['+date().getTime()+'] Target url '+ targetUrl);
                //pretty ajax url
                console.info('['+date().getTime()+'] Interpret pretty ajax url');

                if(configs.prettyAjaxKey && configs.prettyAjaxPattern){
                    targetUrl = targetUrl.replace(configs.prettyAjaxKey, configs.prettyAjaxPattern);
                }
                console.info('['+date().getTime()+'] Refined target url '+ targetUrl);
                console.info('['+date().getTime()+'] Process started at ' + date().getTime());
                var fileHash = crypto.createHash('md5').update(targetUrl+"").digest('hex'),
                    filePath = __dirname + '/../' + configs.cacheDirectory  + fileHash + '.html';

                memcached.get(targetUrl,function (err, data) {
                    //判断cache是否存在
                    if(err){
                        console.error('['+date().getTime()+'] Cache server error');
                    }else{
                        if(data){
                            console.info('['+date().getTime()+'] Cache found, start reading');
                            res.setHeader('Transfer-Encoding', 'chunked');
                            res.writeHead(200, {'Content-Type': 'text/html'});

                            console.info('['+date().getTime()+'] data completed.');
                            res.write(data);
                            res.end();

                        }else{

                            console.info('['+date().getTime()+'] Cache empty, start calling crawler');
                            try{
                                crawl = spawn('phantomjs',[__dirname + '/../spider/app.js',targetUrl]);
                            }catch(e){
                                console.error('['+date().getTime()+'] ' + e.message);
                            }

                            var finalData = '';
                            console.info('['+date().getTime()+'] Processing ...');
                            res.setHeader('Transfer-Encoding', 'chunked');
                            res.writeHead(200, {'Content-Type': 'text/html'});

                            crawl.stdout.setEncoding('utf8');
                            crawl.stdout.on('data', function(data) {
                                console.info('['+date().getTime()+'] transmitting data ...' );
                                finalData += data;
                                res.write(data);
                            });
                            crawl.stderr.on('data', function(data) {
                                console.error('['+date().getTime()+'] ' + data);
                            });
                            crawl.on('close',function(){
                                console.info('['+date().getTime()+'] data completed, crawler stopped' );
                                memcached.set(targetUrl,finalData,configs.memcached.lifeTime,function(err){

                                    if(err){
                                        console.error('['+date().getTime()+'] Cache store error');
                                    }else{
                                        console.info('['+date().getTime()+'] Cache store succeed');
                                    }
                                    memcached.end();
                                    res.end();
                                });


                            });



                        }


                    }



                });




            }catch(e){
                console.error('['+date().getTime()+'] ' + e.message);
                res.writeHead(404);
                res.end('');
            }
        }else{
            res.writeHead(404);
            res.end('');
        }
    });

}

