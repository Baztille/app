window.VERSION = "0.8.85";
serviceBaztille.service('config',function(){ 
	this.apiUrl = 'API_ENPOINT';
    this.alertForWsError=false;
});
initBaztille.constant("BaztilleConfig", {
	// false for native
	"HTML5mode": false
});