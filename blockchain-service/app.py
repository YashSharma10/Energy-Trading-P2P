"""
Flask application for blockchain service
Provides REST API for blockchain operations
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from blockchain import Blockchain
from wallet import Wallet
from smart_contract import EnergyTradingContract
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize blockchain and smart contract
blockchain = Blockchain()
smart_contract = EnergyTradingContract()

# Store deployment info
DEPLOYMENT_INFO = {
    'service': 'Energy Trading Blockchain',
    'version': '1.0.0',
    'status': 'active',
    'smart_contract_address': smart_contract.contract_address
}


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'blockchain-service',
        'blockchain_valid': blockchain.is_chain_valid()
    }), 200


@app.route('/info', methods=['GET'])
def get_info():
    """Get service and blockchain information"""
    chain_info = blockchain.get_chain_info()
    contract_info = smart_contract.get_contract_info()
    
    return jsonify({
        'success': True,
        'deployment': DEPLOYMENT_INFO,
        'blockchain': chain_info,
        'smart_contract': contract_info
    }), 200


@app.route('/wallet/create', methods=['POST'])
def create_wallet():
    """
    Create a new wallet with key pair
    Returns: private_key, public_key, address
    """
    try:
        private_key, public_key, address = Wallet.create_wallet()
        
        logger.info(f"New wallet created: {address}")
        
        return jsonify({
            'success': True,
            'data': {
                'private_key': private_key,
                'public_key': public_key,
                'address': address
            },
            'warning': 'Store private key securely. It cannot be recovered if lost.'
        }), 201
    except Exception as e:
        logger.error(f"Error creating wallet: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/transaction/create', methods=['POST'])
def create_transaction():
    """
    Create a new transaction and add to pending pool
    Expected payload:
    {
        "sender": "address",
        "receiver": "address", 
        "amount": 1000,
        "listing_id": "mongo_listing_id",
        "quantity": 10,
        "price_per_credit": 100,
        "buyer_id": "mongo_buyer_id",
        "seller_id": "mongo_seller_id",
        "metadata": {}
    }
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['sender', 'receiver', 'amount', 'listing_id', 'quantity', 'price_per_credit']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400

        # Validate transaction through smart contract
        is_valid, error_message = smart_contract.validate_transaction(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': f'Transaction validation failed: {error_message}'
            }), 400

        # Add transaction to blockchain
        transaction = blockchain.add_transaction(
            sender=data['sender'],
            receiver=data['receiver'],
            amount=float(data['amount']),
            listing_id=data['listing_id'],
            quantity=int(data['quantity']),
            price_per_credit=float(data['price_per_credit']),
            metadata=data.get('metadata', {})
        )

        # Execute smart contract
        receipt = smart_contract.execute_transaction({
            **transaction,
            'block_index': len(blockchain.chain)
        })

        logger.info(f"Transaction created: {transaction['transaction_hash']}")

        return jsonify({
            'success': True,
            'message': 'Transaction added to pending pool',
            'data': {
                'transaction': transaction,
                'receipt': receipt,
                'block_index': blockchain.get_previous_block()['index'] + 1,
                'status': 'pending'
            }
        }), 201

    except Exception as e:
        logger.error(f"Error creating transaction: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/transaction/<transaction_hash>', methods=['GET'])
def get_transaction(transaction_hash):
    """Get transaction details by hash"""
    try:
        transaction = blockchain.get_transaction_by_hash(transaction_hash)
        
        if not transaction:
            return jsonify({
                'success': False,
                'error': 'Transaction not found'
            }), 404

        return jsonify({
            'success': True,
            'data': transaction
        }), 200

    except Exception as e:
        logger.error(f"Error getting transaction: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/mine', methods=['POST'])
def mine_block():
    """
    Mine a new block with pending transactions
    Returns: newly mined block
    """
    try:
        if len(blockchain.pending_transactions) == 0:
            return jsonify({
                'success': False,
                'message': 'No transactions to mine'
            }), 400

        # Get previous block
        previous_block = blockchain.get_previous_block()
        previous_proof = previous_block['proof']
        previous_hash = previous_block['hash']

        # Perform proof of work
        logger.info("Starting mining...")
        proof = blockchain.proof_of_work(previous_proof)
        
        # Create new block
        block = blockchain.create_block(proof, previous_hash)

        logger.info(f"Block mined: {block['index']}")

        return jsonify({
            'success': True,
            'message': 'Block mined successfully',
            'data': {
                'block': block,
                'transactions_count': len(block['transactions'])
            }
        }), 201

    except Exception as e:
        logger.error(f"Error mining block: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/chain', methods=['GET'])
def get_chain():
    """Get the entire blockchain"""
    try:
        return jsonify({
            'success': True,
            'data': {
                'chain': blockchain.chain,
                'length': len(blockchain.chain),
                'is_valid': blockchain.is_chain_valid()
            }
        }), 200
    except Exception as e:
        logger.error(f"Error getting chain: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/chain/validate', methods=['GET'])
def validate_chain():
    """Validate the blockchain integrity"""
    try:
        is_valid = blockchain.is_chain_valid()
        
        return jsonify({
            'success': True,
            'is_valid': is_valid,
            'message': 'Blockchain is valid' if is_valid else 'Blockchain is invalid'
        }), 200

    except Exception as e:
        logger.error(f"Error validating chain: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/pending', methods=['GET'])
def get_pending_transactions():
    """Get all pending transactions"""
    try:
        return jsonify({
            'success': True,
            'data': {
                'pending_transactions': blockchain.pending_transactions,
                'count': len(blockchain.pending_transactions)
            }
        }), 200
    except Exception as e:
        logger.error(f"Error getting pending transactions: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/contract/info', methods=['GET'])
def get_contract_info():
    """Get smart contract information"""
    try:
        contract_info = smart_contract.get_contract_info()
        
        return jsonify({
            'success': True,
            'data': contract_info
        }), 200

    except Exception as e:
        logger.error(f"Error getting contract info: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Blockchain Service on port {port}")
    logger.info(f"Smart Contract deployed at: {smart_contract.contract_address}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
