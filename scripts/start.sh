#!/bin/bash
set -e

ENV=${1:-dev}

echo "🚀 Starting DevOps Journey in $ENV mode..."

if [ "$ENV" = "prod" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    docker-compose up -d
fi

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🔍 Checking service health..."
docker-compose ps

echo ""
echo "✅ Application started successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "📋 Management commands:"
echo "   npm run logs     - View logs"
echo "   npm run status   - Check status"
echo "   npm run stop     - Stop services"