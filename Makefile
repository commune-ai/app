
# Docker compose commands
up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-app:
	docker-compose logs -f app

# Enter containers
enter-api:
	docker exec -it hub_api /bin/bash

enter-app:
	docker exec -it hub_app /bin/bash

# Development shortcuts
dev: up logs

stop: down
