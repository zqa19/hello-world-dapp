#!/bin/sh

cd ~/.decerver/source

if [ -z $BLOCKCHAIN_ID ]; then
  # Create our own blockchain.
  
  echo BLOCKCHAIN_ID not set, creating new chain.  
  epm install --genesis contracts/genesis.json . helloworld

  # Now we need to tell the DApp about our chain and then we’re ready to VRoom.

  BLOCKCHAIN_ID=$(epm plop chainid)
  ROOT_CONTRACT=$(epm plop vars | cut -d : -f 2)

  epm config fetch_port:50505
else
  mv package.json /tmp/

  jq '.module_dependencies[0].data |= . * {peer_server_address: "helloworldmaster:15256", blockchain_id: "'$BLOCKCHAIN_ID'", root_contract: "'$ROOT_CONTRACT'"}' /tmp/package.json \
    > package.json

  cd contracts
  sleep 60
  epm fetch --checkout --name helloworld helloworldmaster:50505
  cd ..
  epm install --no-new . helloworld
fi

echo "Configuring package.json with BLOCKCHAIN_ID ($BLOCKCHAIN_ID) and "
echo "ROOT_CONTRACT ($ROOT_CONTRACT)."

# Configure EPM.

key_session="$(strings /dev/urandom | grep -o '[[:alnum:]]' | head -n 10 | tr -d '\n' ; echo)"

epm config key_session:${KEY_SESSION:=key_session} \
  local_host:${LOCAL_HOST:=0.0.0.0} \
  local_port:${LOCAL_PORT:=15254} \
  max_peers:${MAX_PEERS:=10}

# put the helloworld DApp in focus
sleep 5 && curl http://localhost:3000/admin/switch/helloworld &

decerver
