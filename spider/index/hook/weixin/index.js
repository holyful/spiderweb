setTimeout(function(){

	var elem = document.getElementsByClassName("deallist")[0];
	var evt = document.createEvent("MouseEvents");
  	evt.initEvent('mousewheel', true, true);
  	evt.wheelDelta = -1000;
  	setInterval(function(){
        if(elem){
            elem.dispatchEvent(evt)
        };
    },200);

  	setInterval(function(){
  		if (typeof window.callPhantom === 'function') {
			window.callPhantom();
		}
  	},5000);

},30000);


