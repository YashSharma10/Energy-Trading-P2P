# Blockchain Payment API Reference

## 📍 Base URL
```
http://localhost:3000/api/blockchain
```

## 🔐 Authentication
Most endpoints require authentication via JWT token in headers:
```
Authorization: Bearer {token}
```

---

## 📚 API Endpoints

### 1. Get Network Information
Get current blockchain network details.

**Endpoint:** `GET /network-info`
**Authentication:** No
**Rate Limit:** No limit

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "chainId": 11155111,
    "chainName": "Sepolia",
    "rpcUrl": "https://rpc.sepolia.org",
    "latestBlock": 5123456,
    "isConfigured": true,
    "contractAddress": "0x...",
    "supportedChains": [
      { "chainId": 11155111, "name": "Sepolia" },
      { "chainId": 1, "name": "Ethereum Mainnet" }
    ]
  }
}
```

---

### 2. Get Gas Price Estimation
Get current gas prices for transaction estimation.

**Endpoint:** `GET /gas-price`
**Authentication:** No
**Rate Limit:** 10 requests/minute

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "standard": "50",
    "fast": "75",
    "fastest": "100",
    "unit": "gwei",
    "estimatedCost": {
      "standard": "0.001",
      "fast": "0.0015",
      "fastest": "0.002",
      "unit": "ETH"
    }
  }
}
```

---

### 3. Validate Ethereum Address
Validate if an address is a valid Ethereum address.

**Endpoint:** `POST /validate-address`
**Authentication:** No
**Rate Limit:** 30 requests/minute

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "isValid": true,
    "checksumAddress": "0x742D35Cc6634C0532925A3b844Bc9E7595f1bEb",
    "isContract": false
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid Ethereum address format"
}
```

---

### 4. Get Wallet Balance
Get ETH and token balance for a wallet address.

**Endpoint:** `GET /balance/:address`
**Authentication:** No
**Rate Limit:** 20 requests/minute

**Path Parameters:**
- `address` (string, required) - Ethereum wallet address

**Example:**
```
GET /balance/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "ethBalance": "1.5",
    "tokenBalance": "1000",
    "tokenDecimals": 6,
    "tokenSymbol": "USDC",
    "formattedBalance": "1000.00 USDC"
  }
}
```

---

### 5. Check Seller Whitelist Status
Check if a seller is whitelisted on the smart contract.

**Endpoint:** `GET /seller-whitelist/:address`
**Authentication:** Yes (Bearer Token)
**Rate Limit:** 10 requests/minute

**Path Parameters:**
- `address` (string, required) - Seller Ethereum address

**Example:**
```
GET /seller-whitelist/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK - Whitelisted):**
```json
{
  "success": true,
  "data": {
    "sellerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "isWhitelisted": true,
    "whitelistedSince": "2024-02-15T10:30:00Z",
    "canReceivePayments": true
  }
}
```

**Response (200 OK - Not Whitelisted):**
```json
{
  "success": true,
  "data": {
    "sellerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "isWhitelisted": false,
    "canReceivePayments": false,
    "note": "This seller must be whitelisted by platform admin"
  }
}
```

---

### 6. Prepare Blockchain Payment
Prepare payment details before processing blockchain transaction.

**Endpoint:** `POST /prepare-payment`
**Authentication:** Yes (Bearer Token)
**Rate Limit:** 50 requests/minute

**Request Body:**
```json
{
  "listingId": "507f1f77bcf86cd799439011",
  "buyerWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
  "sellerWallet": "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  "amount": "100",
  "chainId": 11155111,
  "gasPrice": "standard"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_1h6Td4nKZvb2Zm",
    "listingId": "507f1f77bcf86cd799439011",
    "buyerWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "sellerWallet": "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    "amountInSmallestUnit": "100000000",
    "estimatedGas": "150000",
    "estimatedGasCost": "0.0075",
    "platformFee": "2",
    "totalAmount": "102",
    "validUntil": "2024-02-15T10:35:00Z",
    "contractAddress": "0x...",
    "contractFunction": "processPayment",
    "chainId": 11155111
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Seller is not whitelisted",
  "code": "SELLER_NOT_WHITELISTED"
}
```

---

### 7. Verify Transaction
Verify if a blockchain transaction was successful.

**Endpoint:** `GET /verify-transaction/:transactionId`
**Authentication:** Yes (Bearer Token)
**Rate Limit:** 30 requests/minute

**Path Parameters:**
- `transactionId` (string, required) - Blockchain transaction hash or payment ID

**Example:**
```
GET /verify-transaction/0x1234abcd...
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK - Confirmed):**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x1234abcd...",
    "status": "confirmed",
    "blockNumber": 5123456,
    "gasUsed": 120000,
    "gasPrice": "50",
    "totalGasCost": "0.006",
    "confirmations": 5,
    "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "to": "0x...",
    "value": "100",
    "contractAddress": "0x...",
    "timestamp": "2024-02-15T10:32:00Z",
    "explorerUrl": "https://sepolia.etherscan.io/tx/0x1234abcd...",
    "verified": true
  }
}
```

**Response (200 OK - Pending):**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x1234abcd...",
    "status": "pending",
    "confirmations": 0,
    "explorerUrl": "https://sepolia.etherscan.io/tx/0x1234abcd...",
    "verified": false,
    "note": "Transaction is still being processed"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Transaction not found",
  "code": "TRANSACTION_NOT_FOUND"
}
```

---

## 🔄 Payment Flow Sequence

```
1. GET /network-info
   └─ Verify blockchain is configured

2. POST /validate-address (buyer & seller)
   └─ Ensure addresses are valid format

3. GET /balance/buyerAddress
   └─ Check buyer has sufficient balance

4. GET /seller-whitelist/sellerAddress
   └─ Verify seller is whitelisted

5. POST /prepare-payment
   └─ Get payment details and contract info

6. [User signs transaction in MetaMask]

7. POST /api/listings/pay (from listing controller)
   └─ Executes blockchain payment

8. GET /verify-transaction/txHash
   └─ Confirm transaction on blockchain
```

---

## 🔐 Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_ADDRESS | 400 | Invalid Ethereum address format |
| SELLER_NOT_WHITELISTED | 400 | Seller not whitelisted |
| INSUFFICIENT_BALANCE | 400 | Buyer doesn't have enough tokens |
| INVALID_CHAIN_ID | 400 | Unsupported blockchain network |
| TRANSACTION_NOT_FOUND | 404 | Transaction hash not found |
| CONTRACT_NOT_CONFIGURED | 500 | Smart contract address not set |
| RPC_CONNECTION_ERROR | 500 | Cannot connect to blockchain network |
| BLOCKCHAIN_ERROR | 500 | Error executing blockchain transaction |

---

## 📊 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/network-info` | Unlimited |
| `/gas-price` | 10 req/min |
| `/validate-address` | 30 req/min |
| `/balance/:address` | 20 req/min |
| `/seller-whitelist/:address` | 10 req/min |
| `/prepare-payment` | 50 req/min |
| `/verify-transaction/:id` | 30 req/min |

---

## 🧪 cURL Examples

### Check Network
```bash
curl -X GET http://localhost:3000/api/blockchain/network-info
```

### Validate Address
```bash
curl -X POST http://localhost:3000/api/blockchain/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb"}'
```

### Get Balance
```bash
curl -X GET "http://localhost:3000/api/blockchain/balance/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb"
```

### Check Seller Status
```bash
curl -X GET "http://localhost:3000/api/blockchain/seller-whitelist/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Prepare Payment
```bash
curl -X POST http://localhost:3000/api/blockchain/prepare-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "listingId": "507f1f77bcf86cd799439011",
    "buyerWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "sellerWallet": "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    "amount": "100",
    "chainId": 11155111
  }'
```

### Verify Transaction
```bash
curl -X GET "http://localhost:3000/api/blockchain/verify-transaction/0x1234abcd..." \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📞 Support

For issues with API endpoints:
1. Check [BLOCKCHAIN_IMPLEMENTATION.md](./BLOCKCHAIN_IMPLEMENTATION.md) for troubleshooting
2. Review server logs for error details
3. Verify environment configuration in `.env`
4. Test endpoints with Postman collection (see documentation)

---

**API Version:** 1.0
**Last Updated:** February 2026
**Status:** Production Ready for Sepolia Testnet
