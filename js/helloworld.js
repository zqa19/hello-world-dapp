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


var baseUrl = "http://localhost:3000/helloworld"

// The placeholder HTTP api is used to send http messages to the decerver.
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

	this.sendAsync = function(method, url, body, callbackFn) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			if (xmlHttp.readyState === 4){
				callbackFn(xmlHttp);
			}
		};
		xmlHttp.open(method, url, true);
		if(typeof(body) === "undefined"){
			body = null;
		}
		xmlHttp.send(body);
		return;
	}
}

//***************************************************************************

var	sender = new HttpAPI();

function getFile(){
	var fName = document.getElementById('filenameGet').value;
	sender.sendAsync("GET", baseUrl + "/files/" + fName, null, function(request) {
		if (request.status === 200) {
	        document.getElementById('output').value = data;
	    } else {
			document.getElementById('output').value = "File not found";
		}
	});
};

function addFile(){
	var fName = document.getElementById('filenameAdd').value;
	var body = document.getElementById('input').value;
	
	if(body === ""){
		window.alert("There is nothing in the file input text area!");
		return;
	}

	sender.sendAsync("POST", baseUrl + "/files/?nme=" + fName, body, function(request) {
		if (request.status === 200) {
	        window.alert("File sent! You can now get it by its name.");
	    } else {
			window.alert("Failed to add file:\n" + request.responseText);
		}
	});

};

