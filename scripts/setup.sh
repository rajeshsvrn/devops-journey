#!/bin/bash
set -e

echo "🚀 Setting up DevOps Journey Application..."

# Check dependencies
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required"; exit 1; }

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Setup completed!"
echo ""
echo "Commands:"
echo "  npm run dev      - Start development environment"
echo "  npm run prod     - Start production environment"  
echo "  npm run logs     - View logs"
echo "  npm run status   - Check container status"
echo "  npm run health   - Check application health"