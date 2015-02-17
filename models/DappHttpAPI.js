
/* DappHttpApi handles incoming http requests. Super basic URL parsing.
 * It assumes the url to be on the common form 'http://localhost:3000/html/helloworld/method?param1=val1&param2=val2&...'
 *
 */
function DappHttpAPI() {
	
	var methods = {};

	// Called on incoming messages.
	this.handle = function(httpReq) {
		
		// Split the URL and slice. It starts with '/' by default.
		var reqSplit = httpReq.URL.Path.slice(1).split('/');
		// This will be ["http","helloworld", "themethod"] normally.
		
		// Just gonna 400 all of these.
		if(reqSplit.length != 3){
			return {
				"Status" : 400,
				"Header" : {},
				"Body" : "Wrong number of arguments"
			};
		}

		// Get the method, which is the last segment of the path.
		var method = reqSplit[2];
		
		// We need to get the parameters.
		var params = httpReq.URL.RawQuery.split('&');

		// This is where the result will be stored.
		var result;

		// Now check if the person wants to add a file.
		if(method === "add"){
			// For add, we'll expecting the method name to be 'add', and the data is in the body.
			if(httpReq.Method !== "POST"){
				return {
					"Status" : 400,
					"Header" : {},
					"Body" : "We only allow POST method for add. Method used: " + httpReq.Method
				};
			}
			// Only one param 'filename=thefilename'
			if(params.length !== 1){
				return {
					"Status" : 400,
					"Header" : {},
					"Body" : "Wrong number of params for 'add'"
				};
			}
			// This is the parameter
			var param = params[0];

			// Make sure the request says: filename=thefilename, and that there is a filename.
			var pArr = param.split("=");
			if(pArr.length !== 2 || pArr[0] !== "filename" || pArr[1] == ""){
				return {
					"Status" : 400,
					"Header" : {},
					"Body" : "Malformed parameter for 'add', should be 'filename=thefilename'. Sent : " + param
				};
			}

			// Phew

			// Now send the filename and data to the add method.
			var result = methods.add(pArr[1],httpReq.Body);
			
		} else if (method === "get") {

			// Same stuff as with the 'add' method.
			if(httpReq.Method !== "GET"){
				return {
					"Status" : 400,
					"Header" : {},
					"Body" : "We only allow the GET method for get."
				};
			}

			if(params.length !== 1){
				return {
					"Status" : 400,
					"Header" : {},
					"Body" : "Wrong number of params for 'get'."
				};
			}

			// This is the parameter
			var param = params[0];
			// Make sure the request says: filename=thefilename, and that there is a filename.
			var pArr = param.split("=");
			if(pArr.length !== 2 || pArr[0] !== "filename" || pArr[1] == ""){
				return {
					"Status" : 400,
					"Header" : {},
					"Body" : "Malformed parameter for 'get', should be 'filename=thefilename'. Sent : " + param
				};
			}

			// Run the 'get' method.
			result = methods.get(pArr[1]);
		} else {
			// If method isn't 'get' or 'add' - just return an error.
			return {
				"Status" : 400,
				"Header" : {},
				"Body" : "No method named:" + method
			};
		}

		// Generate a new http response.
		var resp = network.getHttpResponse();
		// Set the status to 200 and put the result in the body.
		resp.Status = 200;
		resp.Body = result;
		// Return the response.
		return resp;
	}

	// Add a file with name 'filename' and the data 'data'.
	methods.add = function(filename,data){
		var fName = sutil.stringToHex(filename);
		var fHash = writeFile(data);

		var txData = [];
		txData.push(fName);
		txData.push(fHash);
		msg(txData)
		commit();

		return "";
	}

	// Get a file with name 'filename'
	methods.get = function(name){
		var nameHex = sutil.stringToHex(name);
		var fHash = storageAt(nameHex);
		Println("Getting the storage for filename:" + nameHex);
		Println("Hash: " + fHash);
		var fileData = readFile(fHash);
		Printf("File data: %v\n",fileData);
		if(fileData === ""){
			fileData = "<File not available>";
		}
		
		return fileData;
	};

	// These methods are part of the DappCore UI, but are copied here since we don't need the entire thing.
	function commit(){
		monk.Commit();
	};
	
	// Send a message
	function msg(txData){
		Printf("Pushing stuff to monk. TxData: %v\n", txData);
		Printf("Root contract: " + RootContract);
		var msgRecipe = {
			"Success" : false,
			"Hash" : "",
			"Error" : ""
		};

		var m = monk.Msg(RootContract,txData);
		if (m.Error !== ""){
			msgRecipe.Error = m.Error;
		} else {
			msgRecipe.Success = true;
			msgRecipe.Hash = m.Data.Hash;
		}
		return msgRecipe;
	};

	// Gets you the value stored at address 'storageAddress' in the
	// 'RootContract' (which is the contract address specified in the package.json file).
	function storageAt(storageAddress){
		var sa = monk.StorageAt(RootContract, storageAddress);
		if (sa.Error !== ""){
			return "0x0";
		} else {
			return sa.Data;
		}
	};

		// Gets you the value stored at address 'storageAddress' in the
	// 'RootContract' (which is the contract address specified in the package.json file).
	function storageRoot(){
		var sa = monk.Storage(RootContract);
		if (sa.Error !== ""){
			return null;
		} else {
			return sa.Data.Storage;
		}
	};

	// Writes a file to the ipfs file system and returns the hash
	// as a hex string. 
	//
	// NOTE: The hash is stripped of its first two bytes, in order to 
	// get a 32 byte value. The first byte is the hashing algorithm
	// used (it's always 0x12), and the second is the length of the
	// hash (it is always 0x20). See DappCore.ipfsHeader.
	function writeFile(data) {
		var hashObj = ipfs.PushFileData(data);
		if(hashObj.Error !== "") {
			return "";
		} else {
			// This would be the 32 byte hash (omitting the initial "1220").
			return "0x" + hashObj.Data.slice(4);
		}
	};
	
	// Takes the 32 byte hash. Prepends "1220" to create the full hash.
	function readFile(hash) {
		if(hash[1] === 'x'){
			hash = hash.slice(2);
		}
		var fullHash = "1220" + hash;
		var fileObj = ipfs.GetFile(fullHash,false);
		
		if(fileObj.Error !== "") {
			return "";
		} else {
			// This would be the file data as a string.
			return fileObj.Data;
		}
	}

};
