
if [ -z $1 ]; then
  NAME=$(basename $(pwd))
else
  NAME=$1
fi

docker exec -it $NAME /bin/bash