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
    requestQueue = [];

http.createServer(function (req, res) {

    var targetQuery = url.parse(req.url).query ? url.parse(req.url).query : null,
        targetUrl = null, resData = null;
    if(targetQuery){
        targetUrl = queryString.parse(targetQuery).targetUrl;
    }
    var date = new Date(), resData = '', crawl = null,
        responseLogic = function(resData){
            if(resData != ''){
                req.setEncoding('utf8');
                res.setHeader('Transfer-Encoding', 'chunked');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(resData);

            }else{
                res.writeHead(404);
            }

            console.info('Process ended at ' + date.getTime());
        }

    if(targetUrl){
        try{
            console.info('-----------------------------------------');
            console.info('Target url '+ targetUrl);
            console.info('Process started at ' + date.getTime());
            var fileHash = crypto.createHash('md5').update(targetUrl+"").digest('hex'),
                filePath = configs.cacheDirectory + '/' + fileHash + '.html';


            fs.exists(filePath, function(exists) {
                if (exists) {
                    console.info('Cache found, start reading at ' + date.getTime());
                    fs.readFile(filePath, function (err, data) {
                        if (err) throw err;
                        responseLogic(data);
                    });
                } else {

                    if(spawnCount >= configs.concurrentWorkers){
                        res.writeHead(404);
                        res.end('');
                    }
                    crawl = fork('spider/app.js',[targetUrl]);
                    spawnCount ++;
                    console.info('Cache empty, starting calling crawl at ' + date.getTime());
                    console.info('...Processing...');
                    crawl.on('message',function(result){
                        resData += result.data;
                    });
                    crawl.on('exit',function(){
                        fs.writeFile(filePath, resData, function (err) {
                            if (err) throw err;
                            console.info('Cache saved at ' + date.getTime());
                        });
                        spawnCount --;
                        responseLogic(resData);

                    });
                }
            });



        }catch(e){
            res.writeHead(404);
            console.log(e);
            res.end('');
        }
    }else{
        res.writeHead(404);
        res.end('');
    }


}).listen(5542, "127.0.0.1");
