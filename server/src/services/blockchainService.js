import Web3 from 'web3';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Web3
const web3 = new Web3(
  process.env.BLOCKCHAIN_RPC_URL || 'https://rpc.sepolia.org'
);

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_buyer", "type": "address"},
      {"internalType": "address", "name": "_seller", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"},
      {"internalType": "uint256", "name": "_quantity", "type": "uint256"},
      {"internalType": "string", "name": "_listingId", "type": "string"}
    ],
    "name": "processPayment",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "_transactionId", "type": "bytes32"}],
    "name": "refundPayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "_transactionId", "type": "bytes32"}],
    "name": "getTransaction",
    "outputs": [
      {"internalType": "bytes32", "name": "transactionId", "type": "bytes32"},
      {"internalType": "address", "name": "buyer", "type": "address"},
      {"internalType": "address", "name": "seller", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "quantity", "type": "uint256"},
      {"internalType": "string", "name": "listingId", "type": "string"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"},
      {"internalType": "bool", "name": "refunded", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "_transactionId", "type": "bytes32"}],
    "name": "verifyTransaction",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_seller", "type": "address"}],
    "name": "whitelistSeller",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_seller", "type": "address"}],
    "name": "isSellerWhitelisted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// USDC Token ABI
const USDC_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

class BlockchainService {
  constructor() {
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.usdcAddress = process.env.USDC_ADDRESS;
    this.privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    this.account = null;
    this.contract = null;
    this.usdc = null;
    
    if (this.privateKey && this.privateKey.startsWith('0x')) {
      this.account = web3.eth.accounts.privateKeyToAccount(this.privateKey);
      this.initializeContracts();
    }
  }

  /**
   * Initialize contract instances
   */
  initializeContracts() {
    try {
      if (this.contractAddress) {
        this.contract = new web3.eth.Contract(CONTRACT_ABI, this.contractAddress);
      }
      if (this.usdcAddress) {
        this.usdc = new web3.eth.Contract(USDC_ABI, this.usdcAddress);
      }
      logger.info('Blockchain service initialized');
    } catch (error) {
      logger.error('Error initializing blockchain service:', error);
    }
  }

  /**
   * Check if blockchain is configured
   */
  isConfigured() {
    return !!this.contractAddress && !!this.account && !!this.contract;
  }

  /**
   * Get gas price
   */
  async getGasPrice() {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      return web3.utils.fromWei(gasPrice, 'gwei');
    } catch (error) {
      logger.error('Error getting gas price:', error);
      throw error;
    }
  }

  /**
   * Prepare payment transaction
   */
  async preparePaymentTransaction(buyerAddress, sellerAddress, amount, quantity, listingId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Blockchain service not properly configured');
      }

      // Convert amount to Wei (assuming amount is in USD, convert to smallest unit)
      const amountInUnits = web3.utils.toWei(amount.toString(), 'ether');

      // Create transaction data
      const txData = this.contract.methods.processPayment(
        buyerAddress,
        sellerAddress,
        amountInUnits,
        quantity,
        listingId
      ).encodeABI();

      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(this.account.address);

      const txConfig = {
        from: this.account.address,
        to: this.contractAddress,
        data: txData,
        gas: 200000,
        gasPrice: gasPrice,
        nonce: nonce
      };

      return txConfig;
    } catch (error) {
      logger.error('Error preparing payment transaction:', error);
      throw error;
    }
  }

  /**
   * Execute payment transaction
   */
  async executePayment(buyerAddress, sellerAddress, amount, quantity, listingId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Blockchain service not properly configured');
      }

      const txConfig = await this.preparePaymentTransaction(
        buyerAddress,
        sellerAddress,
        amount,
        quantity,
        listingId
      );

      // Sign transaction
      const signedTx = await web3.eth.accounts.signTransaction(txConfig, this.privateKey);

      // Send transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      logger.info(`Payment processed on blockchain: ${receipt.transactionHash}`);

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        success: receipt.status === true
      };
    } catch (error) {
      logger.error('Error executing payment:', error);
      throw error;
    }
  }

  /**
   * Verify transaction on blockchain
   */
  async verifyTransaction(transactionId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Blockchain service not properly configured');
      }

      const result = await this.contract.methods.verifyTransaction(transactionId).call();
      return result;
    } catch (error) {
      logger.error('Error verifying transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction details from blockchain
   */
  async getTransactionDetails(transactionId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Blockchain service not properly configured');
      }

      const transaction = await this.contract.methods.getTransaction(transactionId).call();
      return {
        transactionId: transaction.transactionId,
        buyer: transaction.buyer,
        seller: transaction.seller,
        amount: web3.utils.fromWei(transaction.amount, 'ether'),
        quantity: transaction.quantity,
        listingId: transaction.listingId,
        timestamp: new Date(parseInt(transaction.timestamp) * 1000),
        completed: transaction.completed,
        refunded: transaction.refunded
      };
    } catch (error) {
      logger.error('Error getting transaction details:', error);
      throw error;
    }
  }

  /**
   * Whitelist a seller
   */
  async whitelistSeller(sellerAddress) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Blockchain service not properly configured');
      }

      const txData = this.contract.methods.whitelistSeller(sellerAddress).encodeABI();
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(this.account.address);

      const txConfig = {
        from: this.account.address,
        to: this.contractAddress,
        data: txData,
        gas: 100000,
        gasPrice: gasPrice,
        nonce: nonce
      };

      const signedTx = await web3.eth.accounts.signTransaction(txConfig, this.privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      logger.info(`Seller whitelisted: ${sellerAddress}`);
      return receipt.transactionHash;
    } catch (error) {
      logger.error('Error whitelisting seller:', error);
      throw error;
    }
  }

  /**
   * Check if seller is whitelisted
   */
  async isSellerWhitelisted(sellerAddress) {
    try {
      if (!this.isConfigured()) {
        return false; // Return false if not configured
      }

      const result = await this.contract.methods.isSellerWhitelisted(sellerAddress).call();
      return result;
    } catch (error) {
      logger.error('Error checking seller whitelist status:', error);
      return false;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address) {
    try {
      const balance = await web3.eth.getBalance(address);
      return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      logger.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Get block number
   */
  async getBlockNumber() {
    try {
      return await web3.eth.getBlockNumber();
    } catch (error) {
      logger.error('Error getting block number:', error);
      throw error;
    }
  }

  /**
   * Convert amount to Wei
   */
  toWei(amount) {
    return web3.utils.toWei(amount.toString(), 'ether');
  }

  /**
   * Convert amount from Wei
   */
  fromWei(amount) {
    return web3.utils.fromWei(amount.toString(), 'ether');
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address) {
    return web3.utils.isAddress(address);
  }

  /**
   * Get network info
   */
  async getNetworkInfo() {
    try {
      const [chainId, latestBlock] = await Promise.all([
        web3.eth.getChainId(),
        web3.eth.getBlockNumber()
      ]);

      return {
        chainId,
        latestBlock,
        rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
        contractAddress: this.contractAddress,
        isConfigured: this.isConfigured()
      };
    } catch (error) {
      logger.error('Error getting network info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new BlockchainService();
