
# if the lock file exists, then the app is already running

echo "STARTING(api)"
c serve api
c kill_port 3000

echo "STARTING(app)"


APP_PATH=$(pwd)/app
cd $APP_PATH

# if yarn.lock does not exist then install yarn 

# check if yarn is installed

if [ ! -f "yarn.lock" ]; then
  yarn install
fi


IS_YARN_LOCK=$(ls -A app/yarn.lock)
if [ -z "$IS_YARN_LOCK" ]; then
  echo "yarn.lock not found, using npm"
  yarn install
fi
yarn dev
