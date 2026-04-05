# CarbonEase - P2P Energy Trading Platform

Hackathon: HackKRMU 5.0
Theme: Crypto & Blockchain
Problem Statement (PS3): Peer-to-Peer Energy Trading Platform

## Overview

CarbonEase is a full-stack platform that enables producers and consumers to list, discover, and trade surplus renewable energy in a transparent marketplace. This branch includes a blockchain microservice with smart contract validation to record energy trades on-chain and store hashes in the core transaction history.

## Core Features

- Role-based auth with OTP verification, password reset, and profiles (Producer, Consumer, Both, Admin).
- Energy marketplace: create listings, browse/search, filters, pagination, and listing management.
- P2P transaction flow: purchase, transaction history, and downloadable receipts.
- Blockchain-backed recording: smart contract validation, transaction hash, and receipt metadata saved per trade.
- Automatic wallet creation for users (address and public key stored in MongoDB).
- Dynamic pricing engine with market insights and batch price updates.
- Analytics dashboards for buyers, sellers, and overall market trends.
- Real-time user chat via Socket.io.
- Admin console for users, listings, and platform stats.
- Eco marketplace module with checkout and order tracking.
- Blog and content management for platform updates.

## Blockchain Layer (Summary)

- Python Flask microservice exposes REST APIs for wallet creation, transaction submission, mining, and chain validation.
- Proof-of-work blockchain with SQLite persistence and a transaction pool.
- Smart contract logic validates transaction rules and emits execution receipts.
- Mining worker confirms pending transactions into blocks.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Radix UI, Recharts, Socket.io client
- Backend: Node.js, Express, MongoDB (Mongoose)
- Blockchain Service: Python (Flask), SQLite, cryptography
- Auth & Security: JWT, rate limiting, validation (Joi), password hashing
- Payments & Messaging: Stripe, Nodemailer
- AI Pricing: Gemini API (dynamic price recommendations)

## Architecture (High Level)

- Client app handles UI, dashboards, and real-time chat.
- Express API serves auth, listings, pricing, analytics, admin, and blockchain integration.
- MongoDB stores users, listings, transactions, pricing history, and wallet metadata.
- Blockchain microservice validates and records transactions; hashes are stored in MongoDB.
- Mining worker confirms transactions into blocks in the background.

## Quick Start

Recommended (starts all services):

- Windows: `start-all.bat`
- macOS/Linux: `./start-all.sh`

Manual start:

1. Blockchain service: `cd blockchain-service` then run `setup.sh` or `setup.bat`, and `python app.py`.
2. Mining worker (optional): `python worker.py`
3. Server: `cd server` then `npm install` and `npm run dev`
4. Client: `cd client` then `npm install` and `npm run dev`

## Environment Variables

Server (`server/.env`):

- `PORT`
- `MONGODB_URI`
- `MONGODB_URI_DIRECT` (optional fallback when SRV DNS fails)
- `MONGODB_DNS_SERVERS` (optional, e.g. `8.8.8.8,1.1.1.1`)
- `JWT_SECRET`
- `JWT_EXPIRY`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLIENT_URL`
- `GEMINI_API_KEY`
- `BLOCKCHAIN_SERVICE_URL`

Blockchain service (`blockchain-service/.env`):

- `FLASK_PORT`
- `FLASK_ENV`
- `NODE_SERVER_URL`
- `SECRET_KEY`

## Project Structure

```
Energy Trading P2P/
	client/                 # React frontend
	server/                 # Node.js/Express API
	blockchain-service/     # Flask blockchain microservice
	docker-compose.yml      # Optional multi-service setup
	start-all.bat           # Windows helper
	start-all.sh            # macOS/Linux helper
```

## Key API Endpoints (Highlights)

Server (Node/Express):

- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login
- `POST /api/credits/post` - create listing
- `GET /api/credits` - browse listings
- `POST /api/credits/payment` - purchase and record transaction
- `GET /api/pricing/market/insights` - market insights

Blockchain service (Flask):

- `GET /health` - service health
- `POST /wallet/create` - create wallet
- `POST /transaction/create` - submit transaction
- `POST /mine` - mine pending transactions
- `GET /chain` - full chain
- `GET /chain/validate` - validate chain

## Known Limitations / Future Work

- Replace demo PoW chain with production-grade blockchain or consortium network.
- Move private key custody fully to users (non-custodial) with wallet connectors.
- Add smart meter/IoT device integration for automated energy proof.
- Add on-chain settlement confirmations back to the UI in real time.
- Expand automated tests and CI for multi-service setup.

## Demo Flow

1. Register as Producer or Consumer.
2. Producer posts a listing; Consumer browses and purchases.
3. Transaction is recorded and linked to a blockchain hash.
4. View transaction history and receipt.
5. Check dynamic pricing insights and analytics dashboards.
6. Chat in real time with counterparties.
