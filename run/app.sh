

./run/api.sh
#::::::::::::::::: APP :::::::::::::::::
PORT=3000
cd app 
# check if yarn is even installed
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi
cd app
echo "START(APP PORT=$PORT )"
npm run build
npm run start -- -p $PORT