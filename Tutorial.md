The Hello World Dapp Tutorial

The Hello World dapp is designed to help you get started with dapp making.

Dapp making overview

This is the main steps when creating a dapp

- Create contracts
- Create the ate script
- Create the web interface
- Deploy the chain
- Package the dapp

Contracts can be written using LLL or Serpent, or any other contract writing language. Decerver only supports LLL 
compilation natively, but support for Serpent 2.0 and Solidity will be added as the languages mature. You should 
consult a contract writing tutorial to get started. Simple examples are provided in the hello-world-dapp.

When the contracts are created, you can communicate with those via javascript, through the Decerver javascript 
runtime. The blockchains, file systems, and other components exposes javascript APIs. Decerver itself also exposes 
other basic functionality, such as event creation & listening, basic networking (http and websockets), and utilities
such as hex-string math and advanced logging.

The UI is written as normal web applications are. For now, you can use the hello world dapp as an example of how
to communicate with decerver (it has a very simple web-ui). You should consult the ate scripting reference for a 
more detailed description.

When the script and contract code is ready, the contracts should be deployed onto a chain using the epm tool. This 
can be done through the command line epm interface. Later it will be integrated more into the decerver itself.

Finally, when the chain has been deployed, you would package the UI code with the ate script, and add a package.json
file. The Hello World dapp serves as a reference here. Things to remember is: 

- The main folder should have the same name as the id you write into the package.json file.
- The main folder should contain (at the very least) an index.html page - the entrypoint to the dapp - a 'models' folder
  for backend javascript, and a package.json file.

- The models folder should contain a config.json that specifies the loading order of the backend script.


The Hello World Dapp - instructions

This is how you get the Hello World dapp running.

1 - Pull the hello world dapp from https://github.com/eris-ltd/hello-world-dapp.git

2 - If you have the decerver folders already ready, you can pull it into the folder .decerver/dapps/helloworld, otherwise leave it as it is, for now.

3 - go into the contracts folder and run this command: epm -init
    Then run this command: epm -deploy -install -name helloworld
    Then run this command: epm -p -diff helloworld.pdx
    After the -p command, check the address that was given to the contract. That is the root contract address.
    Also, you should check the chain id. If you didn't catch it, you should be able to do: epm -refs, to see it.
    It is the long hash next to the 'helloworld' chain name.

4 - At this point, the chain with the helloworld test contract should be deployed. Put the chain id and root contract
    address into the package.json.  You'll find those fields under Dependencies - monk, and they already have
    placeholder values. Remember to prepend the root contract address with an '0x', if there isn't one. This should
    not be done with the chain id however, it should be the same as in epm -refs.

5 - Now start up the decerver. If you do it through the front end, you should be able to see Hello World listed
    under dapps. Otherwise, if you run decerver headless, you need to put the dapp in focus manually. That can be
    done by calling 'curl http://localhost:3000/admin/switch/helloworld'

6 - The site itself is easy to use. Just add a filename and some data in the text field under 'add', then click the
    add button. Keep the name under 32 characters though, and avoid non ascii characters. The contracts are really
    simple, to be instructive, so there isn't much error checking in them. Same with the ate script. There will be
    followup tutorials on how to do more advanced stuff, such as error checking and string parsing.

	To get a file, just use the same name as you 'add'ed, and the text should appear in the text area below.
