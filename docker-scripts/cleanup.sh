#!/bin/bash

echo "🧹 Cleaning up DevOps Journey Docker resources..."

# Stop and remove containers
echo "Stopping containers..."
docker-compose down

# Remove images
echo "Removing images..."
docker rmi devops-journey-backend:latest devops-journey-frontend:latest 2>/dev/null || true

# Remove volumes (optional - uncomment if you want to remove data)
# echo "Removing volumes..."
# docker volume rm devops-journey_mongodb_data 2>/dev/null || true

# Remove network
echo "Removing network..."
docker network rm devops-journey_devops-network 2>/dev/null || true

# Cleanup unused resources
echo "Cleaning up unused Docker resources..."
docker system prune -f

echo "✅ Cleanup completed!"