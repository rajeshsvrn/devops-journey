#!/bin/bash

echo "📋 DevOps Journey - Container Logs"
echo "=================================="

# Show logs for all services
if [ -z "$1" ]; then
    echo "Showing logs for all services..."
    docker-compose logs -f
else
    echo "Showing logs for service: $1"
    docker-compose logs -f "$1"
fi