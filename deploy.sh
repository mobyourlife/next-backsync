#!/bin/sh

docker rm -f mobyourlife-backsync
docker rmi -f mobyourlife-backsync

docker build -t mobyourlife-backsync .

docker run \
  --name mobyourlife-backsync \
  --restart=always \
  --link mob-db-mongo:db \
  --link mob-mq-rabbit:mq \
  --link mob-admin-telegraf:telegraf \
  -e MOB_MONGO_FACEBOOK_DATABASE='mongodb://db:27017/mobyourlife_facebook' \
  -e MOB_RABBITMQ_URL="amqp://$MOB_RABBITMQ_USERNAME:$MOB_RABBITMQ_PASSWORD@mq" \
  -e MOB_TELEGRAF_HOSTNAME='telegraf' \
  -e FACEBOOK_APP_ID=$FACEBOOK_APP_ID \
  -e FACEBOOK_APP_SECRET=$FACEBOOK_APP_SECRET \
  -d \
  mobyourlife-backsync

docker logs -f mobyourlife-backsync
