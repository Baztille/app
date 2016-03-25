if(window.location.hash) { 
	if(window.location.hash == "#suscribe") { 
		window.setTimeout(function() {
			angular.element(document.querySelectorAll('.button-positive')[0]).triggerHandler('click');
		}, 1000);
	}
}
// To follow Campaign
window.getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
