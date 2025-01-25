
# if the lock file exists, then the app is already running
APP_PATH=$(pwd)/app
cd $APP_PATH
IS_YARN_LOCK=$(ls -A app/yarn.lock)
if [ -z "$IS_YARN_LOCK" ]; then
  echo "yarn.lock not found, using npm"
  yarn install
fi
yarn dev
