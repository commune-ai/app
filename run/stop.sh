
if [ $# -eq 0 ]; then
  NAME=$(basename $(pwd))
else
  NAME=$1
fi
if [ $(docker ps -q -f name=$NAME)   ]; then
  echo "STOPING(name=$NAME id=$ID)"
  docker kill $NAME
  docker rm $NAME
fi
