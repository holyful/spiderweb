
setInterval(function(){
    if (typeof window.callPhantom === 'function') {
        window.callPhantom();
    }
},50);
