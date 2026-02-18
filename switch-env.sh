#!/bin/bash
# Environment Switcher for Mac/Linux
# Usage: ./switch-env.sh [local|dev]

set -e

if [ -z "$1" ]; then
    echo ""
    echo "Environment Switcher - CarbonEase"
    echo "==================================="
    echo ""
    echo "Usage: ./switch-env.sh [local|dev]"
    echo ""
    echo "Examples:"
    echo "  ./switch-env.sh local"
    echo "  ./switch-env.sh dev"
    echo ""
    exit 0
fi

ENV=$1

case $ENV in
    local)
        echo "Switching to LOCAL environment..."
        cp -f server/.env.local server/.env
        echo "Backend: Updated server/.env from .env.local"
        echo "Frontend: Use 'npm run dev' to start with local settings"
        echo ""
        echo "Local environment ready!"
        echo "Backend API: http://localhost:3000/api"
        echo "Frontend: http://localhost:5173"
        ;;
    dev)
        echo "Switching to DEV environment..."
        cp -f server/.env.dev server/.env
        echo "Backend: Updated server/.env from .env.dev"
        echo "Frontend: Use 'npm run dev:build' for dev build"
        echo "Backend: Use 'npm start' to run in dev mode"
        echo ""
        echo "Dev environment ready!"
        ;;
    *)
        echo "Invalid environment: $ENV"
        echo "Valid options: local, dev"
        exit 1
        ;;
esac
