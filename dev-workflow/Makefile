APP_NAME=docker-course-app

DEV_COMPOSE_FILE=docker-compose.yml
DEBUG_COMPOSE_FILE=docker-compose-debug.yml
TEST_COMPOSE_FILE=docker-compose-test.yml

### DOCKER COMPOSE COMMANDS

.PHONY: compose-build-dev
compose-build-dev:
	docker compose -f $(DEV_COMPOSE_FILE) --profile dev build

.PHONY: compose-build-prod
compose-build-prod:
	docker compose -f $(DEV_COMPOSE_FILE) --profile production build

.PHONY: compose-up-dev
compose-up-dev:
	docker compose -f $(DEV_COMPOSE_FILE) --profile dev up --build

.PHONY: compose-up-prod
compose-up-prod:
	docker compose -f $(DEV_COMPOSE_FILE) --profile production up --build

.PHONY: compose-up-debug
compose-up-debug:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(DEBUG_COMPOSE_FILE) --profile dev up --build

###

.PHONY: down remove-containers remove-images remove-volumes remove-networks remove-all

down:
	docker compose -f $(DEV_COMPOSE_FILE) down

remove-containers:
	docker rm -f $$(docker ps -a -q --filter "name=$(APP_NAME)") || true

remove-images:
	docker rmi -f $$(docker images -q --filter "reference=client-react-vite") || true
	docker rmi -f $$(docker images -q --filter "reference=client-react-nginx") || true
	docker rmi -f $$(docker images -q --filter "reference=api-node") || true
	docker rmi -f $$(docker images -q --filter "reference=api-node-prod") || true
	docker rmi -f $$(docker images -q --filter "reference=api-golang") || true
	docker rmi -f $$(docker images -q --filter "reference=api-golang-prod") || true
	docker rmi -f $$(docker images -q --filter "reference=postgres:18.3-alpine3.22") || true

remove-volumes:
	docker volume rm -f $(APP_NAME)_pgdata || true

remove-networks:
	docker network rm $(APP_NAME)_frontend || true
	docker network rm $(APP_NAME)_backend || true

remove-all: down remove-containers remove-images remove-volumes remove-networks
	@echo "$(APP_NAME) cleanup complete!"

###

.PHONY: run-tests
run-tests:
# 	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --build --remove-orphans api-node
# 	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --build --remove-orphans api-golang
	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --rm --build api-node &
	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --rm --build api-golang &
	wait