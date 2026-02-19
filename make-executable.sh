# Make scripts executable
chmod +x start-all.sh
chmod +x stop-all.sh
chmod +x test-blockchain.sh
chmod +x blockchain-service/setup.sh

echo "Scripts are now executable"
echo ""
echo "You can now run:"
echo "  ./start-all.sh    - Start all services"
echo "  ./stop-all.sh     - Stop all services"
echo "  ./test-blockchain.sh - Run tests"
