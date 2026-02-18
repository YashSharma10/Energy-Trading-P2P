/**
 * Blockchain utilities and helpers
 */

/**
 * Convert amount to smallest unit (Wei for ETH, smallest unit for tokens)
 */
export const toSmallestUnit = (amount, decimals = 18) => {
  const multiplier = Math.pow(10, decimals);
  return BigInt(Math.floor(amount * multiplier));
};

/**
 * Convert from smallest unit to human readable format
 */
export const fromSmallestUnit = (amount, decimals = 18) => {
  const divisor = Math.pow(10, decimals);
  return amount / divisor;
};

/**
 * Format wallet address for display (shortened)
 */
export const formatWalletAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Generate blockchain transaction reference
 */
export const generateBlockchainTxRef = () => {
  return `BTC-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
};

/**
 * Check if transaction is finalized (typically after 12 blocks)
 */
export const isTransactionFinalized = (blockNumber, currentBlockNumber, confirmations = 12) => {
  return (currentBlockNumber - blockNumber) >= confirmations;
};

/**
 * Network configurations
 */
export const NETWORKS = {
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://etherscan.io',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
};

/**
 * Get network configuration
 */
export const getNetworkConfig = (chainId) => {
  for (const [key, config] of Object.entries(NETWORKS)) {
    if (config.chainId === chainId) {
      return config;
    }
  }
  return null;
};

/**
 * Build blockchain explorer URL for transaction
 */
export const getTransactionExplorerUrl = (txHash, chainId) => {
  const network = getNetworkConfig(chainId);
  if (!network) return null;
  return `${network.blockExplorer}/tx/${txHash}`;
};

/**
 * Build blockchain explorer URL for address
 */
export const getAddressExplorerUrl = (address, chainId) => {
  const network = getNetworkConfig(chainId);
  if (!network) return null;
  return `${network.blockExplorer}/address/${address}`;
};

/**
 * Payment status on blockchain
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

/**
 * Transaction fee estimator
 */
export const estimateTransactionFee = (gasUsed, gasPrice) => {
  return gasUsed * gasPrice;
};

export default {
  toSmallestUnit,
  fromSmallestUnit,
  formatWalletAddress,
  generateBlockchainTxRef,
  isTransactionFinalized,
  NETWORKS,
  getNetworkConfig,
  getTransactionExplorerUrl,
  getAddressExplorerUrl,
  PAYMENT_STATUS,
  estimateTransactionFee,
};
