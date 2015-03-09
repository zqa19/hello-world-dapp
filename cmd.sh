#!/bin/sh

cd ~/.decerver/source

if [ -z $BLOCKCHAIN_ID ]; then
  # Create our own blockchain.
  
  echo BLOCKCHAIN_ID not set, creating new chain.  
  epm install --genesis contracts/genesis.json . helloworld

  # Now we need to tell the DApp about our chain and then we’re ready to VRoom.

  BLOCKCHAIN_ID=$(epm plop chainid)
  ROOT_CONTRACT=$(epm plop vars | cut -d : -f 2)

  epm config fetch_port:${FETCH_PORT:=50505}
else
  cd contracts
  sleep 5
  epm fetch --checkout --name helloworld helloworldmaster:${FETCH_PORT:=50505}
  cd ..
fi

echo "Configuring package.json with BLOCKCHAIN_ID ($BLOCKCHAIN_ID) and "
echo "ROOT_CONTRACT ($ROOT_CONTRACT)."

mv package.json /tmp/

jq '.module_dependencies[0].data |= . * {BLOCKCHAIN_ID: "'$BLOCKCHAIN_ID'", ROOT_CONTRACT: "'$ROOT_CONTRACT'"}' /tmp/package.json \
  > package.json

# Configure EPM.

key_session="$(strings /dev/urandom | grep -o '[[:alnum:]]' | head -n 10 | tr -d '\n' ; echo)"

epm config key_session:${KEY_SESSION:=key_session} \
  local_host:${LOCAL_HOST:=0.0.0.0} \
  local_port:${LOCAL_PORT:=15254} \
  max_peers:${MAX_PEERS:=10}

# put the helloworld DApp in focus
sleep 5 && curl http://localhost:3000/admin/switch/helloworld &

decerver
