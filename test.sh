#!/bin/sh
fig kill helloworldmaster helloworldwrite
fig rm --force helloworldmaster helloworldwrite
fig build helloworldmaster helloworldwrite
fig up -d helloworldmaster
helloworldmaster=$(fig ps -q helloworldmaster)

export BLOCKCHAIN_ID=$(docker exec $helloworldmaster epm plop chainid)

export ROOT_CONTRACT=$(docker exec $helloworldmaster epm plop vars \
  | cut -d : -f 2)

fig up -d --no-recreate seleniumnode
# fig run helloworldtest
