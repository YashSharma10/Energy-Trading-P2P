# CarbonEase - P2P Energy Trading Platform

Hackathon: HackKRMU 5.0
Theme: Crypto & Blockchain
Problem Statement (PS3): Peer-to-Peer Energy Trading Platform

## Overview
CarbonEase is a full-stack web platform that enables producers and consumers to list, discover, and trade surplus renewable energy in a transparent marketplace. The project delivers role-based dashboards, dynamic pricing, transaction records, and real-time communication.

## Implemented Features (High Level)
- Role-based authentication with OTP verification, password reset, and profiles (Producer, Consumer, Both, Admin).
- Energy listing marketplace with create, browse, search, filter, and pagination.
- P2P transaction flow with purchase, transaction history, and downloadable receipts.
- Dynamic pricing engine with market insights and batch price updates.
- Analytics dashboards for buyers, sellers, and market trends.
- Real-time chat between users via Socket.io.
- Admin console for user management, listings moderation, and platform stats.
- Eco marketplace module with checkout and order tracking.
- Blog and content management for platform updates.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Radix UI, Recharts, Socket.io client
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.io
- Auth & Security: JWT, rate limiting, validation (Joi), password hashing
- Payments & Messaging: Stripe, Nodemailer
- AI Pricing: Gemini API (dynamic price recommendations)

## Architecture (High Level)
- Client app handles UI, dashboards, and real-time chat.
- Express API serves auth, listings, pricing, analytics, and admin routes.
- MongoDB stores users, listings, transactions, and pricing history.
- Socket.io provides low-latency chat between buyers and sellers.

## Quick Start
1. Install dependencies in both apps:
   - Client: `cd client` then `npm install`
   - Server: `cd server` then `npm install`
2. Add environment variables for the server.
3. Run locally:
   - Client: `npm run dev`
   - Server: `npm run dev`

## Server Environment Variables
Create a `.env` in `server` with:
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

## Demo Flow
1. Register as Producer or Consumer.
2. Producer posts a listing; Consumer browses and purchases.
3. View transaction history and receipt.
4. Check dynamic pricing insights and analytics dashboards.
5. Chat in real time with counterparties.
