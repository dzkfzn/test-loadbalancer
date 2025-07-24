# Load Balancer Test App

A simple Bun + Hono application designed for testing load balancers.

## Features

- **Multiple endpoints** for different testing scenarios
- **Health checks** for load balancer monitoring
- **Server identification** in responses (port, instance info)
- **Configurable response delays** for testing timeout handling
- **Error simulation** for testing failure scenarios
- **Server statistics** endpoint
- **CORS enabled** for browser testing

## Installation

```bash
# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install
```

## Usage

### Single Instance
```bash
# Start on default port 3000
bun run dev

# Or production mode
bun run start
```

### Multiple Instances (for load balancer testing)
```bash
# Terminal 1 - Port 3001
bun run start:3001

# Terminal 2 - Port 3002  
bun run start:3002

# Terminal 3 - Port 3003
bun run start:3003
```

### Custom Port
```bash
PORT=8080 bun run start
```

## API Endpoints

### Health Check
- `GET /health` - Returns server health status
  ```json
  {
    "status": "healthy",
    "port": 3001,
    "timestamp": "2025-07-24T...",
    "uptime": 123.456
  }
  ```

### Basic Info
- `GET /` - Returns basic server information
  ```json
  {
    "message": "Load Balancer Test Server",
    "port": 3001,
    "instance": "server-3001",
    "timestamp": "2025-07-24T..."
  }
  ```

### Test Load Distribution
- `GET /test` - Simple endpoint for testing load distribution
  ```json
  {
    "message": "Test endpoint response",
    "port": 3001,
    "instance": "server-3001",
    "requestId": "abc123def",
    "timestamp": "2025-07-24T..."
  }
  ```

### Simulate Delays
- `GET /delay/:ms` - Adds artificial delay (useful for timeout testing)
  ```bash
  curl http://localhost:3001/delay/2000  # 2 second delay
  ```

### Error Simulation
- `GET /error/:code?` - Returns specified HTTP error code
  ```bash
  curl http://localhost:3001/error/500  # Returns 500 error
  curl http://localhost:3001/error/404  # Returns 404 error
  ```

### Server Statistics
- `GET /stats` - Returns server memory usage and uptime
  ```json
  {
    "port": 3001,
    "instance": "server-3001",
    "uptime": 123.456,
    "memory": {
      "rss": "25 MB",
      "heapTotal": "10 MB",
      "heapUsed": "8 MB"
    },
    "timestamp": "2025-07-24T..."
  }
  ```

### Echo Endpoint
- `ALL /echo` - Returns request information (method, headers, body)

## Testing Your Load Balancer

1. **Start multiple instances** on different ports
2. **Configure your load balancer** to distribute traffic between them
3. **Test distribution** by making requests to `/test` and checking the `port` field in responses
4. **Test health checks** using the `/health` endpoint
5. **Test failure handling** using the `/error/:code` endpoints
6. **Test timeout handling** using the `/delay/:ms` endpoints

## Example Load Balancer Test Script

```bash
#!/bin/bash
# Test script to verify load balancing

echo "Testing load balancer distribution..."
for i in {1..10}; do
  curl -s http://your-load-balancer/test | jq .port
done
```

This should show requests being distributed across different port numbers if your load balancer is working correctly.

## Response Headers

All responses include these headers for identification:
- `X-Server-Port`: The port number of the responding server
- `X-Server-Instance`: Instance identifier (e.g., "server-3001")
