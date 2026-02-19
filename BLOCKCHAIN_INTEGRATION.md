# Energy Trading P2P with Blockchain Integration

Complete energy trading platform with blockchain-based transaction verification and smart contracts.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://python.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community))

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd Energy-Trading-P2P
   ```

2. **Start all services (Recommended):**

   **Linux/Mac:**

   ```bash
   chmod +x start-all.sh
   ./start-all.sh
   ```

   **Windows:**

   ```batch
   start-all.bat
   ```

   This will start:
   - Blockchain Service (Port 5001)
   - Mining Worker (Background)
   - Node.js API Server (Port 3000)
   - React Frontend (Port 5173)

3. **Access the application:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000
   - Blockchain: http://localhost:5001

### Manual Setup

If you prefer to start services individually:

#### 1. Blockchain Service

```bash
cd blockchain-service

# Linux/Mac
bash setup.sh
source venv/bin/activate
python app.py

# Windows
setup.bat
venv\Scripts\activate
python app.py
```

#### 2. Mining Worker (Optional but recommended)

In a new terminal:

```bash
cd blockchain-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python worker.py
```

#### 3. Node.js Server

```bash
cd server
npm install
npm run dev
```

#### 4. React Client

```bash
cd client
npm install
npm run dev
```

## 🏗️ Architecture

```
┌─────────────────┐
│  React Client   │ ← User Interface
└────────┬────────┘
         │ HTTP
┌────────▼────────┐
│  Node.js API    │ ← Business Logic
└────┬───────┬────┘
     │       │
     │       └─────────┐
┌────▼─────┐    ┌─────▼──────────┐
│ MongoDB  │    │ Blockchain API │ ← Smart Contracts
└──────────┘    └────────────────┘
```

### Components

1. **Client** (`/client`) - React frontend with Vite
2. **Server** (`/server`) - Express.js API server
3. **Blockchain Service** (`/blockchain-service`) - Python Flask blockchain microservice
   - Blockchain implementation with PoW
   - Smart contract engine
   - Wallet management
   - Mining worker

## 🔗 Blockchain Integration

### How It Works

1. **Transaction Flow:**

   ```
   User Purchase → Node.js API → Blockchain Service
                                       ↓
                              Smart Contract Validation
                                       ↓
                              Add to Pending Pool
                                       ↓
                              Mining Worker mines block
                                       ↓
                              Transaction Confirmed
   ```

2. **Automatic Wallet Creation:**
   - Wallets are automatically created for users on first transaction
   - Public keys and addresses stored in MongoDB
   - Private keys should be managed by users (not stored)

3. **Smart Contract Features:**
   - Transaction validation
   - Balance management
   - Event logging
   - Execution receipts

### Blockchain API Endpoints

- `GET /health` - Service health check
- `GET /info` - Blockchain information
- `POST /wallet/create` - Create new wallet
- `POST /transaction/create` - Create transaction
- `GET /transaction/<hash>` - Get transaction
- `POST /mine` - Mine pending transactions
- `GET /chain` - Get full blockchain
- `GET /pending` - Get pending transactions

## 📊 Database Schema Updates

### Transaction Model (Enhanced)

```javascript
{
  // Original fields
  listing, buyer, seller, quantity,
  pricePerCredit, totalAmount, paymentStatus,

  // New blockchain fields
  blockchainTxHash: String,        // Blockchain transaction hash
  blockchainStatus: String,        // pending, confirmed, failed
  blockNumber: Number,             // Block number when confirmed
  smartContractReceipt: Object     // Smart contract execution receipt
}
```

### User Model (Enhanced)

```javascript
{
  // Original fields
  email, password, name, role, ...

  // New blockchain fields
  blockchainAddress: String,       // Wallet address
  blockchainPublicKey: String      // Public key
}
```

## 🛠️ Configuration

### Server `.env`

```env
# Database
MONGODB_URI=mongodb://localhost:27017/carbonEase

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# Server
PORT=3000
NODE_ENV=development

# Blockchain Service
BLOCKCHAIN_SERVICE_URL=http://localhost:5001

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Blockchain Service `.env`

```env
FLASK_PORT=5001
FLASK_ENV=development
NODE_SERVER_URL=http://localhost:3000
SECRET_KEY=your-secret-key
```

## 🧪 Testing

### Test Blockchain Service

```bash
# Health check
curl http://localhost:5001/health

# Get blockchain info
curl http://localhost:5001/info

# Create wallet
curl -X POST http://localhost:5001/wallet/create

# View blockchain
curl http://localhost:5001/chain
```

### Test Integration

1. Register a user in the frontend
2. Create a listing (as PRODUCER)
3. Purchase credits (as CONSUMER)
4. Check transaction in blockchain:
   ```bash
   curl http://localhost:5001/chain
   ```

## 📝 API Documentation

### Node.js API

- **POST** `/api/auth/register` - Register user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/credits/post` - Create listing
- **POST** `/api/credits/payment` - Purchase credits (blockchain integrated)
- **GET** `/api/credits/payment-data` - Get transaction history

### Blockchain Microservice

See [blockchain-service/README.md](blockchain-service/README.md) for detailed API documentation.

## 🔒 Security Features

- RSA 2048-bit encryption for wallets
- SHA-256 hashing for blockchain
- Proof-of-work consensus
- Transaction signing and verification
- JWT authentication for APIs
- Input validation via smart contracts

## 🐛 Troubleshooting

### Blockchain service won't start

- Check if port 5001 is available
- Verify Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`

### Transactions not appearing on blockchain

- Check if blockchain service is running
- Verify mining worker is active
- Check logs: `blockchain-service/blockchain.log`

### Database connection error

- Ensure MongoDB is running
- Verify MONGODB_URI in `.env`

### Port already in use

```bash
# Linux/Mac
lsof -ti:5001 | xargs kill
lsof -ti:3000 | xargs kill
lsof -ti:5173 | xargs kill

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

## 📦 Production Deployment

### Docker Deployment

```bash
# Build blockchain service
cd blockchain-service
docker build -t energy-blockchain .
docker run -p 5001:5001 energy-blockchain

# Deploy with docker-compose (recommended)
docker-compose up -d
```

### Environment Setup

1. Set production environment variables
2. Use production MongoDB instance
3. Configure reverse proxy (nginx)
4. Enable HTTPS
5. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## 📄 License

MIT License

## 🆘 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review logs in service directories

## 🎯 Future Enhancements

- [ ] Implement peer-to-peer blockchain network
- [ ] Add transaction fees and gas optimization
- [ ] Implement balance checking in smart contracts
- [ ] Add rollback mechanisms
- [ ] Enhance security with multi-sig wallets
- [ ] Add blockchain explorer UI
- [ ] Implement merkle trees for efficiency
- [ ] Add consensus mechanism options

---

**Note:** This implementation uses a simplified blockchain for educational purposes. For production use, consider implementing additional security measures and consensus mechanisms.
