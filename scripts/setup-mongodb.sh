#!/bin/bash

echo "🍃 Setting up MongoDB for DevOps Journey..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Installing MongoDB..."
    
    # Detect OS and install MongoDB
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew tap mongodb/brew
            brew install mongodb-community
        else
            echo "❌ Homebrew not found. Please install MongoDB manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux (Ubuntu/Debian)
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y mongodb
        elif command -v yum &> /dev/null; then
            # RHEL/CentOS
            sudo yum install -y mongodb mongodb-server
        else
            echo "❌ Package manager not supported. Please install MongoDB manually."
            exit 1
        fi
    else
        echo "❌ OS not supported. Please install MongoDB manually."
        exit 1
    fi
fi

# Create MongoDB data directory
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

echo "✅ MongoDB setup completed!"
echo "To start MongoDB:"
echo "  mongod --dbpath /data/db"
echo ""
echo "To connect to MongoDB:"
echo "  mongosh"