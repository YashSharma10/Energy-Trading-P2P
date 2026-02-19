# System Architecture Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                    React Frontend (Port 5173)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Register │  │  Login   │  │Marketplace│  │Dashboard │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION SERVER                            │
│                Node.js + Express (Port 3000)                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API Controllers                           │    │
│  │  • Auth Controller      • Listing Controller          │    │
│  │  • Analytics Controller • Admin Controller            │    │
│  └─────────┬──────────────────────────────────┬──────────┘    │
│            │                                   │                │
│            ▼                                   ▼                │
│  ┌─────────────────┐               ┌─────────────────────┐    │
│  │  Auth Services  │               │ Blockchain Client   │    │
│  │  • JWT Tokens   │               │ • Create Wallet     │    │
│  │  • OTP Verify   │               │ • Record Payment    │    │
│  └─────────────────┘               │ • Get Transaction   │    │
│                                     └──────────┬──────────┘    │
└────────────────────────────────────────────────┼───────────────┘
                         │                       │
                         │                       │ HTTP
                         ▼                       ▼
        ┌────────────────────────┐    ┌──────────────────────────┐
        │      MongoDB           │    │  Blockchain Microservice │
        │   (Port 27017)         │    │   Python Flask (5001)    │
        │                        │    │                          │
        │  Collections:          │    │  Components:             │
        │  • users               │    │  • Blockchain Engine     │
        │  • transactions ───────┼────┼──► Smart Contract       │
        │  • listings            │    │  • Wallet Manager        │
        │  • eco_products        │    │  • Transaction Pool      │
        │                        │    │                          │
        │  New Fields:           │    │  Storage:                │
        │  • blockchainAddress   │    │  • SQLite Database       │
        │  • blockchainTxHash    │    │  • Block Persistence     │
        │  • blockchainStatus    │    │  • Transaction History   │
        └────────────────────────┘    └──────────┬───────────────┘
                                                  │
                                                  ▼
                                      ┌───────────────────────┐
                                      │   Mining Worker       │
                                      │   (Background)        │
                                      │                       │
                                      │  • Auto-mine blocks   │
                                      │  • Every 30 seconds   │
                                      │  • Validate chain     │
                                      └───────────────────────┘
```

## Transaction Flow Diagram

```
User Initiates Purchase
         │
         ▼
┌─────────────────────────────────────────┐
│    Frontend (React)                     │
│    • Select listing                     │
│    • Enter quantity                     │
│    • Choose payment method              │
└────────────────┬────────────────────────┘
                 │ POST /api/credits/payment
                 ▼
┌─────────────────────────────────────────┐
│    Node.js API Server                   │
│    makePayment() Controller             │
│                                         │
│  Step 1: Validate User & Listing       │
│          ├─► Check buyer exists         │
│          └─► Check listing available    │
│                                         │
│  Step 2: Get/Create Blockchain Wallets │
│          ├─► Check buyer.blockchainAddr │
│          ├─► Create if not exists       │
│          └─► Same for seller            │
│                                         │
│  Step 3: Update Listing                 │
│          └─► Reduce quantity            │
│                                         │
│  Step 4: Create Transaction Record      │
│          └─► Save to MongoDB            │
│                                         │
│  Step 5: Record on Blockchain           │
│          ├─► Call blockchain service    │
│          └─► Get transaction hash       │
│                                         │
│  Step 6: Update User Records            │
│          ├─► Update buyer transactions  │
│          └─► Update seller credits      │
└────────┬────────────────────┬───────────┘
         │                    │
         │                    │ blockchainClient.recordPayment()
         │                    ▼
         │         ┌──────────────────────────┐
         │         │  Blockchain Service      │
         │         │  POST /transaction/create│
         │         │                          │
         │         │  1. Validate via Smart   │
         │         │     Contract             │
         │         │     • Check amount > 0   │
         │         │     • Check quantity > 0 │
         │         │     • No self-transfer   │
         │         │                          │
         │         │  2. Create Transaction   │
         │         │     • Generate hash      │
         │         │     • Add to pending pool│
         │         │                          │
         │         │  3. Execute Contract     │
         │         │     • Generate receipt   │
         │         │     • Return tx hash     │
         │         └──────────┬───────────────┘
         │                    │
         │                    │ Returns: { txHash, receipt }
         │                    ▼
         │         ┌──────────────────────────┐
         │         │  Update MongoDB          │
         │         │  • blockchainTxHash      │
         │         │  • blockchainStatus      │
         │         │  • smartContractReceipt  │
         │         └──────────────────────────┘
         │
         │ Returns: Transaction complete
         ▼
┌─────────────────────────────────────────┐
│    Frontend                             │
│    • Show success message               │
│    • Display transaction hash           │
│    • Redirect to receipt                │
└─────────────────────────────────────────┘


Meanwhile (Background):

┌─────────────────────────────────────────┐
│    Mining Worker (Every 30s)            │
│                                         │
│  1. Check pending transactions          │
│     curl /pending                       │
│                                         │
│  2. If transactions exist:              │
│     curl POST /mine                     │
│                                         │
│  3. Mining Process:                     │
│     • Get previous block                │
│     • Perform Proof-of-Work             │
│     • Find nonce with leading zeros     │
│     • Create new block                  │
│     • Add to chain                      │
│     • Save to SQLite                    │
│                                         │
│  4. Transactions now confirmed!         │
│     • blockchainStatus: "confirmed"     │
│     • blockNumber: set                  │
└─────────────────────────────────────────┘
```

## Blockchain Structure

```
┌─────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN                           │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐│
│  │  BLOCK #0    │───▶│  BLOCK #1    │───▶│ BLOCK #2  ││
│  │  (Genesis)   │    │              │    │           ││
│  ├──────────────┤    ├──────────────┤    ├───────────┤│
│  │ Index: 0     │    │ Index: 1     │    │ Index: 2  ││
│  │ Timestamp    │    │ Timestamp    │    │ Timestamp ││
│  │ Transactions:│    │ Transactions:│    │ Trans: [] ││
│  │  [genesis]   │    │  [tx1, tx2]  │    │           ││
│  │ Proof: 100   │    │ Proof: 45678 │    │ Proof: ?? ││
│  │ Prev Hash:   │    │ Prev Hash:   │    │ Prev Hash:││
│  │  "0"         │    │  hash(#0)    │    │ hash(#1)  ││
│  │ Hash:        │    │ Hash:        │    │ Hash:     ││
│  │  "abc123..." │    │  "0000def..."│    │ "0000..." ││
│  └──────────────┘    └──────────────┘    └───────────┘│
│                                                         │
│  Each block contains:                                  │
│  • Index (block number)                                │
│  • Timestamp                                           │
│  • List of transactions                                │
│  • Proof (nonce from PoW)                              │
│  • Previous block hash                                 │
│  • Current block hash (SHA-256)                        │
└─────────────────────────────────────────────────────────┘
```

## Smart Contract Flow

```
┌─────────────────────────────────────────┐
│     EnergyTradingContract               │
│                                         │
│  validate_transaction()                 │
│     │                                   │
│     ├─► Check required fields           │
│     │   • sender, receiver              │
│     │   • amount, quantity              │
│     │   • listing_id                    │
│     │                                   │
│     ├─► Validate values                 │
│     │   • amount > 0                    │
│     │   • quantity > 0                  │
│     │   • sender ≠ receiver             │
│     │                                   │
│     └─► Return (valid, error_msg)       │
│                                         │
│  execute_transaction()                  │
│     │                                   │
│     ├─► Validate first                  │
│     │                                   │
│     ├─► Update contract state           │
│     │   (future: balance management)    │
│     │                                   │
│     └─► Generate receipt                │
│         • status: success               │
│         • transaction_hash              │
│         • block_number                  │
│         • timestamp                     │
│         • gas_used                      │
│         • metadata                      │
└─────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Purchase Request
     ▼
┌──────────────────┐
│  React Frontend  │
└────┬─────────────┘
     │ 2. POST /api/credits/payment
     ▼
┌──────────────────────────┐
│  Node.js API             │
│  • Validate              │────┐
│  • Process payment       │    │ 3. Check/Create Wallet
│  • Create transaction    │    │
└────┬────────────┬────────┘    │
     │            │             │
     │ 4. Save    │ 5. Record   ▼
     │            │         ┌──────────────────┐
     ▼            │         │ Blockchain API   │
┌──────────┐     │         │ • Create Wallet  │
│ MongoDB  │     │         │ • Validate       │
│          │     │         │ • Add to Pool    │
│ Users:   │     │         └────┬─────────────┘
│  +wallet │     │              │
│          │     │              │ 6. Return TX Hash
│ Trans:   │◄────┘              │
│  +chain  │◄───────────────────┘
│   info   │
└──────────┘         7. Mine
                         │
                         ▼
                 ┌──────────────┐
                 │ Mining Worker│
                 │ • Get Pending│
                 │ • Mine Block │
                 │ • Confirm TX │
                 └──────────────┘
                         │
                         │ 8. Update Status
                         ▼
                 ┌──────────────┐
                 │  Blockchain  │
                 │  Database    │
                 │  (SQLite)    │
                 └──────────────┘
```

## Service Communication Patterns

```
┌────────────────────────────────────────────────────────┐
│                 Service Mesh                           │
│                                                        │
│  Frontend ◄──────────────────► Node.js API            │
│    5173             REST             3000              │
│                                       │                │
│                                       │                │
│                     ┌─────────────────┼────────────┐   │
│                     │                 │            │   │
│                     ▼                 ▼            ▼   │
│                 MongoDB         Blockchain    Email   │
│                  27017            5001        Service  │
│                     ▲                 │                │
│                     │                 │                │
│                     │                 ▼                │
│                     │           Mining Worker          │
│                     │          (Background)            │
│                     │                 │                │
│                     └─────────────────┘                │
│                     (Update Status)                    │
└────────────────────────────────────────────────────────┘

Communication Protocols:
• Frontend ↔ API: HTTP/REST (JSON)
• API ↔ MongoDB: MongoDB Wire Protocol
• API ↔ Blockchain: HTTP/REST (JSON)
• Worker ↔ Blockchain: HTTP/REST (JSON)
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Network                        │
│                 (energy-network)                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Container   │  │  Container   │  │  Container  │ │
│  │   MongoDB    │  │  Blockchain  │  │   Worker    │ │
│  │  :27017      │  │  :5001       │  │             │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │  Container   │  │  Container   │                   │
│  │  Node.js API │  │  React SPA   │                   │
│  │  :3000       │  │  :80         │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                         │
│  Volumes:                                              │
│  • mongodb_data:/data/db                               │
│  • blockchain_data:/app/data                           │
└─────────────────────────────────────────────────────────┘
         │
         │ Port Mapping
         ▼
┌─────────────────────────────────────────────────────────┐
│                    Host Machine                         │
│                                                         │
│  • MongoDB:     localhost:27017                         │
│  • Blockchain:  localhost:5001                          │
│  • API:         localhost:3000                          │
│  • Frontend:    localhost:5173 (dev) / :80 (prod)      │
└─────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Stack                       │
│                                                         │
│  Layer 1: Application Security                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ • JWT Authentication                              │ │
│  │ • Password Hashing (bcrypt)                       │ │
│  │ • Input Validation                                │ │
│  │ • Rate Limiting                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Layer 2: Blockchain Security                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ • RSA 2048-bit Key Pairs                          │ │
│  │ • Digital Signatures                              │ │
│  │ • SHA-256 Hashing                                 │ │
│  │ • Proof-of-Work Consensus                         │ │
│  │ • Smart Contract Validation                       │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Layer 3: Network Security                             │
│  ┌───────────────────────────────────────────────────┐ │
│  │ • CORS Configuration                              │ │
│  │ • HTTPS (Production)                              │ │
│  │ • Network Isolation (Docker)                      │ │
│  │ • Firewall Rules                                  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Layer 4: Data Security                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │ • Encrypted Database (optional)                   │ │
│  │ • Secure Key Storage                              │ │
│  │ • Audit Logging                                   │ │
│  │ • Backup & Recovery                               │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides:

- ✅ Separation of concerns
- ✅ Scalable microservices
- ✅ Secure transaction handling
- ✅ Persistent blockchain storage
- ✅ Automated mining
- ✅ Production-ready deployment
