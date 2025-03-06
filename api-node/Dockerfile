# === Base Stage ===
# Use a minimal Node.js image as the base for building and running the application
FROM node:23-bookworm-slim AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the dependency files first to optimize layer caching
COPY package.json yarn.lock ./

# === Development Stage ===
FROM base AS dev

# Install dependencies using cache mount for faster builds
RUN --mount=type=cache,target=/usr/src/app/.yarn \
    yarn config set cache-folder /usr/src/app/.yarn && \
    yarn install --frozen-lockfile

# Copy the entire source code for development
COPY . .

# Default command for development (hot reloading, if applicable)
CMD [ "yarn", "dev" ]

# === Production Stage ===
FROM base AS prod

# Set the environment variable to production mode
ENV NODE_ENV=production

# Install only production dependencies using cache mount
RUN --mount=type=cache,target=/usr/src/app/.yarn \
    yarn config set cache-folder /usr/src/app/.yarn && \
    yarn install --frozen-lockfile --production

# Copy only necessary files for production (avoids extra files in the final image)
COPY --chown=node:node healthcheck .  
COPY --chown=node:node src .

# Switch to a non-root user for better security
USER node

# Expose the application port
EXPOSE 3000

# Run the application
CMD [ "node", "index.js" ]
