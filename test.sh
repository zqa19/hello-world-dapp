#!/bin/sh

set -o errexit

# CircleCI doesn't support 'docker exec'.
if [ -n "$CI" ]; then
  docker_exec() {
    sudo lxc-attach -n $(docker-compose ps -q $1) -- bash -c HOME=/root "$2"
  }
else
  docker_exec() {
    docker exec $(docker-compose ps -q $1) $2
  }
fi

# Clean buildpack artifacts out of the source directory.
cd source
  rm -rf .heroku .profile.d node_modules node-v* Procfile vendor
cd ..

# Start up IPFS so we can load the source code into it.
docker-compose up -d ipfs
sleep 20

export SOURCE=$(docker_exec ipfs "/go/bin/ipfs add -recursive -quiet /srv" \
  | tail -n -1 | tr -d '\r')

echo Loaded source code into IPFS at $SOURCE.

docker-compose up -d seleniumnode
sleep 60

cd test
  npm install
cd ..

docker-compose run helloworldtest npm test
