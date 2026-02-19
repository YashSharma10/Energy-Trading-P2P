/**
 * Blockchain client for Node.js server integration
 * Provides wrapper functions for blockchain API calls
 */
import axios from "axios";

const BLOCKCHAIN_SERVICE_URL =
  process.env.BLOCKCHAIN_SERVICE_URL || "http://localhost:5001";

class BlockchainClient {
  constructor(baseUrl = BLOCKCHAIN_SERVICE_URL) {
    this.baseUrl = baseUrl;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Check if blockchain service is available
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error("Blockchain service health check failed:", error.message);
      return { status: "unhealthy", error: error.message };
    }
  }

  /**
   * Get blockchain and service information
   */
  async getInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/info`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get blockchain info: ${error.message}`);
    }
  }

  /**
   * Create a new wallet
   */
  async createWallet() {
    try {
      const response = await axios.post(`${this.baseUrl}/wallet/create`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create wallet: ${error.message}`);
    }
  }

  /**
   * Create a blockchain transaction
   * @param {Object} transactionData - Transaction details
   */
  async createTransaction(transactionData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/create`,
        transactionData,
        { timeout: this.timeout },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Transaction creation failed",
        );
      }
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  /**
   * Get transaction by hash
   * @param {string} transactionHash - Transaction hash
   */
  async getTransaction(transactionHash) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/${transactionHash}`,
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get transaction: ${error.message}`);
    }
  }

  /**
   * Mine a new block
   */
  async mineBlock() {
    try {
      const response = await axios.post(
        `${this.baseUrl}/mine`,
        {},
        { timeout: this.timeout },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Mining failed");
      }
      throw new Error(`Failed to mine block: ${error.message}`);
    }
  }

  /**
   * Get the entire blockchain
   */
  async getChain() {
    try {
      const response = await axios.get(`${this.baseUrl}/chain`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get blockchain: ${error.message}`);
    }
  }

  /**
   * Validate blockchain integrity
   */
  async validateChain() {
    try {
      const response = await axios.get(`${this.baseUrl}/chain/validate`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to validate chain: ${error.message}`);
    }
  }

  /**
   * Get pending transactions
   */
  async getPendingTransactions() {
    try {
      const response = await axios.get(`${this.baseUrl}/pending`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get pending transactions: ${error.message}`);
    }
  }

  /**
   * Get smart contract information
   */
  async getContractInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/contract/info`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get contract info: ${error.message}`);
    }
  }

  /**
   * Create transaction from listing payment
   * Wrapper for easier integration with existing payment flow
   */
  async recordPayment({
    buyerId,
    sellerId,
    listingId,
    quantity,
    pricePerCredit,
    totalAmount,
    buyerAddress,
    sellerAddress,
  }) {
    const transactionData = {
      sender: buyerAddress,
      receiver: sellerAddress,
      amount: totalAmount,
      listing_id: listingId,
      quantity: quantity,
      price_per_credit: pricePerCredit,
      metadata: {
        buyer_id: buyerId,
        seller_id: sellerId,
        timestamp: new Date().toISOString(),
      },
    };

    return await this.createTransaction(transactionData);
  }
}

// Create singleton instance
const blockchainClient = new BlockchainClient();

export default blockchainClient;
