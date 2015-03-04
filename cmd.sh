#!/bin/sh

cd ~/.decerver/source

if [ -z $BLOCKCHAIN_ID ]; then
  # Create our own blockchain.
  
  echo BLOCKCHAIN_ID not set, creating new chain.  
  epm install --genesis contracts/genesis.json . helloworld

  # Now we need to tell the DApp about our chain and then we’re ready to VRoom.

  BLOCKCHAIN_ID=$(epm plop chainid)
  ROOT_CONTRACT=$(epm plop vars | cut -d : -f 2)
fi

echo "Configuring package.json with BLOCKCHAIN_ID ($BLOCKCHAIN_ID) and "
echo "ROOT_CONTRACT ($ROOT_CONTRACT)."

mv package.json /tmp/

jq '.module_dependencies[0].data |= . * {BLOCKCHAIN_ID: "'$BLOCKCHAIN_ID'", ROOT_CONTRACT: "'$ROOT_CONTRACT'"}' /tmp/package.json \
  > package.json

# put the helloworld DApp in focus
sleep 5 && curl http://localhost:3000/admin/switch/helloworld &

decerver
