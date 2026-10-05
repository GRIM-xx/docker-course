# DATABASE_URL:=postgresql://postgres:foobarbaz@localhost:5432/postgres # uncomment if running app

### RUN APP

.PHONY: run-postgres run-bun run-golang run-node run-client

run-postgres:
	@echo "Starting PostgreSQL container..."
	-docker run \
		-e POSTGRES_PASSWORD=foobarbaz \
		-v pgdata:/var/lib/postgresql \
		-p 5432:5432 \
		postgres:18.6-alpine

run-bun:
	@echo "Starting bun API container..."
	cd api-bun && \
		DATABASE_URL=${DATABASE_URL} \
		bun start

run-golang:
	@echo "Starting golang API container..."
	cd api-golang && \
		DATABASE_URL=${DATABASE_URL} \
		go run main.go

run-node:
	@echo "Starting node API container..."
	cd api-node && \
		DATABASE_URL=${DATABASE_URL} \
		npm run dev

run-client:
	@echo "Starting client container..."
	cd client && \
		npm run dev


### CONTAINER REGISTRY

.PHONY: build push-dockerhub push-github-packages

build:
	echo "FROM scratch" > Dockerfile
	docker build -t my-scratch-image .
	-rm Dockerfile

push-dockerhub:
	docker tag my-scratch-image kentxki/my-scratch-image
	docker push kentxki/my-scratch-image

	
	docker tag my-scratch-image kentxki/my-scratch-image:abc-123
	docker push kentxki/my-scratch-image:abc-123

push-github-packages:
	docker tag my-scratch-image ghcr.io/grim-xx/my-scratch-image
	docker push ghcr.io/grim-xx/my-scratch-image

	
	docker tag my-scratch-image ghcr.io/grim-xx/my-scratch-image:abc-123
	docker push ghcr.io/grim-xx/my-scratch-image:abc-123

### DOCKER CLI COMMANDS

DATABASE_URL:=postgres://postgres:foobarbaz@db:5432/postgres

DOCKERFILE_DIR:=./dockerfiles

.PHONY: docker-build-all docker-run-all docker-stop docker-rm

docker-build-all:
	docker build -t client-vite -f ${DOCKERFILE_DIR}/client/Dockerfile.0 ./client

	docker build -t client-nginx -f ${DOCKERFILE_DIR}/client/Dockerfile.1 ./client

	docker build -t api-node -f ${DOCKERFILE_DIR}/api-node/Dockerfile.0 ./api-node

	docker build -t api-golang -f ${DOCKERFILE_DIR}/api-golang/Dockerfile ./api-golang

docker-run-all:
	echo "$$DOCKER_COMPOSE_NOTE"

	$(MAKE) docker-stop

	$(MAKE) docker-rm

	docker network create my-network

	docker run -d \
		--name db \
		--network my-network \
		-e POSTGRES_PASSWORD=foobarbaz \
		-v pgdata:/var/lib/postgresql \
		-p 5432:5432 \
		--restart unless-stopped \
		postgres:18.6-alpine

	docker run -d \
		--name api-node \
		--network my-network \
		-e DATABASE_URL=${DATABASE_URL} \
		-p 3000:3000 \
		--restart unless-stopped \
		api-node

	docker run -d \
		--name api-golang \
		--network my-network \
		-e DATABASE_URL=${DATABASE_URL} \
		-p 8080:8080 \
		--restart unless-stopped \
		api-golang

	docker run -d \
		--name client-vite \
		--network my-network \
		-v ${PWD}/running-containers/vite.config.js:/usr/src/app/vite.config.js \
		-p 5173:5173 \
		--restart unless-stopped \
		client-vite

	docker run -d \
		--name client-nginx \
		--network my-network \
		-p 80:8080 \
		--restart unless-stopped \
		client-nginx

docker-stop:
	-docker stop db
	-docker stop api-node
	-docker stop api-golang
	-docker stop client-vite
	-docker stop client-nginx

docker-rm:
	-docker container rm db
	-docker container rm api-node
	-docker container rm api-golang
	-docker container rm client-vite
	-docker container rm client-nginx
	-docker network rm my-network


define DOCKER_COMPOSE_NOTE

🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

❯ NOTE:

This command runs the example app with a bunch
of individual docker run commands. This is much
easier to manage with docker-compose (see 
docker-compose.yml and compose make targets above)

🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

endef
export DOCKER_COMPOSE_NOTE

### DOCKER COMPOSE COMMAND DEPLOYMENT

DEV_COMPOSE_FILE=docker-compose-dev.yml
DEBUG_COMPOSE_FILE=docker-compose-debug.yml
TEST_COMPOSE_FILE=docker-compose-test.yml

### DOCKER COMPOSE COMMANDS

.PHONY: compose-build compose-up compose-up-build compose-down run-tests

compose-build:
	docker compose -f $(DEV_COMPOSE_FILE) build

compose-up:
	docker compose -f $(DEV_COMPOSE_FILE) up

compose-up-build:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

compose-up-debug-build:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(DEBUG_COMPOSE_FILE) up --build

compose-down:
	docker compose -f $(DEV_COMPOSE_FILE) down

### DOCKER COMPOSE TEST COMMANDS

run-tests:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --build api-golang
	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --build api-node

### DEPLOYING CONTAINERS

VM_IP?=54.179.151.132
DOCKER_HOST:="ssh://ubuntu@${VM_IP}"

DOCKER_SWARM_FILE:=docker-swarm/docker-swarm.yml

.PHONY: build-push swarm-init swarm-deploy-stack swarm-ls swarm-remove-stack create-secrets delete-secrets

build-push:
	cd ./dockerfiles/client && N=1 $(MAKE) build-N && N=1 $(MAKE) push-N
	cd ./dockerfiles/api-node && N=2 $(MAKE) build-N && N=2 $(MAKE) push-N
	cd ./dockerfiles/api-golang && N=1 $(MAKE) build-N && N=1 $(MAKE) push-N

swarm-init:
	DOCKER_HOST=${DOCKER_HOST} docker swarm init

swarm-deploy-stack:
	DOCKER_HOST=${DOCKER_HOST} docker stack deploy -c $(DOCKER_SWARM_FILE) docker-course

swarm-ls:
	DOCKER_HOST=${DOCKER_HOST} docker service ls

swarm-remove-stack:
	DOCKER_HOST=${DOCKER_HOST} docker stack rm docker-course

create-secrets:
	printf "foobarbaz" | DOCKER_HOST=${DOCKER_HOST} docker secret create postgres-passwd -
	printf "postgres://postgres:foobarbaz@db:5432/postgres" | DOCKER_HOST=${DOCKER_HOST} docker secret create database-url -

delete-secrets:
	DOCKER_HOST=${DOCKER_HOST} docker secret rm postgres-passwd database-url

redeploy-all:
	-$(MAKE) swarm-remove-stack
	-$(MAKE) delete-secrets
	@sleep 3
	-$(MAKE) create-secrets
	-$(MAKE) swarm-deploy-stack
