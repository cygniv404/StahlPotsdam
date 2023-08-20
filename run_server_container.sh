#!/bin/bash

MONGODB_URL=$MONGODB_URL
SECRET=$SECRET
if [ "$(docker ps -q -f status=running -f name=server)" ]; then
    echo "stop container:"
        docker stop server
    if [ "$(docker ps -aq -f status=exited -f name=server)" ]; then
        echo "remove container:"
        docker rm server
    fi
fi
docker run -d --restart=always --env MONGODB_URL="$MONGODB_URL" --env SECRET="$SECRET" -v /root/stahlhandel/logs:/app/logs -p 127.0.0.1:8080:8080 --name server "$DOCKER_IMAGE"
echo "container restarted successfully!"
