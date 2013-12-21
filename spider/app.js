var webserver = require('webserver');

var server = webserver.create();

var Page = require("./index/page");

var __CONFIG__ = require("./base/config");

var Util = require('./base/util');


var service = server.listen(__CONFIG__.port, function(req, res) {
  		


		var query = Util.parse(req.url);


	  	// req.addListener('data', function(postDataChunk) {
    //    		postData += postDataChunk;

	   //  });

	   //  req.addListener('end', function() {
	   //      if(postData)
	   //     		postData =(postData.indexOf('{') === 0) ? JSON.parse(postData) : querystring.parse(postData);
	   //  });

	    if(query.url){

	    	var page = new Page(query);


	    	page.on('success',function(){

	    	});

	    	page.init();





	    }
});


console.log("server started");


// process.argv.forEach(function (val, index, array) {
//     if(index === 2){
//         targetUrl = val;
//     }
// });
// //-------
// process.send({data:data });
// process.exit();