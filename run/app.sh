

./run/api.sh
#::::::::::::::::: APP :::::::::::::::::
PORT=3000
cd app 
# check if yarn is even installed
if ! [ -x "$(command -v yarn)" ]; then
  echo 'Error: yarn is not installed.' >&2
  exit 1
fi
cd app
echo "START(APP PORT=$PORT )"
yarn dev --port $PORT