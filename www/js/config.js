window.VERSION = "0.8.7";
serviceBaztille.service('config',function(){ 
	this.apiUrl = 'http://ws.far.baztille.org';
    this.alertForWsError=false;
});
