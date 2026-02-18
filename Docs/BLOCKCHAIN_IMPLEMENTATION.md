# Blockchain Payment Integration Guide

This guide explains how to implement and use blockchain payments in the CarbonEase application.

## 📋 Overview

The blockchain payment system allows users to purchase carbon credits using cryptocurrency on the Ethereum blockchain (or other compatible networks). The system includes:

- **Smart Contract**: Handles payment processing and verification
- **Blockchain Service**: Backend integration with Web3
- **Payment Widget**: Frontend UI for blockchain payments
- **Transaction Management**: Tracking and verification of blockchain transactions

## 🔧 Prerequisites

### Backend Requirements
- Node.js 14+
- Web3.js or ethers.js
- MongoDB (for storing blockchain transaction references)

### Frontend Requirements
- React 18+
- ethers.js or web3.js
- MetaMask browser extension (for users)

### Smart Contract Requirements
- Solidity 0.8.0+
- OpenZeppelin contracts (for IERC20)
- Gas budget: ~200,000 units per transaction

## 🚀 Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install web3 ethers
```

**Frontend:**
```bash
cd client
npm install ethers web3
```

### 2. Configure Environment Variables

Create or update `.env` file in the server directory:

```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
BLOCKCHAIN_NETWORK_ID=11155111

# Smart Contract (after deployment)
CONTRACT_ADDRESS=0x...
USDC_ADDRESS=0xA2025B15a1757Df8Ab41e8613A28C6Cce56cebbA

# Transaction Signer (KEEP SECURE!)
BLOCKCHAIN_PRIVATE_KEY=0x...

# Platform Settings
BLOCKCHAIN_PLATFORM_FEE=2
```

### 3. Deploy Smart Contract

#### Option A: Using Hardhat

```bash
# Install Hardhat
npm install --save-dev hardhat

# Initialize project
npx hardhat

# Copy contract to contracts folder
cp server/src/blockchain/CarbonCreditPayment.sol contracts/

# Deploy
npx hardhat run scripts/deploy.js --network sepolia
```

#### Option B: Using Remix IDE

1. Go to https://remix.ethereum.org
2. Create new file: `CarbonCreditPayment.sol`
3. Copy contract code from `server/src/blockchain/CarbonCreditPayment.sol`
4. Compile with Solidity 0.8.0+
5. Deploy to Sepolia testnet
6. Save the contract address

### 4. Configure Contract

After deployment:

1. Update `CONTRACT_ADDRESS` in `.env`
2. Whitelist sellers:
   ```bash
   # Call whitelistSeller(sellerAddress) on the smart contract
   ```

## 📝 API Endpoints

### Blockchain Routes

#### Get Network Information
```
GET /api/blockchain/network-info
Response: {
  chainId: 11155111,
  latestBlock: 5123456,
  rpcUrl: "https://rpc.sepolia.org",
  contractAddress: "0x...",
  isConfigured: true
}
```

#### Get Current Gas Price
```
GET /api/blockchain/gas-price
Response: {
  gasPrice: "25.5 Gwei"
}
```

#### Validate Ethereum Address
```
POST /api/blockchain/validate-address
Body: { address: "0x..." }
Response: {
  address: "0x...",
  isValid: true
}
```

#### Get Wallet Balance
```
GET /api/blockchain/balance/:address
Response: {
  address: "0x...",
  balance: "1.5 ETH"
}
```

#### Prepare Payment Transaction
```
POST /api/blockchain/prepare-payment
Headers: Authorization: Bearer <token>
Body: {
  buyerAddress: "0x...",
  sellerAddress: "0x...",
  amount: 100,
  quantity: 50,
  listingId: "mongo_id"
}
Response: {
  transactionData: "0x...",
  gas: 200000,
  gasPrice: "25000000000",
  from: "0x...",
  to: "0x..."
}
```

#### Verify Transaction
```
GET /api/blockchain/verify-transaction/:transactionId
Response: {
  transactionId: "0x...",
  verified: true
}
```

### Updated Payment Endpoint

The existing payment endpoint now supports blockchain:

```
POST /api/credits/payment
Headers: Authorization: Bearer <token>
Body: {
  listingId: "mongo_id",
  quantity: 50,
  paymentMethod: "blockchain",
  blockchain: {
    enabled: true,
    buyerWallet: "0x...",
    sellerWallet: "0x...",
    chainId: 11155111
  }
}
Response: {
  transactionId: "mongo_id",
  paymentMethod: "blockchain",
  blockchain: {
    transactionHash: "0x...",
    verified: true
  }
}
```

## 🎨 Frontend Integration

### Using the Blockchain Payment Widget

```jsx
import BlockchainPaymentWidget from '@/components/payment/BlockchainPaymentWidget';

function CheckoutPage() {
  return (
    <BlockchainPaymentWidget
      listing={listingData}
      quantity={50}
      totalAmount={500}
      onPaymentSuccess={(data) => {
        console.log('Payment successful:', data);
        // Redirect to confirmation page
      }}
      onPaymentError={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}
```

### Manual Web3 Integration

```jsx
import web3PaymentService from '@/services/web3PaymentService';

// Connect wallet
const result = await web3PaymentService.connectWallet();
console.log('Connected:', result.address);

// Get balance
const balance = await web3PaymentService.getBalance();
console.log('Balance:', balance, 'ETH');

// Sign message
const signature = await web3PaymentService.signMessage('Sign this message');

// Switch network
await web3PaymentService.switchNetwork(11155111); // Sepolia
```

## 🔐 Security Considerations

### Private Key Management
- **NEVER** commit private key to version control
- Use environment variables
- Consider using AWS Secrets Manager or HashiCorp Vault in production
- Rotate keys periodically

### Smart Contract
- Contract is auditable (included in repo)
- Implements access control (onlyOwner)
- Validates all inputs
- Use testnet for development

### Transaction Signing
- Backend-side: Sign transactions with private key
- Frontend-side: Users sign with MetaMask
- Implement nonce management to prevent replay attacks

## 🧪 Testing

### Test on Sepolia Testnet

1. Get test ETH:
   ```
   https://sepoliafaucet.com
   https://www.alchemy.com/faucets/ethereum-sepolia
   ```

2. Get test USDC:
   - Mint test USDC on Sepolia
   - Or use existing test tokens

3. Test payment flow:
   ```javascript
   // Example test
   const buyer = "0x...";
   const seller = "0x...";
   const amount = 100; // USDC
   const quantity = 50;
   
   const response = await axios.post('/api/credits/payment', {
     listingId: "test_listing_id",
     quantity,
     paymentMethod: "blockchain",
     blockchain: {
       enabled: true,
       buyerWallet: buyer,
       sellerWallet: seller,
       chainId: 11155111
     }
   });
   ```

## 📊 Monitoring

### Track Blockchain Transactions

The system logs all blockchain activity:

```javascript
// Check logs
logs/blockchain-*.log

// Key events:
- "Payment processed on blockchain"
- "Seller whitelisted"
- "Transaction verified"
```

### Database Schema

Transactions now include blockchain fields:

```javascript
{
  _id: ObjectId,
  blockchain: {
    enabled: Boolean,
    chainId: Number,
    contractAddress: String,
    transactionHash: String,
    blockNumber: Number,
    gasUsed: String,
    buyerWallet: String,
    sellerWallet: String,
    blockchainTransactionId: String,
    verified: Boolean,
    timestamp: Date
  }
}
```

## 🌐 Supported Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Ethereum Mainnet | 1 | https://eth-mainnet.g.alchemy.com/v2/ |
| Sepolia Testnet | 11155111 | https://rpc.sepolia.org |
| Polygon | 137 | https://polygon-rpc.com |
| Mumbai Testnet | 80001 | https://rpc-mumbai.maticvigil.com |

To switch networks, update `BLOCKCHAIN_RPC_URL` and `BLOCKCHAIN_NETWORK_ID` in `.env`.

## 💡 Best Practices

### For Development
1. Use Sepolia testnet
2. Start with small amounts
3. Test all payment flows
4. Monitor gas prices
5. Validate addresses

### For Production
1. Audit smart contract
2. Use mainnet
3. Implement rate limiting
4. Monitor transaction failures
5. Keep backups of private keys
6. Implement fallback payment methods

## 🐛 Troubleshooting

### "Wallet not connected"
- Ensure MetaMask is installed
- Check browser console for errors
- Clear browser cache and reload

### "Contract not found"
- Verify `CONTRACT_ADDRESS` in `.env`
- Check network (should be Sepolia)
- Redeploy contract if needed

### "Transaction failed"
- Check buyer has enough balance
- Verify USDC approval
- Check gas price (might be too low)
- Ensure seller is whitelisted

### "Invalid address"
- Verify Ethereum address format (0x...)
- Check address is checksummed
- Ensure address is on correct network

## 📚 Additional Resources

- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum Development Docs](https://ethereum.org/en/developers/)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review contract code in `server/src/blockchain/CarbonCreditPayment.sol`
3. Check blockchain service in `server/src/services/blockchainService.js`
4. Review test implementations

---

**Last Updated**: February 2026
**Version**: 1.0.0
