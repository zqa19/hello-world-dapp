#!/bin/sh

fig up -d helloworldchain
helloworldchain=$(fig ps -q helloworldchain)
export BLOCKCHAIN_ID=$(docker exec $helloworldchain epm plop chainid)
export ROOT_CONTRACT=$(docker exec $helloworldchain epm plop vars | cut -d : -f 2)

fig up -d seleniumnode
# fig run helloworldtest
