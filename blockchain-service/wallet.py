"""
Wallet management module for blockchain
Handles creation and storage of cryptographic key pairs
"""
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
import hashlib
import os


class Wallet:
    """Manages wallet creation and key operations"""

    @staticmethod
    def create_wallet():
        """
        Generate a new RSA key pair for wallet
        Returns: tuple (private_key_pem, public_key_pem, address)
        """
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )

        public_key = private_key.public_key()

        # Serialize private key
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        # Serialize public key
        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Generate wallet address from public key hash
        address = Wallet.generate_address(public_pem)

        return private_pem.decode(), public_pem.decode(), address

    @staticmethod
    def generate_address(public_key_pem):
        """Generate a wallet address from public key"""
        if isinstance(public_key_pem, str):
            public_key_pem = public_key_pem.encode()
        
        address_hash = hashlib.sha256(public_key_pem).hexdigest()
        return f"0x{address_hash[:40]}"

    @staticmethod
    def sign_transaction(private_key_pem, transaction_data):
        """Sign transaction data with private key"""
        if isinstance(private_key_pem, str):
            private_key_pem = private_key_pem.encode()
        
        private_key = serialization.load_pem_private_key(
            private_key_pem,
            password=None
        )

        signature = private_key.sign(
            transaction_data.encode() if isinstance(transaction_data, str) else transaction_data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )

        return signature.hex()

    @staticmethod
    def verify_signature(public_key_pem, transaction_data, signature):
        """Verify transaction signature"""
        try:
            if isinstance(public_key_pem, str):
                public_key_pem = public_key_pem.encode()
            
            public_key = serialization.load_pem_public_key(public_key_pem)
            
            public_key.verify(
                bytes.fromhex(signature),
                transaction_data.encode() if isinstance(transaction_data, str) else transaction_data,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except Exception:
            return False
