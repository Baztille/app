if(window.location.hash) { 
	if(window.location.hash == "#/splash#suscribe") { 
		window.setTimeout(function() {
			angular.element(document.querySelectorAll('.button-positive')[0]).triggerHandler('click');
		}, 1000);
	}
}