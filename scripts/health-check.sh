#!/bin/bash

echo "🔍 DevOps Journey Health Check"
echo "=============================="

# Check containers
echo "📦 Container Status:"
docker-compose ps

echo ""
echo "🔗 Service Health:"

# Backend health
if curl -s http://localhost:5000/health >/dev/null; then
    echo "✅ Backend: Healthy"
    curl -s http://localhost:5000/health | jq .
else
    echo "❌ Backend: Unhealthy"
fi

echo ""

# Frontend health
if curl -s http://localhost:3000 >/dev/null; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi

echo ""

# Database health
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Unhealthy"
fi