#!/bin/bash

echo "🚀 Starting DevOps Journey Application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if MongoDB is running
print_status "Checking MongoDB connection..."
if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
    print_success "MongoDB is running!"
else
    print_warning "MongoDB is not running. Please start it with: mongod --dbpath /data/db"
    echo "Do you want to continue without MongoDB? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start the application
print_status "Starting backend and frontend..."
npm run dev