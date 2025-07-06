#!/bin/bash

echo "🚀 DevOps Journey - Local Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm found: $NPM_VERSION"

# Create project directories
print_status "Creating project structure..."
mkdir -p backend/src/{controllers,models,routes,middleware,config}
mkdir -p backend/tests/{unit,integration}
mkdir -p frontend/src/{components,services,contexts}
mkdir -p database/init
mkdir -p scripts
print_success "Project structure created!"

# Install root dependencies
print_status "Installing root dependencies..."
npm install
print_success "Root dependencies installed!"

# Setup backend
print_status "Setting up backend..."
cd backend
if [ ! -f package.json ]; then
    print_error "Backend package.json not found. Please create it first."
    exit 1
fi
npm install
cd ..
print_success "Backend setup completed!"

# Setup frontend
print_status "Setting up frontend..."
if [ ! -d "frontend" ]; then
    print_status "Creating React app..."
    npx create-react-app frontend
    cd frontend
    npm install react-router-dom axios
    cd ..
else
    cd frontend
    npm install
    cd ..
fi
print_success "Frontend setup completed!"

# Check MongoDB
print_status "Checking MongoDB..."
if command -v mongod &> /dev/null; then
    print_success "MongoDB is installed"
else
    print_warning "MongoDB is not installed. Run './scripts/setup-mongodb.sh' to install it."
fi

# Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/*.sh
print_success "Scripts are now executable!"

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    print_status "Creating .gitignore file..."
    cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
/build
/dist
frontend/build/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# MongoDB
/data/db

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
GITIGNORE
    print_success ".gitignore created!"
fi

echo ""
echo "=========================================="
print_success "Setup completed successfully! 🎉"
echo ""
echo "Next steps:"
echo "1. Start MongoDB: mongod --dbpath /data/db"
echo "2. Start the application: npm run dev"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  API Health: http://localhost:5000/health"
echo ""
echo "Commands:"
echo "  npm run dev       - Start both frontend and backend"
echo "  npm run test      - Run all tests"
echo "  npm run lint      - Run linting"
echo "  npm run build     - Build for production"
echo ""
print_status "Happy coding! 🚀"