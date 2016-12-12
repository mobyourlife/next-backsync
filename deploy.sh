#!/bin/sh

docker rm -f mobyourlife-backsync
docker rmi -f mobyourlife-backsync

docker build -t mobyourlife-backsync .

docker run \
  --name mobyourlife-backsync \
  --restart=always \
  --link mob-db-mongo:db \
  --link mob-mq-rabbit:mq \
  -e MOB_MONGO_FACEBOOK_DATABASE='mongodb://db:27017/mobyourlife_facebook' \
  -e MOB_RABBITMQ_URL='amqp://mq' \
  -d \
  mobyourlife-backsync