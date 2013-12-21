/**
 缓存进程
**/

var fs = require('fs'), configs = require('../config.js'), cacheHash = null;

process.argv.forEach(function (val, index, array) {
    if(index === 2){
        cacheHash = val;
    }
});

var fileHash = crypto.createHash('md5').update(targetUrl+"").digest('hex'),
    filePath = configs.cacheDiectory + '/' + fileHash + '.html';


fs.exists(filePath, function(exists) {
    if (exists) {
        fs.readFile(filePath, function (err, data) {

        });
    } else {

    }
});

