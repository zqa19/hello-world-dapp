/*
 * Hello World!
 *
 * This is the javascript for a hello world dapp that runs in Eris' DeCerver.
 * It lets you run a typical Ethereum-style 'namereg' contract. You will register
 * your public address as a , but storing
 * large files using IPFS (Interplanetary Filesystem) instead of a string.
 *																				  
 * Licence: https://github.com/eris-ltd/hello-world-dapp/blob/master/LICENSE.txt             
 *																				  
 */

// ************************************* INIT **************************************

// Socket object.
var esrpc;

window.onload = function() {
	console.log("hello");
	// Set the websocket connection up.
	esrpc = new WebSocketAPI();

	// Register a callback for TestJS (the function we're calling)
	esrpc.registerMessageCallback("TestJS", function(response){
		document.getElementById('output').innerHTML = response.Result;
	});

	esrpc.start("ws://localhost:3000/ws/helloworld");

	// When the window is unloaded.
	window.onunload = function() {
		esrpc.shutdown();
	};
};

// Send the test data to 
function testJS(){
	var data = document.getElementById('input').value;
	esrpc.post("TestJS",data);
};

// ************************************* UI stuff **************************************



// ************************************* Objects **************************************

// The 'eris socket-based rpc object. This is used to pass messages over a regular 
// websocket connection, and to handle incoming messages.
var WebSocketAPI = function(){

	// The websocket connection itself
	var conn = null;
	// Used to handle received rpc events
	var messageCallbacks = {};

	// Create the socket.
	this.start = function(socketAddress){
		if (window["WebSocket"]) {
		    this.conn = new WebSocket(socketAddress);
		    // Event listeners
		    this.conn.onopen = function () {
		    	console.log("WebSockets connection opened.");
		    }
		    this.conn.onclose = function(evt) {
		        console.log("WebSockets connection closed.");
		    }
		    this.conn.onmessage = function(evt) {	
		    	handleIncomingMsg(evt.data);
		    }
		} else {
			alert("Your browser does not support WebSockets. The dapp will not run.");
		}
	}

	// Shut down closes the socket.
	this.shutdown = function(){
		if(this.conn != null && this.conn.readyState < 2){
			conn.close();
		}
	}

	// Register a new callback.
	this.registerMessageCallback = function(name,callbackFn){
		if(typeof(name) !== "string"){
			throw new TypeError("Message callback name is not a string");
		}
		if(typeof(callbackFn) !== "function"){
			throw new TypeError("Message callback is not a function");
		}
		messageCallbacks[name] = callbackFn;
	}

	// Remove a callback.
	this.unregisterMessageCallback = function(name,callbackFn){
		if(typeof(messageCallbacks[name]) === "function"){
			delete messageCallbacks[name];
		}
	}

	
 	//  The event handler receives events from decerver. The response passed to each handler
 	//  is a json rpc object:
	//
    //  {
	//		"Protocol" : "ESRPC",
	//		"Method" : string,
	//		"Result" : object (1),
	//		"Time" : number,
	//		"Id" : user defined,
	//		"Error" : {
	//			"Code" : number (2),
	//			"Message" : string,
	//			"Data" : object (usually not used)
	//		}
	//  }
	//
	//  1. The result field contains whatever the rpc method returned.
	//  2. Same as JSON-RPC 2.0:
	//    E_PARSE = -32700
	//	  E_INVALID_REQ = -32600
	//	  E_NO_METHOD = -32601
	//	  E_BAD_PARAMS = -32602
	//	  E_INTERNAL = -32603
	//	  E_SERVER = -32000
	//
	function handleIncomingMsg(msg) {
	
		var response = JSON.parse(msg);
		console.log(response);
	
		var result = response.Result;
	
		if(typeof(messageCallbacks[response.Method]) == "undefined"){
			console.log("Undefined binding: " + response.Method);
			return;
		} else {
			console.log("Received: " + response.Method);
			// Pass to event handler.
			messageCallbacks[response.Method](response);
		}
	};

	//   This is called to send the data over the socket.
	//   The protocol Eris uses is called ESRPC - Eris Socket-based RPC.
	//   RPC stands for "Remote Procedure Call". 
	//   ESRPC expects the following: 
	//
	// - A protocol name field "Protocol". The only supported protocol now is "ESRPC"
	//
	// - A method name field, which is a string. It is the name of the remote method.
	//
	// - A parameters field named "Params". Params is an object. It is the parameters 
	//   passed to the function. It must match the parameters that the function expects 
	//   to receive.
	//
	// - A field named 'Id', which is not used currently, but can be used for various
	//   purposes, such as binding a message to a particular session.
	//
	// - A field named "Time", which should contain a milisecond timestamp. In browser script
	//   you would normally get that from the date object. The decerver javascript runtime 
	//   does not check timestamps by default, but you should expect that backend javascript 
	//   in Eris-made dapps might.
	this.post = function(method, params) {
		var req = {
			"Protocol" : "ESRPC",
			"Method" : method,
			"Params" : params,
			"Id"	 : "",
			"Time"   : new Date().getTime()
		};
		var sreq = JSON.stringify(req);
		console.log(sreq);
		this.conn.send(sreq);
	}
}

