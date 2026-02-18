# CarbonEase Deployment Guide

Simple setup with two environments: **Local** (development) and **Dev** (development server).

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Local Development Setup

**Windows:**
```bash
switch-env.bat local

# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

**Mac/Linux:**
```bash
chmod +x switch-env.sh
./switch-env.sh local

# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

Your app will be running at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **MongoDB:** localhost:27017

### 2️⃣ Dev Environment Setup

For a development server deployment:

**Windows:**
```bash
switch-env.bat dev

# Build frontend
cd client
npm run dev:build

# Start backend
cd ../server
npm start
```

**Mac/Linux:**
```bash
./switch-env.sh dev

# Build frontend
cd client
npm run dev:build

# Start backend
cd ../server
npm start
```

---

## 📦 Environment Files

### Frontend
```
client/.env.local  → Local development (http://localhost:3000)
client/.env.dev    → Dev environment (https://dev-api.carbonease.com)
```

### Backend
```
server/.env.local  → Local development
server/.env.dev    → Dev environment
```

### Customizing URLs

**Edit local development:**
```bash
# client/.env.local
VITE_API_URL=http://localhost:3000/api
VITE_ENV=local

# server/.env.local
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/carbonease-local
```

**Edit dev environment:**
```bash
# client/.env.dev
VITE_API_URL=https://your-dev-api-url/api
VITE_ENV=dev

# server/.env.dev
FRONTEND_URL=https://your-dev-frontend-url
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonease-dev
```

---

## 📊 Build & Deployment Scripts

### Frontend Commands

```bash
# Development (local) - hot reload
npm run dev

# Build for dev environment
npm run dev:build

# Preview build
npm run preview

# Linting
npm run lint
```

### Backend Commands

```bash
# Development (local) - with nodemon auto-reload
npm run dev

# Production start (uses .env.dev)
npm start

# Seed database
npm run seed

# Add listings to users
npm run add-listings

# Add transactions
npm run add-transactions
```

---

## 🛠️ Configuration

### JWT Secret
Change in both `.env.local` and `.env.dev`:
```bash
JWT_SECRET=your-secret-key-min-32-characters
```

### MongoDB Connection
- **Local:** `mongodb://localhost:27017/carbonease-local`
- **Atlas:** `mongodb+srv://username:password@cluster.mongodb.net/carbonease-dev`

### Email Configuration
Update in `.env` files:
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@carbonease.com
```

### Gemini AI API Key
Add to both `.env` files:
```bash
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🌐 Deploying Dev Environment

### Easy Deployment Options

#### Option 1: VPS (DigitalOcean, Linode, AWS EC2)

```bash
# SSH into your server
ssh user@your-server-ip

# Clone repository
git clone <your-repo-url>
cd CarbonEase-2.0/Energy\ Trading\ P2P

# Install dependencies
cd server && npm ci
cd ../client && npm ci

# Switch to dev environment
./switch-env.sh dev

# Build frontend
cd client && npm run build

# Copy frontend to server location
mkdir -p /var/www/carbonease
cp -r dist/* /var/www/carbonease/

# Install PM2 globally
sudo npm install -g pm2

# Start backend with PM2
cd ../server
pm2 start index.js --name "carbonease-api"
pm2 startup
pm2 save

# Install and configure nginx
sudo apt-get update
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/carbonease
# Add configuration (see nginx config below)
sudo ln -s /etc/nginx/sites-available/carbonease /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Nginx Configuration** (`/etc/nginx/sites-available/carbonease`):
```nginx
upstream api {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-dev-domain.com;

    # Frontend
    location / {
        root /var/www/carbonease;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Compress responses
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### Option 2: Railway.app

1. Create account at railway.app
2. Create new project
3. Add PostgreSQL or MongoDB
4. Deploy from GitHub repository
5. Set environment variables in Railway dashboard
6. Deploy!

#### Option 3: Render.com

1. Create account at render.com
2. Connect GitHub
3. Create new Web Service
4. Select repository and branch
5. Set environment variables
6. Deploy!

---

## ✅ Deployment Checklist

### Before Dev Deployment

- [ ] All environment variables set in `.env.dev`
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB connection string is correct
- [ ] Email credentials are valid
- [ ] Frontend build completes: `npm run dev:build`
- [ ] Backend starts: `npm start`
- [ ] CORS configured for your domain
- [ ] FRONTEND_URL matches your deployment URL
- [ ] SSL/HTTPS configured (recommended)

### After Deployment

- [ ] Test login endpoint
- [ ] Test OTP verification
- [ ] Test email notifications
- [ ] Test file uploads (if applicable)
- [ ] Monitor logs for errors
- [ ] Set up automated backups

---

## 🔄 Updating Your Code

### Pull Latest Changes
```bash
git pull origin main
npm ci  # in both client and server directories
npm run dev
```

### Deploy Updates
```bash
# Switch to dev
./switch-env.sh dev

# Frontend
cd client
npm run dev:build

# Backend
cd ../server
npm start
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `lsof -i :3000 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| **Build fails** | Delete node_modules and run `npm ci` |
| `.env` not loaded | Restart dev server after changing `.env` |
| **CORS errors** | Check FRONTEND_URL in backend `.env` |
| **MongoDB won't connect** | Verify connection string and database exists |
| **Email not sending** | Check email credentials in `.env` |

---

## 📝 Environment Variables Reference

### Frontend (.env.local / .env.dev)
```
VITE_API_URL     → Backend API URL
VITE_ENV         → Environment name (local or dev)
VITE_APP_NAME    → App display name
```

### Backend (.env.local / .env.dev)
```
NODE_ENV         → Environment (local or dev)
PORT             → Server port
MONGODB_URI      → Database connection string
JWT_SECRET       → JWT signing key (min 32 chars)
JWT_EXPIRY       → Token expiration
EMAIL_USER       → Email username
EMAIL_PASS       → Email password
FRONTEND_URL     → Frontend origin (for CORS)
GEMINI_API_KEY   → Gemini AI API key
```

---

## 📞 Quick Help

**Stuck?**
1. Check `.env` files are properly configured
2. Ensure MongoDB is running and accessible
3. Clear node_modules: `rm -rf node_modules && npm ci`
4. Check ports 3000 and 5173 are not in use
5. Restart both dev servers

---

**Last Updated:** February 18, 2026
