"""
Smart Contract implementation for energy trading
Manages transaction validation and execution logic
"""
import time
from typing import Dict, Optional


class EnergyTradingContract:
    """Smart contract for managing energy credit transactions"""

    def __init__(self):
        self.contract_address = "0xENERGY_TRADING_CONTRACT"
        self.balances = {}  # address -> balance mapping
        self.allowances = {}  # For future implementation

    def validate_transaction(self, transaction: Dict) -> tuple[bool, str]:
        """
        Validate transaction according to contract rules
        Returns: (is_valid, error_message)
        """
        required_fields = ['sender', 'receiver', 'amount', 'listing_id', 'quantity']
        
        # Check required fields
        for field in required_fields:
            if field not in transaction:
                return False, f"Missing required field: {field}"

        # Validate amount
        if transaction['amount'] <= 0:
            return False, "Amount must be positive"

        # Validate quantity
        if transaction['quantity'] <= 0:
            return False, "Quantity must be positive"

        # Validate addresses
        if not transaction['sender'] or not transaction['receiver']:
            return False, "Invalid sender or receiver address"

        # Prevent self-transfer
        if transaction['sender'] == transaction['receiver']:
            return False, "Cannot transfer to self"

        return True, ""

    def execute_transaction(self, transaction: Dict) -> Dict:
        """
        Execute transaction and update contract state
        Returns: transaction receipt
        """
        # Validate first
        is_valid, error = self.validate_transaction(transaction)
        if not is_valid:
            raise ValueError(f"Transaction validation failed: {error}")

        # Update balances
        sender = transaction['sender']
        receiver = transaction['receiver']
        amount = transaction['amount']

        # For demo, we don't check balance (in production, implement proper balance checking)
        # self.balances[sender] = self.balances.get(sender, 0) - amount
        # self.balances[receiver] = self.balances.get(receiver, 0) + amount

        # Generate transaction receipt
        receipt = {
            'status': 'success',
            'contract_address': self.contract_address,
            'transaction_hash': transaction.get('transaction_hash'),
            'block_number': transaction.get('block_index'),
            'timestamp': int(time.time()),
            'gas_used': 21000,  # Simulated gas cost
            'from': sender,
            'to': receiver,
            'value': amount,
            'metadata': {
                'listing_id': transaction.get('listing_id'),
                'quantity': transaction.get('quantity'),
                'price_per_credit': transaction.get('price_per_credit'),
            }
        }

        return receipt

    def get_balance(self, address: str) -> float:
        """Get balance for an address"""
        return self.balances.get(address, 0)

    def get_contract_info(self) -> Dict:
        """Get contract information"""
        return {
            'address': self.contract_address,
            'name': 'Energy Trading Contract',
            'version': '1.0.0',
            'total_addresses': len(self.balances),
            'features': [
                'Transaction Validation',
                'Balance Management',
                'Event Logging',
                'Smart Execution'
            ]
        }
