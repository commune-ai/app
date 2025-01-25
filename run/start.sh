
REPO_PATH=$(pwd) ;  
IMAGE_NAME=$(basename $REPO_PATH)
if [ -z $1 ]; then
  NAME=$IMAGE_NAME
else
  NAME=$1
fi
if [ $(docker ps -q -f name=$NAME) ]; then
  ./run/stop.sh
fi

echo "STARTING($NAME)"

# entry point to the container as a daemon
# expose 3000 port to the host
eval "docker run  \
  --name $NAME \
  -p 3000:3000 \
  --restart unless-stopped --privileged \
  -v ~/commune:/commune -v ~/.commune:/root/.commune\
  -v $REPO_PATH:/app\
  $IMAGE_NAME"

