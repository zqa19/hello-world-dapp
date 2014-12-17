/*
 * Hello World!
 *
 * This is the javascript for a hello world dapp that runs in Eris' DeCerver.
 * It lets you run a typical Ethereum-style 'namereg' contract. You will register
 * your public address as a , but storing large files using IPFS 
 * (Interplanetary Filesystem) instead of a string.
 *																				  
 * Licence: https://github.com/eris-ltd/hello-world-dapp/blob/master/LICENSE.txt             
 *																				  
 */


var baseUrl = "http://localhost:3000/http/helloworld"

// The placeholder HTTP api is used to send http messages to the decerver.
// You will probably want to replace this with your own code.
// Params: the endpoint (usually http://localhost:3000/http/dappname)
var HttpAPI = function(){

	this.send = function(method, url, body) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open(method, url, false);
		if(typeof(body) === "undefined"){
			body = null;
		}
		xmlHttp.send(body);
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

//***************************************************************************

var	sender = new HttpAPI();

window.onload = function() {
	console.log("Hello from hello world dapp!");
};


function getFile(){
	var fName = document.getElementById('filenameGet').value;
	var file = sender.send("GET", baseUrl + "/get?filename=" + fName, null);
	document.getElementById('output').value = file;
};

function addFile(){
	var fName = document.getElementById('filenameAdd').value;
	var body = document.getElementById('input').value;
	
	if(body === ""){
		window.alert("There is nothing in the file input text area!");
		return;
	}

	// We send a POST request to the base url that ends with '/add?filename=thefilename'
	// add is the method name, and file name in the query. Body is the actual file data.
	// We don't worry about headers and stuff now (although we should).
	var txt = sender.send("POST", baseUrl + "/add?filename=" + fName, body);
	window.alert("File sent! You can now get it by its name.");
};

