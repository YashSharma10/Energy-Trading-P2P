#!/bin/bash

echo "========================================"
echo " Energy Trading P2P - Complete Startup"
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    if command_exists lsof; then
        lsof -i:$1 >/dev/null 2>&1
    elif command_exists netstat; then
        netstat -tuln | grep ":$1 " >/dev/null 2>&1
    else
        return 1
    fi
}

echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check Python
if ! command_exists python3; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python $(python3 --version)${NC}"

# Check MongoDB
if ! command_exists mongod; then
    echo -e "${YELLOW}⚠ MongoDB not found. Make sure MongoDB is running.${NC}"
fi

echo ""
echo -e "${BLUE}Starting services...${NC}"
echo ""

# 1. Start Blockchain Service
echo -e "${BLUE}[1/4] Starting Blockchain Service...${NC}"
cd "$PROJECT_ROOT/blockchain-service"

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Running setup...${NC}"
    bash setup.sh
fi

if port_in_use 5001; then
    echo -e "${YELLOW}Port 5001 already in use. Blockchain service may already be running.${NC}"
else
    source venv/bin/activate || source venv/Scripts/activate
    nohup python app.py > blockchain.log 2>&1 &
    BLOCKCHAIN_PID=$!
    echo $BLOCKCHAIN_PID > blockchain.pid
    echo -e "${GREEN}✓ Blockchain service started (PID: $BLOCKCHAIN_PID)${NC}"
    deactivate || true
fi

sleep 3

# 2. Start Blockchain Mining Worker
echo -e "${BLUE}[2/4] Starting Mining Worker...${NC}"
cd "$PROJECT_ROOT/blockchain-service"
source venv/bin/activate || source venv/Scripts/activate
nohup python worker.py > worker.log 2>&1 &
WORKER_PID=$!
echo $WORKER_PID > worker.pid
echo -e "${GREEN}✓ Mining worker started (PID: $WORKER_PID)${NC}"
deactivate || true

sleep 2

# 3. Start Node.js Server
echo -e "${BLUE}[3/4] Starting Node.js Server...${NC}"
cd "$PROJECT_ROOT/server"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    npm install
fi

if port_in_use 3000; then
    echo -e "${YELLOW}Port 3000 already in use. Server may already be running.${NC}"
else
    nohup npm run dev > server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > server.pid
    echo -e "${GREEN}✓ Node.js server started (PID: $SERVER_PID)${NC}"
fi

sleep 3

# 4. Start React Client
echo -e "${BLUE}[4/4] Starting React Client...${NC}"
cd "$PROJECT_ROOT/client"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    npm install
fi

if port_in_use 5173; then
    echo -e "${YELLOW}Port 5173 already in use. Client may already be running.${NC}"
else
    nohup npm run dev > client.log 2>&1 &
    CLIENT_PID=$!
    echo $CLIENT_PID > client.pid
    echo -e "${GREEN}✓ React client started (PID: $CLIENT_PID)${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo " All services started successfully!"
echo "========================================${NC}"
echo ""
echo "Services running at:"
echo -e "${BLUE}• Blockchain Service:${NC} http://localhost:5001"
echo -e "${BLUE}• Node.js API:${NC}        http://localhost:3000"
echo -e "${BLUE}• React Client:${NC}       http://localhost:5173"
echo ""
echo "Logs:"
echo "• Blockchain: blockchain-service/blockchain.log"
echo "• Worker:     blockchain-service/worker.log"
echo "• Server:     server/server.log"
echo "• Client:     client/client.log"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo ""
