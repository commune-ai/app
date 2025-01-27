

RUN_PATH=./run

# CHMOD: change the mode of the scripts
chmod:
	chmod +x ${RUN_PATH}/*
# BUILD: build the app
build:
	${RUN_PATH}/build.sh 
# START: start the app
start:
	${RUN_PATH}/start.sh 
# STOP: stop the app
stop:
	${RUN_PATH}/stop.sh 
# RESTART: restart the app
enter:
	${RUN_PATH}/enter.sh
# TEST: test the app
test:
	${RUN_PATH}/test.sh
up: 
	make start
down:
	make stop

