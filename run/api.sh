#::::::::::::::::: API :::::::::::::::::

PORT=8000
# START API
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
  echo "port $PORT is already in use"
else
  c serve api port=$PORT
fi

