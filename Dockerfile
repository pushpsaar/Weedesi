# Use Node 22 LTS
FROM node:22-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package manifests first for efficient caching
COPY package.json package-lock.json* ./

# Install dependencies (prepares better-sqlite3 native build if needed)
RUN npm ci --ignore-scripts=false --no-audit --no-fund

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# Default command prints build success and exits
CMD ["/bin/bash","-lc","echo build-ready && ls -la .next || true"]
