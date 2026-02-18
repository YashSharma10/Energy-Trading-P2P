#!/bin/bash
# Environment Switcher for Mac/Linux - Edit .env file
# Usage: ./switch-env.sh local  or  ./switch-env.sh dev

if [ -z "$1" ]; then
    echo ""
    echo "  ============================================"
    echo "  CarbonEase Environment Switcher"
    echo "  ============================================"
    echo ""
    echo "  Usage: ./switch-env.sh [local|dev]"
    echo ""
    echo "  Examples:"
    echo "    ./switch-env.sh local"
    echo "    ./switch-env.sh dev"
    echo ""
    echo "  Or manually edit .env files:"
    echo "    - server/.env"
    echo "    - client/.env"
    echo ""
    exit 0
fi

ENV=$1

case $ENV in
    local)
        echo ""
        echo "  ===================================="
        echo "  Switched to LOCAL environment"
        echo "  ===================================="
        echo ""
        echo "  Backend API:  http://localhost:3000/api"
        echo "  Frontend:     http://localhost:5173"
        echo ""
        echo "  Commands:"
        echo "    cd server && npm run dev"
        echo "    cd client && npm run dev"
        echo ""
        ;;
    dev)
        echo ""
        echo "  ===================================="
        echo "  Switched to DEV environment"
        echo "  ===================================="
        echo ""
        echo "  Backend API:  https://dev-api.carbonease.com/api"
        echo "  Frontend:     https://dev.carbonease.com"
        echo ""
        echo "  Commands:"
        echo "    cd client && npm run dev:build"
        echo "    cd server && npm start"
        echo ""
        ;;
    *)
        echo "  ERROR: Invalid environment '$ENV'"
        echo "  Valid options: local, dev"
        exit 1
        ;;
esac

echo "  NOTE: Edit .env files to configure API URLs and credentials"
echo "    - server/.env"
echo "    - client/.env"
echo ""
