
REPO_PATH=$(pwd) ;  
CONTAINER_NAME=$(basename $REPO_PATH)
if [ -z $1 ]; then
  NAME=$NAME
else
  CONTAINER_NAME=$1
fi
if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
  ./scripts/stop.sh
fi

echo "STARTING($CONTAINER_NAME)"

eval "docker run -d \
  --name $CONTAINER_NAME \
  --network=host --restart unless-stopped --privileged \
  -v ~/commune:/commune -v ~/.commune:/root/.commune \  
  -v $REPO_PATH:/app\
  $NAME"

