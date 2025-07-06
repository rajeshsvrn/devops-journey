#!/bin/bash

echo "🧪 Running tests for DevOps Journey..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Backend tests
print_status "Running backend tests..."
cd backend
if npm test; then
    print_success "Backend tests passed!"
else
    print_error "Backend tests failed!"
    BACKEND_FAILED=1
fi
cd ..

# Frontend tests
print_status "Running frontend tests..."
cd frontend
if npm test -- --watchAll=false; then
    print_success "Frontend tests passed!"
else
    print_error "Frontend tests failed!"
    FRONTEND_FAILED=1
fi
cd ..

# Summary
echo ""
echo "Test Summary:"
if [ -z "$BACKEND_FAILED" ] && [ -z "$FRONTEND_FAILED" ]; then
    print_success "All tests passed! ✅"
    exit 0
else
    print_error "Some tests failed! ❌"
    exit 1
fi

chmod +x *.sh