


var targetUrl = null;
process.argv.forEach(function (val, index, array) {
    if(index === 2){
        targetUrl = val;
    }
});
var data = "<html></html>"
process.send({data:data });
process.exit();
