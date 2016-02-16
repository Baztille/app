window.VERSION = "0.8.80";
serviceBaztille.service('config',function(){ 
	this.apiUrl = 'http://ws.baztille.org';
    this.alertForWsError=false;
});
