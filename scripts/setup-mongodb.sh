#!/bin/bash

echo "🍃 Setting up MongoDB for DevOps Journey..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}❌ MongoDB is not installed. Installing MongoDB...${NC}"
    
    # Detect OS and install MongoDB
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew tap mongodb/brew
            brew install mongodb-community
        else
            echo -e "${RED}❌ Homebrew not found. Please install MongoDB manually.${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux (Ubuntu/Debian)
        if command -v apt-get &> /dev/null; then
            # Check if Ubuntu/Debian version is 22.04 or later
            if [[ $(lsb_release -rs) == "22.04" || $(lsb_release -rs) > "22.04" ]]; then
                echo -e "${YELLOW}ℹ️ Ubuntu 22.04+ detected - using official MongoDB repository${NC}"
                
                # Install prerequisites
                sudo apt-get install -y wget gnupg
                
                # Import MongoDB public GPG key
                wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
                
                # Create list file for MongoDB
                echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
                
                # Update package database
                sudo apt-get update
                
                # Install MongoDB
                sudo apt-get install -y mongodb-org
                
                # Start and enable service
                sudo systemctl start mongod
                sudo systemctl enable mongod
            else
                # Older Ubuntu versions
                sudo apt-get update
                sudo apt-get install -y mongodb
            fi
        elif command -v yum &> /dev/null; then
            # RHEL/CentOS
            sudo yum install -y mongodb mongodb-server
        else
            echo -e "${RED}❌ Package manager not supported. Please install MongoDB manually.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ OS not supported. Please install MongoDB manually.${NC}"
        exit 1
    fi
fi

# Verify MongoDB installation
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}❌ MongoDB installation failed. Please install manually.${NC}"
    exit 1
fi

# Create MongoDB data directory
echo -e "${YELLOW}ℹ️ Creating MongoDB data directory...${NC}"
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

# Check if MongoDB is running
if pgrep mongod > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is already running${NC}"
else
    echo -e "${YELLOW}ℹ️ Starting MongoDB...${NC}"
    mongod --dbpath /data/db --fork --logpath /tmp/mongod.log
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to start MongoDB. Check /tmp/mongod.log for details${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ MongoDB setup completed!${NC}"
echo ""
echo "To start MongoDB manually:"
echo "  mongod --dbpath /data/db --fork --logpath /tmp/mongod.log"
echo ""
echo "To connect to MongoDB:"
echo "  mongosh"
echo ""
echo "To stop MongoDB:"
echo "  pkill mongod"