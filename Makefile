DATABASE_URL:=postgres://postgres:foobarbaz@localhost:5432/postgres

.PHONY: run-postgres
run-postgres:
	@echo Starting PostgreSQL container...
	-docker run \
		-e POSTGRES_PASSWORD=foobarbaz \
		-v pgdata:/var/lib/postgresql/data \
		-p 5432:5432 \
		postgres:18.3-alpine3.23

.PHONY: run-api-node
run-api-node:
	@echo "Starting API Node container..."
	cd api-node && \
		DATABASE_URL=${DATABASE_URL} \
		yarn dev

.PHONY: run-api-golang
run-api-golang:
	@echo "Starting API Golang container..."
	cd api-golang && \
		DATABASE_URL=${DATABASE_URL} \
		go run main.go

.PHONY: run-client-react
run-client-react:
	@echo "Starting Client React container..."
	cd client-react && \
		yarn dev