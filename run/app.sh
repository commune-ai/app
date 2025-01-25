#::::::::::::::::: API :::::::::::::::::

API_PORT=8000
# START API
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
  echo "port $PORT is already in use"
else
  c serve api port=$PORT
fi

#::::::::::::::::: APP :::::::::::::::::

APP_PORT=3000
cd app 
# check if yarn is even installed
if ! [ -x "$(command -v yarn)" ]; then
  echo 'Error: yarn is not installed.' >&2
  exit 1
fi
cd app
echo "START(name=app app_port=$APP_PORT api_port=$API_PORT)"
yarn dev --port $APP_PORT