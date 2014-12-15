/*  This can be instantiated and run in order to start the hello world dapp. The startup 
 *  sequence is mostly a formality (it's the same in every single dapp, and does not really 
 *  require any thinking - just follow this script basically.
 */
function HelloWorldDapp(){

	Println("Creating helloworld.");

	// var dappCore = new DappCore();
	// var api = new DappHttpAPI(dappCore);
	var api = new DappHttpAPI();

	this.run = function(){
		Println("Starting helloworld.");
		// We overwrite the new websocket session callback with this function. It will
		// create a new api and tie it to the session object.
		//
		// The newWsCallback function must return a function that is called every time
		// a new request arrives on the channel, which is set to be the handlers 'handle'
		// function.
		network.incomingHttpCallback = function(request) {
			return api.handle(request);
		}
	}
}

// Start it up
new HelloWorldDapp().run();
