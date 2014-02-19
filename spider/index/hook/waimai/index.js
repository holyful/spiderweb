setInterval(function(){
	var dom = document.getElementsByClassName("shop-list");

	if(dom.length>0){
	    if (typeof window.callPhantom === 'function') {
	        window.callPhantom();
	    }
	}
},50);


