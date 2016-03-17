window.VERSION = "0.8.90";
serviceBaztille.service('config',function(){ 
	this.apiUrl = 'API_ENPOINT';
    this.alertForWsError=false;
});
initBaztille.constant("BaztilleConfig", {
	// false for native
	"HTML5mode": false
});