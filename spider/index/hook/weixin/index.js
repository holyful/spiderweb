
var timer = setInterval(function(){

    var elem = document.getElementsByClassName("deallist")[0];

    if(elem){
        clearInterval(timer);
        setInterval(function(){
            var evt = document.createEvent("MouseEvents");
            evt.initEvent('mousewheel', true, true);
            evt.wheelDelta = -1000;
            elem.dispatchEvent(evt);
        },30);
        setTimeout(function(){
            if (typeof window.callPhantom === 'function') {
                window.callPhantom();
            }
        },3000);
    };

},50);


