// The placeholder HTTP api is used to send http messages to the decerver.
// You will probably want to replace this with your own code.
// The URL would usually be http://localhost:3000/http/dappname)
//
// Usage: var httpApi = new HttpAPI();
//
var HttpAPI = function(){

	this.send = function(method, url) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, false);
		xmlHttp.send();
		return xmlHttp.responseText;
	}

	this.sendAsync = function(method, url, callbackFn) {
		var xmlHttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = callbackFn;
		xmlHttp.open(method, url, true);
		xmlhttp.send();
		return;
	}
}
