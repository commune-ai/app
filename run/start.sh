
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
PARAMS=" --name $NAME -d  --restart unless-stopped --privileged -p 3000:3000 -p 8000:8000 -v $REPO_PATH:/app"

# get the full path of the commune folder
COMMUNE_PATH=$(realpath ~/commune)
PARAMS="$PARAMS -v /var/run/docker.sock:/var/run/docker.sock -v $COMMUNE_PATH:/commune"
docker run $PARAMS $IMAGE_NAME

docker logs -f $NAME

