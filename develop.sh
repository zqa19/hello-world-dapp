#!/bin/sh

docker-compose up -d seleniumnode
sleep 60

cd test
  npm install
cd ..

docker-compose up --no-recreate -d helloworldtest
