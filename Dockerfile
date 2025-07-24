# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb (if available)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src

# Expose the default port
EXPOSE 3000

# Set default environment variable
ENV PORT=3000

# Run the application
CMD ["bun", "run", "src/index.ts"]
