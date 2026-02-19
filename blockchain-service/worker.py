"""
Background worker for mining blockchain blocks
Periodically mines pending transactions
"""
import time
import schedule
import requests
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BLOCKCHAIN_SERVICE_URL = 'http://localhost:5001'
MINING_INTERVAL = 30  # Mine every 30 seconds if transactions are pending


def mine_pending_transactions():
    """Check for pending transactions and mine a block if any exist"""
    try:
        # Check pending transactions
        response = requests.get(f'{BLOCKCHAIN_SERVICE_URL}/pending')
        
        if response.status_code != 200:
            logger.error(f"Failed to check pending transactions: {response.text}")
            return
        
        data = response.json()
        pending_count = data['data']['count']
        
        if pending_count == 0:
            logger.info("No pending transactions to mine")
            return
        
        logger.info(f"Found {pending_count} pending transaction(s), starting mining...")
        
        # Mine a block
        mine_response = requests.post(f'{BLOCKCHAIN_SERVICE_URL}/mine')
        
        if mine_response.status_code == 201:
            result = mine_response.json()
            block = result['data']['block']
            logger.info(
                f"✓ Block #{block['index']} mined successfully with "
                f"{result['data']['transactions_count']} transaction(s)"
            )
        else:
            logger.error(f"Mining failed: {mine_response.text}")
            
    except Exception as e:
        logger.error(f"Error in mining worker: {str(e)}")


def validate_blockchain():
    """Periodically validate blockchain integrity"""
    try:
        response = requests.get(f'{BLOCKCHAIN_SERVICE_URL}/chain/validate')
        
        if response.status_code == 200:
            result = response.json()
            if result['is_valid']:
                logger.info("✓ Blockchain validation passed")
            else:
                logger.error("✗ Blockchain validation failed!")
        else:
            logger.error(f"Failed to validate blockchain: {response.text}")
            
    except Exception as e:
        logger.error(f"Error validating blockchain: {str(e)}")


def check_service_health():
    """Check if blockchain service is healthy"""
    try:
        response = requests.get(f'{BLOCKCHAIN_SERVICE_URL}/health', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data['status'] == 'healthy':
                logger.info("✓ Blockchain service is healthy")
            else:
                logger.warning("⚠ Blockchain service is unhealthy")
        else:
            logger.error(f"Health check failed: {response.text}")
            
    except Exception as e:
        logger.error(f"Error checking service health: {str(e)}")


def main():
    """Main worker function"""
    logger.info("Starting Blockchain Mining Worker")
    logger.info(f"Blockchain Service: {BLOCKCHAIN_SERVICE_URL}")
    logger.info(f"Mining Interval: {MINING_INTERVAL} seconds")
    
    # Check service health on startup
    check_service_health()
    
    # Schedule tasks
    schedule.every(MINING_INTERVAL).seconds.do(mine_pending_transactions)
    schedule.every(5).minutes.do(validate_blockchain)
    schedule.every(1).minutes.do(check_service_health)
    
    logger.info("Worker started. Press Ctrl+C to stop.")
    
    # Run scheduled tasks
    while True:
        try:
            schedule.run_pending()
            time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Worker stopped by user")
            break
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            time.sleep(5)


if __name__ == '__main__':
    main()
