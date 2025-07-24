# Multi-stage build for production
FROM oven/bun:1 as builder

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine as production

# Set working directory
WORKDIR /app

# Copy only the built application and package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Create non-root user
RUN addgroup -g 1001 -S bunjs && \
    adduser -S bunjs -u 1001

# Change ownership of the app directory
RUN chown -R bunjs:bunjs /app
USER bunjs

# Expose the port
EXPOSE 3000

# Set default environment variable
ENV PORT=3000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run the built application
CMD ["bun", "run", "dist/index.js"]
