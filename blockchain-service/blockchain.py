"""
Blockchain implementation with proof-of-work
Manages chain of blocks and transaction validation
"""
import hashlib
import json
import time
from typing import List, Dict, Optional
import sqlite3
import os


class Blockchain:
    """Blockchain implementation with persistence"""

    def __init__(self, db_path='blockchain_data.db'):
        self.db_path = db_path
        self.chain = []
        self.pending_transactions = []
        self.difficulty = 4  # Number of leading zeros required in hash
        self.mining_reward = 10
        self.init_database()
        self.load_chain()

        # Create genesis block if chain is empty
        if len(self.chain) == 0:
            self.create_genesis_block()

    def init_database(self):
        """Initialize SQLite database for persistence"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS blocks (
                block_index INTEGER PRIMARY KEY,
                timestamp REAL,
                transactions TEXT,
                proof INTEGER,
                previous_hash TEXT,
                hash TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_hash TEXT UNIQUE,
                block_index INTEGER,
                sender TEXT,
                receiver TEXT,
                amount REAL,
                listing_id TEXT,
                quantity INTEGER,
                timestamp REAL,
                status TEXT,
                FOREIGN KEY (block_index) REFERENCES blocks(block_index)
            )
        ''')
        
        conn.commit()
        conn.close()

    def load_chain(self):
        """Load blockchain from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM blocks ORDER BY block_index')
        rows = cursor.fetchall()
        
        for row in rows:
            block = {
                'index': row[0],
                'timestamp': row[1],
                'transactions': json.loads(row[2]),
                'proof': row[3],
                'previous_hash': row[4],
                'hash': row[5]
            }
            self.chain.append(block)
        
        conn.close()

    def save_block(self, block):
        """Save block to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO blocks (block_index, timestamp, transactions, proof, previous_hash, hash)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            block['index'],
            block['timestamp'],
            json.dumps(block['transactions']),
            block['proof'],
            block['previous_hash'],
            block['hash']
        ))
        
        # Save transactions
        for txn in block['transactions']:
            cursor.execute('''
                INSERT OR IGNORE INTO transactions 
                (transaction_hash, block_index, sender, receiver, amount, listing_id, quantity, timestamp, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                txn.get('transaction_hash'),
                block['index'],
                txn.get('sender'),
                txn.get('receiver'),
                txn.get('amount'),
                txn.get('listing_id'),
                txn.get('quantity'),
                txn.get('timestamp'),
                'confirmed'
            ))
        
        conn.commit()
        conn.close()

    def create_genesis_block(self):
        """Create the first block in the chain"""
        genesis_block = {
            'index': 0,
            'timestamp': time.time(),
            'transactions': [{
                'sender': 'genesis',
                'receiver': 'genesis',
                'amount': 0,
                'listing_id': 'genesis',
                'quantity': 0,
                'transaction_hash': 'genesis',
                'message': 'Genesis Block - Energy Trading Blockchain'
            }],
            'proof': 100,
            'previous_hash': '0'
        }
        genesis_block['hash'] = self.hash(genesis_block)
        self.chain.append(genesis_block)
        self.save_block(genesis_block)

    def create_block(self, proof: int, previous_hash: str) -> Dict:
        """Create a new block with pending transactions"""
        block = {
            'index': len(self.chain),
            'timestamp': time.time(),
            'transactions': self.pending_transactions,
            'proof': proof,
            'previous_hash': previous_hash
        }
        
        block['hash'] = self.hash(block)
        
        self.pending_transactions = []
        self.chain.append(block)
        self.save_block(block)
        
        return block

    def get_previous_block(self) -> Dict:
        """Get the last block in the chain"""
        return self.chain[-1]

    def add_transaction(self, sender: str, receiver: str, amount: float, 
                       listing_id: str, quantity: int, price_per_credit: float,
                       metadata: Optional[Dict] = None) -> Dict:
        """
        Add a new transaction to pending transactions
        Returns: transaction details with hash
        """
        transaction = {
            'sender': sender,
            'receiver': receiver,
            'amount': amount,
            'listing_id': listing_id,
            'quantity': quantity,
            'price_per_credit': price_per_credit,
            'timestamp': time.time(),
            'metadata': metadata or {}
        }
        
        # Generate transaction hash
        transaction['transaction_hash'] = self.hash_transaction(transaction)
        
        self.pending_transactions.append(transaction)
        
        return transaction

    def hash(self, block: Dict) -> str:
        """Create SHA-256 hash of a block"""
        # Create a copy without the hash field
        block_copy = {k: v for k, v in block.items() if k != 'hash'}
        encoded = json.dumps(block_copy, sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()

    def hash_transaction(self, transaction: Dict) -> str:
        """Create SHA-256 hash of a transaction"""
        txn_copy = {k: v for k, v in transaction.items() if k != 'transaction_hash'}
        encoded = json.dumps(txn_copy, sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()

    def proof_of_work(self, previous_proof: int) -> int:
        """
        Simple proof of work algorithm
        Find a number that, when hashed with previous proof, has leading zeros
        """
        new_proof = 1
        check_proof = False

        while not check_proof:
            hash_operation = hashlib.sha256(
                str(new_proof**2 - previous_proof**2).encode()
            ).hexdigest()

            if hash_operation[:self.difficulty] == '0' * self.difficulty:
                check_proof = True
            else:
                new_proof += 1

        return new_proof

    def is_chain_valid(self) -> bool:
        """Validate the entire blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Verify hash
            if current_block['hash'] != self.hash(current_block):
                return False

            # Verify link to previous block
            if current_block['previous_hash'] != previous_block['hash']:
                return False

            # Verify proof of work
            previous_proof = previous_block['proof']
            proof = current_block['proof']
            hash_operation = hashlib.sha256(
                str(proof**2 - previous_proof**2).encode()
            ).hexdigest()

            if hash_operation[:self.difficulty] != '0' * self.difficulty:
                return False

        return True

    def get_transaction_by_hash(self, transaction_hash: str) -> Optional[Dict]:
        """Get transaction details by hash"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM transactions WHERE transaction_hash = ?
        ''', (transaction_hash,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'transaction_hash': row[1],
                'block_index': row[2],
                'sender': row[3],
                'receiver': row[4],
                'amount': row[5],
                'listing_id': row[6],
                'quantity': row[7],
                'timestamp': row[8],
                'status': row[9]
            }
        
        # Check pending transactions
        for txn in self.pending_transactions:
            if txn.get('transaction_hash') == transaction_hash:
                return {**txn, 'status': 'pending'}
        
        return None

    def get_chain_info(self) -> Dict:
        """Get blockchain statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM transactions WHERE status = "confirmed"')
        total_transactions = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(amount) FROM transactions WHERE status = "confirmed"')
        total_volume = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            'chain_length': len(self.chain),
            'pending_transactions': len(self.pending_transactions),
            'total_transactions': total_transactions,
            'total_volume': total_volume,
            'difficulty': self.difficulty,
            'is_valid': self.is_chain_valid()
        }
