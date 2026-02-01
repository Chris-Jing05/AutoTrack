#!/bin/bash

# AutoTrack Setup Verification Script
# Run this script to verify your installation

echo "🔍 AutoTrack Setup Verification"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is missing"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is missing"
        return 1
    fi
}

echo "📋 Checking Prerequisites..."
echo ""

# Check Node.js
if check_command node; then
    NODE_VERSION=$(node --version)
    echo "   Version: $NODE_VERSION"
fi

# Check npm
if check_command npm; then
    NPM_VERSION=$(npm --version)
    echo "   Version: $NPM_VERSION"
fi

# Check Python
if check_command python3; then
    PYTHON_VERSION=$(python3 --version)
    echo "   Version: $PYTHON_VERSION"
fi

# Check pip
if check_command pip3; then
    PIP_VERSION=$(pip3 --version)
    echo "   Version: $PIP_VERSION"
fi

echo ""
echo "📁 Checking Project Structure..."
echo ""

# Check frontend files
check_dir "frontend/src"
check_file "frontend/package.json"
check_file "frontend/next.config.js"
check_file "frontend/tailwind.config.ts"

echo ""

# Check backend files
check_dir "backend/api"
check_dir "backend/ml"
check_file "backend/main.py"
check_file "backend/requirements.txt"

echo ""
echo "🔧 Checking Configuration Files..."
echo ""

# Check environment files
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env.local exists"

    # Check if it contains required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" frontend/.env.local; then
        if grep -q "your_supabase" frontend/.env.local; then
            echo -e "${YELLOW}⚠${NC}  frontend/.env.local needs to be configured (contains placeholder values)"
        else
            echo -e "${GREEN}✓${NC} frontend/.env.local appears configured"
        fi
    else
        echo -e "${RED}✗${NC} frontend/.env.local is missing required variables"
    fi
else
    echo -e "${YELLOW}⚠${NC}  frontend/.env.local not found"
    if [ -f "frontend/.env.local.example" ]; then
        echo "   Run: cp frontend/.env.local.example frontend/.env.local"
    fi
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env exists"

    if grep -q "SUPABASE_URL" backend/.env; then
        if grep -q "your_supabase" backend/.env; then
            echo -e "${YELLOW}⚠${NC}  backend/.env needs to be configured (contains placeholder values)"
        else
            echo -e "${GREEN}✓${NC} backend/.env appears configured"
        fi
    else
        echo -e "${RED}✗${NC} backend/.env is missing required variables"
    fi
else
    echo -e "${YELLOW}⚠${NC}  backend/.env not found"
    if [ -f "backend/.env.example" ]; then
        echo "   Run: cp backend/.env.example backend/.env"
    fi
fi

echo ""
echo "📦 Checking Dependencies..."
echo ""

# Check frontend dependencies
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${RED}✗${NC} Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
fi

# Check backend virtual environment
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✓${NC} Backend virtual environment exists"

    # Try to check if dependencies are installed
    if [ -f "backend/venv/bin/python" ]; then
        PACKAGES=$(backend/venv/bin/pip list 2>/dev/null | grep -E "fastapi|transformers|supabase" | wc -l)
        if [ $PACKAGES -gt 0 ]; then
            echo -e "${GREEN}✓${NC} Backend dependencies appear to be installed"
        else
            echo -e "${YELLOW}⚠${NC}  Backend dependencies may not be installed"
            echo "   Run: cd backend && source venv/bin/activate && pip install -r requirements.txt"
        fi
    fi
else
    echo -e "${RED}✗${NC} Backend virtual environment not found"
    echo "   Run: cd backend && python3 -m venv venv"
fi

echo ""
echo "🗄️  Database Setup..."
echo ""

echo -e "${YELLOW}ℹ${NC}  Database setup must be done manually in Supabase"
echo "   1. Go to https://supabase.com"
echo "   2. Create a project"
echo "   3. Run database_schema.sql in SQL Editor"
echo "   4. Copy your API keys to .env files"

echo ""
echo "================================"
echo "📊 Verification Summary"
echo "================================"
echo ""

# Count checks
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Provide next steps
echo "Next Steps:"
echo ""
echo "1. If any prerequisites are missing, install them"
echo "2. Configure .env files with your Supabase credentials"
echo "3. Install dependencies if not already done:"
echo "   - cd frontend && npm install"
echo "   - cd backend && source venv/bin/activate && pip install -r requirements.txt"
echo "4. Set up Supabase database (see SETUP_GUIDE.md)"
echo "5. Start the application:"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Backend: cd backend && python main.py"
echo ""
echo "📖 For detailed instructions, see SETUP_GUIDE.md"
echo ""
