/**
 * 创建一个对nginx的门面，适用http服务
 */
var http = require('http'),
    url = require('url'),
    queryString = require('querystring'),
    configs = require('../config.js'),
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
    numWks = configs.concurrentWorkers;
    date = function(){
        return (new Date());
    };

if (cluster.isMaster) {
    //创建集群
    for (var i = 0; i < numWks; i++) {
        cluster.fork();
    }
    console.info('['+date().getTime()+'] '+numWks+' worker(s) dispatched');
    cluster.on('exit', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' died.');
    });

    cluster.on('listening', function(worker, code, signal) {
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
        }
        var resData = '', crawl = null;

        console.info('['+date().getTime()+'] Worker '+ process.pid + ' start to handle request');
        if(targetUrl){
            try{
                console.info('['+date().getTime()+'] -----------------------------------------');
                console.info('['+date().getTime()+'] Target url '+ targetUrl);
                console.info('['+date().getTime()+'] Process started at ' + date().getTime());
                var fileHash = crypto.createHash('md5').update(targetUrl+"").digest('hex'),
                    filePath = configs.cacheDirectory  + fileHash + '.html';

                fs.exists(filePath, function(exists) {
                    if (exists) {
                        console.info('['+date().getTime()+'] Cache found, start reading');
                        var fStream = fs.createReadStream(filePath,{encoding: 'utf8'});

                        res.setHeader('Transfer-Encoding', 'chunked');
                        res.writeHead(200, {'Content-Type': 'text/html'});

                        fStream.on("data", function(data) {
                            console.info('['+date().getTime()+'] reading data ...');
                            res.write(data);
                        });
                        fStream.once("end", function() {
                            console.info('['+date().getTime()+'] data completed.');

                            res.end();
                        });

                    } else {
                        try{
                            crawl = spawn('phantomjs',['./spider/app.js',targetUrl]);
                        }catch(e){
                            console.error('['+date().getTime()+'] ' + e.message);
                        }
                        console.info('['+date().getTime()+'] Cache empty, starting calling crawl');
                        console.info('['+date().getTime()+'] Processing ...');
                        res.setHeader('Transfer-Encoding', 'chunked');
                        res.writeHead(200, {'Content-Type': 'text/html'});

                        var writeSteam = fs.createWriteStream(filePath,{encoding: 'utf8'})
                        crawl.stdout.setEncoding('utf8');
                        crawl.stdout.on('data', function(data) {
                            console.info('['+date().getTime()+'] transmitting data ...' );
                            writeSteam.write(data);
                            res.write(data);
                        });
                        crawl.stderr.on('data', function(data) {
                            console.error('['+date().getTime()+'] ' + data);
                        });
                        crawl.on('close',function(){

                            console.info('['+date().getTime()+'] data completed, crawler stopped' );
                            writeSteam.close();
                            res.end();

                        });
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

