
setInterval(function(){

    var elem = document.getElementsByClassName("deallist")[0];

    if(elem){
        var evt = document.createEvent("MouseEvents");
        evt.initEvent('mousewheel', true, true);
        evt.wheelDelta = -1000;
        elem.dispatchEvent(evt);
        if (typeof window.callPhantom === 'function') {
            window.callPhantom();
        }
    };

},50);


