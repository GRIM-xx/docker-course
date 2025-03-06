# === Base Stage: Build Dependencies ===
# Use an official Golang image as the base for building the application
FROM golang:1.24.0-bookworm AS build-base

# Set the working directory inside the container
WORKDIR /app 

# Copy only the dependency files first to optimize layer caching
COPY go.mod go.sum ./

# Download Go modules using cache mounts to speed up dependency installation
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download

# === Development Stage ===
# Create a separate stage for development dependencies
FROM build-base AS dev

# Install Air for hot reloading and Delve for debugging
RUN go install github.com/air-verse/air@latest && \
    go install github.com/go-delve/delve/cmd/dlv@latest

# Copy the entire source code for development
COPY . . 

# Default command for development (hot reloading)
CMD ["air", "-c", ".air.toml"]

# === Production Build Stage ===
FROM build-base AS prod

# Create a non-root user for security
RUN useradd -u 1001 nonroot

# Copy the entire source code for production build
COPY . . 

# Build the healthcheck binary as a statically linked executable
RUN go build \
    -ldflags="-linkmode external -extldflags -static" \
    -tags netgo \
    -o healthcheck ./healthcheck/healthcheck.go

# Build the main API binary as a statically linked executable
RUN go build \
    -ldflags="-linkmode external -extldflags -static" \
    -tags netgo \
    -o api-golang

# === Minimal Production Image ===
FROM scratch

# Set the Gin framework to production mode
ENV GIN_MODE=release

# Set the working directory inside the container
WORKDIR /

# Copy the necessary system files (for non-root user support)
COPY --from=prod /etc/passwd /etc/passwd

# Copy the pre-built healthcheck and API binaries from the build stage
COPY --from=prod /app/healthcheck/healthcheck healthcheck
COPY --from=prod /app/api-golang api-golang

# Switch to the non-root user for security
USER nonroot

# Expose the API port
EXPOSE 8080

# Run the API binary as the container's main process
CMD ["/api-golang"]
