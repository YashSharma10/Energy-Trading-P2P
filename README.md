# CarbonEase - P2P Energy Trading Platform

Hackathon: HackKRMU 5.0
Theme: Crypto & Blockchain
Problem Statement (PS3): Peer-to-Peer Energy Trading Platform

## Overview
CarbonEase is a full-stack platform that enables producers and consumers to list, discover, and trade surplus renewable energy in a transparent marketplace. This branch includes an integrated blockchain microservice with smart contract validation for transaction integrity.

## Implemented Features (High Level)
- Role-based authentication with OTP verification, password reset, and profiles (Producer, Consumer, Both, Admin).
- Energy listing marketplace with create, browse, search, filter, and pagination.
- P2P transaction flow with purchase, transaction history, and downloadable receipts.
- Blockchain-backed transaction recording with smart contract validation and on-chain hashes stored in MongoDB.
- Automatic wallet creation for users (public address + public key stored).
- Dynamic pricing engine with market insights and batch price updates.
- Analytics dashboards for buyers, sellers, and market trends.
- Real-time chat between users via Socket.io.
- Admin console for user management, listing moderation, and platform stats.
- Eco marketplace module with checkout and order tracking.
- Blog and content management for platform updates.

## Blockchain Layer (High Level)
- Python Flask microservice provides a proof-of-work blockchain and REST API.
- Smart contract logic validates transactions and generates execution receipts.
- Mining worker confirms pending transactions into blocks.
- Blockchain transaction hashes and receipts are linked to each marketplace transaction.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Radix UI, Recharts, Socket.io client
- Backend: Node.js, Express, MongoDB (Mongoose)
- Blockchain Service: Python (Flask), SQLite persistence, cryptography
- Auth & Security: JWT, rate limiting, validation (Joi), password hashing
- Payments & Messaging: Stripe, Nodemailer
- AI Pricing: Gemini API (dynamic price recommendations)

## Architecture (High Level)
- Client app handles UI, dashboards, and real-time chat.
- Express API serves auth, listings, pricing, analytics, and admin routes.
- MongoDB stores users, listings, transactions, and pricing history.
- Blockchain microservice validates and records transactions; hashes are stored in MongoDB.
- Mining worker confirms pending blockchain transactions.

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

## Demo Flow
1. Register as Producer or Consumer.
2. Producer posts a listing; Consumer browses and purchases.
3. Transaction is recorded and linked to a blockchain hash.
4. View transaction history and receipt.
5. Check dynamic pricing insights and analytics dashboards.
6. Chat in real time with counterparties.
