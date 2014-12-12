function TestAPI(session) {

	// TODO This section contains nothing that needs changing.

	/***************************************** ate/monk/ipfs stuff ************************************/
	session = session;
	methods = {};
	
	// Called on incoming messages.
	this.handle = function(req) {
		var hFunc = methods[req.Method];
		if (typeof(hFunc) != "function"){
			return network.getWsErrorDetailed(E_NO_METHOD,"No handler for method: " + req.Method);
		}
		var jsonResp = hFunc(req.Params);
		jsonResp.Method = req.Method;
		jsonResp.Id = req.Id;
		return jsonResp;
	}
	
	// Do a transaction and return the tx hash.
	function sendMsg(addr, txIndata){
		Println("Sending message");
		for (var i = 0; i < txIndata.length; i++){
			txIndata[i] = txIndata[i].trim();
		}
		Printf("TxData: %v\n", txIndata);
		var rData = monk.Msg(addr, txIndata);
		if (rData.Error !== ""){
			return network.getWsError(rData.Error);
		}
		
		var resp = network.getWsResponse();
		resp.Result = rData.Data.Hash;
		return resp;
	};
	
	// "StorageAt". Simplify storage access. Not gonna pass errors to UI.
	function SA(accAddr, sAddr){
		var sObj = monk.StorageAt(accAddr,sAddr);
		if (sObj.Error !== ""){
			Printf("Error when accessing storage for contract '%s' at address '%s': %s\n",accAddr,sAddr,sObj.Error);
			return "";
		}
		return sObj.Data;
	};
	
	function WriteFile(data){
		var hashObj = ipfs.PushBlockString(data);
		if(hashObj.Error !== "") {
			return "";
		} else {
			// This would be the 32 byte hash (omitting the initial "1220").
			return "0x" + hashObj.Data.slice(4);
		}
	};
	
	// Takes the 32 byte hash. Prepends "1220" to create the full hash.
	function ReadFile(hash){
		if(hash[1] === 'x'){
			hash = hash.slice(2);
		}
		var fullHash = "0x1220" + hash;
		var fileObj = ipfs.GetBlock(fullHash);
		
		if(fileObj.Error !== "") {
			return "";
		} else {
			// This would be the file data as a string.
			return fileObj.Data;
		}
	};
	
	/***************************************** actions/dapp logic ************************************/
	
	methods.TestJS = function(input){

		var resp = network.getWsResponse();
		resp.Result = input;
		return resp;
	}
};


// We overwrite the new websocket session callback with this function. It will
// create a new api and tie it to the session object.
//
// The newWsCallback function must return a function that is called every time
// a new request arrives on the channel, which is set to be the handlers 'handle'
// function.
network.newWsCallback = function(sessionObj){
	var api = new TestAPI(sessionObj);
	sessionObj.api = api;
	return function(request){
		return api.handle(request);
	};
}

// This is called when a websocket session is closed. We need to tell it to stop 
// listening for events.
network.deleteWsCallback = function(sessionObj){
}
