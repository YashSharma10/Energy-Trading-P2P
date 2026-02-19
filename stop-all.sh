#!/bin/bash

echo "========================================"
echo " Stopping All Services"
echo "========================================"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

stop_service() {
    local name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${BLUE}Stopping $name (PID: $PID)...${NC}"
            kill $PID
            rm "$pid_file"
            echo -e "${GREEN}✓ $name stopped${NC}"
        else
            echo -e "${BLUE}$name not running${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${BLUE}$name PID file not found${NC}"
    fi
}

# Stop all services
stop_service "React Client" "$PROJECT_ROOT/client/client.pid"
stop_service "Node.js Server" "$PROJECT_ROOT/server/server.pid"
stop_service "Mining Worker" "$PROJECT_ROOT/blockchain-service/worker.pid"
stop_service "Blockchain Service" "$PROJECT_ROOT/blockchain-service/blockchain.pid"

echo ""
echo -e "${GREEN}All services stopped${NC}"
