setTimeout(function(){

    setInterval(function(){
        if (typeof window.callPhantom === 'function') {
            window.callPhantom();
        }
    },1000);

},30000);

