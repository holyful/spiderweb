/**
 * 创建一个对nginx的门面，适用http服务
 */
var http = require('http'),
    url = require('url'),
    queryString = require('querystring'),
    configs = require('../config.js'),
    childProcess = require('child_process'),
    fork = childProcess.fork,
    crypto = require('crypto'),
    fs = require('fs'),
    spawnCount = 0,
    requestQueue = [],
    date = new Date();

var server = http.createServer(function (req, res) {

    var targetQuery = url.parse(req.url).query ? url.parse(req.url).query : null,
        targetUrl = null, resData = null;
    if(targetQuery){
        targetUrl = queryString.parse(targetQuery).targetUrl;
    }
    var resData = '', crawl = null,
        responseLogic = function(resData){
            if(resData != ''){
                req.setEncoding('utf8');
                res.setHeader('Transfer-Encoding', 'chunked');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(resData);

            }else{
                res.writeHead(404);
            }

            console.info('['+date.getTime()+'] Process ended at ' + date.getTime());
        }

    if(targetUrl){
        try{
            console.info('['+date.getTime()+'] -----------------------------------------');
            console.info('['+date.getTime()+'] Target url '+ targetUrl);
            console.info('['+date.getTime()+'] Process started at ' + date.getTime());
            var fileHash = crypto.createHash('md5').update(targetUrl+"").digest('hex'),
                filePath = configs.cacheDirectory  + fileHash + '.html';


            fs.exists(filePath, function(exists) {
                if (exists) {
                    console.info('['+date.getTime()+'] Cache found, start reading');
                    resData = fs.readFileSync(filePath);
                    responseLogic(resData);
                } else {

                    if(spawnCount >= configs.concurrentWorkers){
                        res.writeHead(404);
                        res.end('');
                    }
                    try{
                        crawl = fork('crawl/app.js',[targetUrl]);
                    }catch(e){
                        console.error('['+date.getTime()+']' + e.message);
                    }
                    spawnCount ++;
                    console.info('['+date.getTime()+'] Cache empty, starting calling crawl');
                    console.info('['+date.getTime()+'] ...Processing...');
                    crawl.on('message',function(result){
                        resData += result.data;
                    });
                    crawl.on('exit',function(){
                        fs.writeFile(filePath, resData, function (err) {
                            if (err) throw err;
                            console.info('['+date.getTime()+'] Cache saved as '+ filePath);
                        });
                        spawnCount --;
                        responseLogic(resData);

                    });
                }
            });



        }catch(e){
            console.error('['+date.getTime()+']' + e.message);
            res.writeHead(404);
            res.end('');
        }
    }else{
        res.writeHead(404);
        res.end('');
    }


}).listen(5542, "127.0.0.1");

server.on('error',function(e){
    console.error('['+date.getTime()+']' + e.message);
})