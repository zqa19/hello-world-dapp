#!/bin/sh

# convenience methods during rapid testing
docker-compose kill helloworldwrite helloworldread
docker-compose rm --force helloworldwrite helloworldread
docker-compose build helloworldwrite helloworldread

# start the background containers
docker-compose up --no-recreate -d compilers ipfs helloworldmaster
sleep 5 # give the master a bit of time to get everything sorted

# start the writer
docker-compose up --no-recreate -d helloworldwrite
sleep 30 # give the writer time to catch up with master and deploy contracts

# grab the root contract from the writer
helloworldwrite=$(docker-compose ps -q helloworldwrite)
export ROOT_CONTRACT=$(docker exec $helloworldwrite echo $ROOT_CONTRACT)

# helpful for debugging
echo ""
echo ""
echo "Hello World Writer's DOUG Contract is at:"
echo $ROOT_CONTRACT
echo ""

# start the reader
docker-compose up --no-recreate helloworldread

# @nodeguy not sure how you want to run the selenium tests, but its all ready for you now
# docker-compose up -d --no-recreate seleniumnode
# docker-compose run helloworldtest
