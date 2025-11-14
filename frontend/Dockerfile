# Frontend Dockerfile - Multi-stage build for React/Vite app
# Stage 1: Build stage - Build React app
FROM node:20-alpine as builder

WORKDIR /build

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies (using npm as fallback, bun.lockb is a lock file indicator)
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Runtime - Serve with lightweight web server
FROM node:20-alpine

WORKDIR /app

# Install serve to run static files in production
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /build/dist ./dist

# Create non-root user for security
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD npm list serve > /dev/null || exit 1

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3000"]
