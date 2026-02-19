#!/bin/bash

echo "========================================"
echo " Energy Trading Blockchain Service Setup"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
echo -e "${BLUE}Checking Python installation...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo -e "${GREEN}Found Python $PYTHON_VERSION${NC}"

# Navigate to blockchain-service directory
cd "$(dirname "$0")" || exit

# Create virtual environment
echo -e "${BLUE}Creating virtual environment...${NC}"
python3 -m venv venv

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Upgrade pip
echo -e "${BLUE}Upgrading pip...${NC}"
pip install --upgrade pip

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env file created. Please update it with your configuration.${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo "Setup completed successfully!"
echo "========================================${NC}"
echo ""
echo "To start the blockchain service:"
echo "1. Activate virtual environment:"
echo "   source venv/bin/activate   (Linux/Mac)"
echo "   venv\\Scripts\\activate     (Windows)"
echo "2. Run the service:"
echo "   python app.py"
echo ""
echo "Service will be available at: http://localhost:5001"
