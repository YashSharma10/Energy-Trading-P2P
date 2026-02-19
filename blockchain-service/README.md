# Energy Trading Blockchain Service

A microservice implementing blockchain and smart contracts for energy credit transactions.

## Features

- ✅ **Blockchain Implementation**: Proof-of-work blockchain with persistence
- ✅ **Smart Contracts**: Transaction validation and execution logic
- ✅ **Wallet Management**: RSA key pair generation and management
- ✅ **Transaction Pool**: Pending transaction management before mining
- ✅ **Data Persistence**: SQLite database for blockchain storage
- ✅ **RESTful API**: Complete API for blockchain operations
- ✅ **CORS Enabled**: Ready for frontend integration

## Architecture

```
blockchain-service/
├── app.py                 # Flask application & API routes
├── blockchain.py          # Blockchain core implementation
├── smart_contract.py      # Smart contract logic
├── wallet.py              # Wallet & cryptography
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Installation

### Prerequisites

- Python 3.8+
- pip

### Setup

1. **Navigate to the service directory:**

   ```bash
   cd blockchain-service
   ```

2. **Create and activate virtual environment:**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run the service:**
   ```bash
   python app.py
   ```

The service will start on `http://localhost:5001`

## API Endpoints

### Health & Info

- **GET** `/health` - Health check
- **GET** `/info` - Service and blockchain information

### Wallet Management

- **POST** `/wallet/create` - Create new wallet
  ```json
  Response: {
    "private_key": "...",
    "public_key": "...",
    "address": "0x..."
  }
  ```

### Transactions

- **POST** `/transaction/create` - Create new transaction

  ```json
  {
    "sender": "0x...",
    "receiver": "0x...",
    "amount": 1000,
    "listing_id": "mongo_id",
    "quantity": 10,
    "price_per_credit": 100
  }
  ```

- **GET** `/transaction/<hash>` - Get transaction by hash

- **GET** `/pending` - Get pending transactions

### Blockchain

- **POST** `/mine` - Mine a new block

- **GET** `/chain` - Get entire blockchain

- **GET** `/chain/validate` - Validate blockchain integrity

### Smart Contract

- **GET** `/contract/info` - Get smart contract information

## Integration with Node.js Server

The blockchain service integrates with your existing Node.js server through HTTP requests. See `blockchainClient.js` for the integration layer.

### Transaction Flow

1. User initiates purchase in frontend
2. Node.js server receives payment request
3. Node.js calls blockchain service to create transaction
4. Blockchain service validates via smart contract
5. Transaction added to pending pool
6. Background worker mines blocks periodically
7. Transaction confirmed on blockchain
8. Node.js updates MongoDB with blockchain hash

## Smart Contract Features

The `EnergyTradingContract` implements:

- Transaction validation rules
- Balance management (future)
- Event logging
- Execution receipts

## Security Features

- RSA 2048-bit key pairs
- SHA-256 hashing
- Proof-of-work consensus
- Transaction signing and verification
- Input validation

## Database Schema

### Blocks Table

- block_index (PRIMARY KEY)
- timestamp
- transactions (JSON)
- proof
- previous_hash
- hash

### Transactions Table

- transaction_hash (UNIQUE)
- block_index (FOREIGN KEY)
- sender
- receiver
- amount
- listing_id
- quantity
- timestamp
- status

## Development

### Run in development mode:

```bash
export FLASK_ENV=development
python app.py
```

### Run tests:

```bash
python -m pytest tests/
```

## Production Deployment

For production, use a production-grade WSGI server:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

Or use the provided Docker setup:

```bash
docker build -t blockchain-service .
docker run -p 5001:5001 blockchain-service
```

## Environment Variables

- `FLASK_PORT`: Port number (default: 5001)
- `FLASK_ENV`: Environment (development/production)
- `NODE_SERVER_URL`: URL of Node.js server
- `SECRET_KEY`: Application secret key

## Monitoring

Monitor blockchain health:

```bash
curl http://localhost:5001/health
curl http://localhost:5001/info
```

## Troubleshooting

**Issue**: Service won't start

- Check if port 5001 is available
- Verify Python version (3.8+)
- Ensure all dependencies installed

**Issue**: Database errors

- Delete `blockchain_data.db` to reset
- Check file permissions

**Issue**: Transaction validation fails

- Verify all required fields
- Check smart contract rules
- Review logs for details

## Future Enhancements

- [ ] Implement balance checking
- [ ] Add transaction fees
- [ ] Implement consensus mechanisms
- [ ] Add peer-to-peer networking
- [ ] Implement merkle trees
- [ ] Add transaction rollback
- [ ] Implement gas optimization

## License

MIT License

## Support

For issues and questions, please open an issue in the repository.
