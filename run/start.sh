
REPO_PATH=$(pwd) ;  
IMAGE_NAME=$(basename $REPO_PATH)
if [ -z $1 ]; then
  NAME=$IMAGE_NAME
else
  NAME=$1
fi
if [ $(docker ps -q -f name=$NAME) ]; then
  ./run/stop.sh $NAME
fi
echo "STARTING($NAME image=$IMAGE_NAME)"
docker run --name $NAME -d  --restart unless-stopped --privileged \
  -p 3000:3000 \
  -v $REPO_PATH:/app \
  $IMAGE_NAME

docker logs -f $NAME

