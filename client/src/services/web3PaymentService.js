/**
 * Web3 Integration for Blockchain Payments
 * Handles wallet connection, transaction preparation, and payment processing
 */

import { ethers } from 'ethers';

class Web3PaymentService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
    this.chainId = null;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }

  /**
   * Connect wallet
   */
  async connectWallet() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.userAddress = accounts[0];

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Get chain ID
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId;

      return {
        success: true,
        address: this.userAddress,
        chainId: this.chainId,
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
    this.chainId = null;
  }

  /**
   * Get connected wallet address
   */
  getConnectedAddress() {
    return this.userAddress;
  }

  /**
   * Get user balance
   */
  async getBalance() {
    try {
      if (!this.provider || !this.userAddress) {
        throw new Error('Wallet not connected');
      }

      const balance = await this.provider.getBalance(this.userAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance in USDC or other token
   */
  async getTokenBalance(tokenAddress, tokenAbi) {
    try {
      if (!this.provider || !this.userAddress) {
        throw new Error('Wallet not connected');
      }

      const contract = new ethers.Contract(tokenAddress, tokenAbi, this.provider);
      const balance = await contract.balanceOf(this.userAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  /**
   * Approve token spending
   */
  async approveToken(tokenAddress, spenderAddress, amount, tokenAbi) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contract = new ethers.Contract(tokenAddress, tokenAbi, this.signer);
      const amountInWei = ethers.parseEther(amount.toString());

      const tx = await contract.approve(spenderAddress, amountInWei);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(to, value) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(value.toString()),
      });

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  /**
   * Call smart contract function
   */
  async callContractFunction(contractAddress, contractAbi, functionName, args, options = {}) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contract = new ethers.Contract(contractAddress, contractAbi, this.signer);
      const tx = await contract[functionName](...args, options);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Listen for wallet changes
   */
  onAccountsChanged(callback) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        this.userAddress = accounts[0] || null;
        callback(accounts);
      });
    }
  }

  /**
   * Listen for chain changes
   */
  onChainChanged(callback) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        this.chainId = parseInt(chainId, 16);
        callback(this.chainId);
      });
    }
  }

  /**
   * Switch to specific network
   */
  async switchNetwork(chainId) {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask not installed');
      }

      const chainIdHex = '0x' + chainId.toString(16);

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchError) {
        // Chain not added to wallet
        if (switchError.code === 4902) {
          throw new Error('Network not found in wallet. Please add it manually.');
        }
        throw switchError;
      }

      this.chainId = chainId;
      return { success: true, chainId };
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }

  /**
   * Sign message
   */
  async signMessage(message) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  /**
   * Recover address from signature
   */
  recoverAddress(message, signature) {
    try {
      const address = ethers.recoverMessageAddress(message, signature);
      return address;
    } catch (error) {
      console.error('Error recovering address:', error);
      throw error;
    }
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(txHash) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);

      return {
        ...tx,
        receipt,
      };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash, confirmations = 1) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      return receipt;
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new Web3PaymentService();
