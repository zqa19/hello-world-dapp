// The 'eris socket-based rpc object. This is used to pass messages over a regular 
// websocket connection, and to handle incoming messages.
//
// Params: the endpoint used to establish a websocket connection 
// (usually ws://localhost:3000/ws/dappname)
//
// For the Eris socket RPC protocol specification (draft) see: 
// TODO Add link
//
var WebsocketAPI = function(socketAddr){

	// The websocket connection itself
	var conn = null;
	// Used to handle received rpc events
	var messageCallbacks = {};
	// The endpoint for the socket
	var socketAddress = socketAddr;

	// Create the socket.
	this.start = function(){
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
 	//  is an ESRPC response object.
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

	// This is called to send data over the socket.
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
