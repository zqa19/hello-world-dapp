
// This API is for dapps (and should use the same names as ethereum uses for blockchain
// stuff imo).
function DappCore(blockchain){
	
	// *************************** Variables *************************
	
	// The blockchain we're using (currently monk).
	// TODO validate the module interface.
	var bc = blockchain;
	
	// This is the root contract of any given dapp, as provided by the
	// dapps package.json. It is bound to the runtime under the name 
	// "RootContract".
	var rootContract;
	
	if (typeof(RootContract) !== "undefined"){
		rootContract = RootContract;
	} else {
		Println("No root contract address! The dapp will not work.");
		rootContract = "0x0";
	}
	
	// The first four hex-digits (or two bytes) of the ipfs hash.
	var ipfsHead = "1220";
	
	// Used internally to keep track of received events.
	var eventCallbacks = {};

	// ************************* Blockchain ************************
	
	// Gets you the balance of the account with address 'accountAddress'.
	this.balanceAt = function(accountAddress){
		var acc = this.account(accountAddress)
		if(acc === null){
			return "0x0";
		} else {
			return acc.Balance;
		}
	}

	// Gets you the value stored at address 'storageAddress' in the account
	// with address 'accountAddress'
	this.storageAt = function(accountAddress,storageAddress){
		var sa = bc.StorageAt(accountAddress, storageAddress);
		if (sa.Error !== ""){
			return "0x0";
		} else {
			return sa.Data;
		}
	}

	// Gets you the entire storage of the account with address 'accountAddress'.
	this.storage = function(accountAddress){
		var storage = bc.Storage(accountAddress);
		if (storage.Error !== ""){
			return null;
		} else {
			return storage.Data;
		}
	}

	// Gets you the account with address 'accountAddress'
	this.account = function(accountAddress){
		var a = bc.Account(accountAddress);
		if (a.Error !== ""){
			return null;
		} else {
			return a.Data;
		}
	}

	this.msg = function(recipient,txData){

		var msgRecipe = {
			"Success" : false,
			"Hash" : "",
			"Error" : ""
		};

		var m = bc.Msg(recipient,txData);
		if (m.Error !== ""){
			msgRecipe.Error = m.Error;
		} else {
			msgRecipe.Success = true;
			msgRecipe.Hash = m.Data.Hash;
		}
		return msgRecipe;
	}

	this.endow = function(recipient,sum){

		var edRecipe = {
			"Success" : false,
			"Hash" : "",
			"Error" : ""
		};

		var e = bc.Msg(recipient,txData);
		if (e.Error !== ""){
			edRecipe.Error = e.Error;
		} else {
			edRecipe.Success = true;
			edRecipe.Hash = e.Data.Hash;
		}
		return msgRecipe;
	}

	this.script = function(script,language){

		var scRecipe = {
			"Compiled" : false,
			"Hash" : "",
			"Address" : "",
			"Error" : ""
		};

		var s = bc.Script(recipient,txData);
		if (s.Error !== ""){
			edRecipe.Error = s.Error;
		} else {
			edRecipe.Success = true;
			edRecipe.Hash = s.Data.Hash;
		}
		return msgRecipe;
	}

	// Sends a "full" transaction to the blockchain.
	this.transact = function(recipientAddress,value,gas,gascost,data){
		
		var txRecipe = {
			"Compiled" : false,
			"Error"    : "",
            "Success"  : false,
            "Address"  : "",
			"Hash"     : ""
		};
		
		if (recipientAddress === "") {
			Println("Create transaction.");
			var addr = bc.Script(data, "lll-literal")
			if (addr.Error !== "") {
				return null;
			} else {
				txRecipe.Address = addr.Data;
				txRecipe.Compiled = true;
				txRecipe.Success = true;
			}
		} else if (data === "") {
			Println("Processing tx");
			var rData = bc.Tx(recipientAddress,value);
			if (rData.Error !== ""){
				return null;
			}
			txRecipe.Success = true;
       		txRecipe.Hash = rData.Data.Hash;
		} else if (value === ""){
			Println("Processing message");
			var txData = data.split("\n");
			for (var i = 0; i < txData.length; i++){
				txData[i] = txData[i].trim();
			}
			var rData = bc.Msg(recipientAddress,txData);
			if (rData.Error !== ""){
				return null
			}
			txRecipe.Success = true;
			txRecipe.Hash = rData.Data.Hash;
		} else {
			// TODO general purpose tx
			Println("Processing transaction");
			var txData = txData.split("\n");
			for (var i = 0; i < txData.length; i++){
				txData[i] = txData[i].trim();
			}
			
			//var rData = bc.Transact(recipientAddress,value,gas,gascost,txData);
			//if (rData.Error !== ""){
			//	return null
			//}			
			//txRecipe.Success = true;
			//txRecipe.Hash = rData.Data.Hash;
		}
		return txRecipe;
	}

	// Watch if the state of an account changes. The first
	// param 'addr' is the address of the account. The second
	// is the callback function.
	// 
	// NOTE: The callback function should be on the form: 
	// callbackFn = function(accountAddress)
	this.watchAcc = function(addr,callbackFun){
		eventCallbacks[addr] = callbackFun;
	}

	// Stop watching the account with address 'addr'. If the account
	// is not watched when calling this, nothing happens.
	this.unwatchAcc = function(addr){
		if (typeof(eventCallbacks[addr]) !== "undefined"){
			delete eventCallbacks[addr];
		}
	}
	
	// ******************** FileSystem (IPFS) ********************

	// Writes a file to the ipfs file system and returns the hash
	// as a hex string. 
	//
	// NOTE: The hash is stripped of its first two bytes, in order to 
	// get a 32 byte value. The first byte is the hashing algorithm
	// used (it's always 0x12), and the second is the length of the
	// hash (it is always 0x20). See DappCore.ipfsHeader.
	this.writeFile = function(data) {
		var hashObj = ipfs.PushBlockString(data);
		if(hashObj.Error !== "") {
			return "";
		} else {
			// This would be the 32 byte hash (omitting the initial "1220").
			return "0x" + hashObj.Data.slice(4);
		}
	};
	
	// Takes the 32 byte hash. Prepends "1220" to create the full hash.
	this.readFile = function(hash) {
		if(hash[1] === 'x'){
			hash = hash.slice(2);
		}
		var fullHash = ipfsHead + hash;
		var fileObj = ipfs.GetBlock(fullHash);
		
		if(fileObj.Error !== "") {
			return "";
		} else {
			// This would be the file data as a string.
			return fileObj.Data;
		}
	};
	
	// ********************** Legal Markdown **********************
	
	// This function gives you a pdf representation of legal markdown.
	// 
	// NOTE: It is mostly used for legal contract dual-integration, as
	// when you want to create a smart contract on the blockchain and 
	// at the same time put an actual legal contract into the filesystem 
	// as a complement. The hash of the legal contract would often be 
	// part of the smart contract, as a guarantee.
	//
	// More info can be found here: 
	//
	// https://github.com/eris-ltd/legalmarkdown
	// http://lmd.io
	//
	function markdownToPDF(markdown,params){
		var retData = lmd.Compile(markdown,params);
		if(retData.Error !== ""){
			return "";
		} else {
			return retData.Data;
		}
	}

	// ************************ Helpers ************************
	
	// Listens to new blocks.
	this.newBlock = function(event){
		// Hacky way to check all new transactions. Listen to
		// all new blocks and scan them for account updates.
		var txs = event.Resource.Transactions;
		var checked = {};
		for (tx in txs){
			var sen = tx.Sender;
			if (typeof (checked[sen]) === "undefined"){
				var cb = eventCallbacks[sen];
				if (typeof(cb) === "function"){
					cb();
				}
				checked[sen] = true;
			}
			var rec = tx.Recipient;
			if (typeof (checked[rec]) === "undefined"){
				var cb = eventCallbacks[rec];
				if (typeof(cb) === "function"){
					cb();
				}
				checked[rec] = true;
			}
			var cnb = tx.Coinbase;
			if (typeof (checked[cnb]) === "undefined"){
				var cb = eventCallbacks[cb];
				if (typeof(cb) === "function"){
					cb();
				}
				checked[cnb] = true;
			}
			
		}
	}

	// Needs a unique Id to run. Normally that would be the id of
	// the session that uses it.
	this.run = function(uid){
		// Subscribe to block events.
		events.subscribe("monk","newBlock","", this.newBlock, uid);
	}

	this.shutdown = function(uid){
		// Unsubscribe to block events.
		events.unsubscribe("monk","newBlock", uid);
	}

}
