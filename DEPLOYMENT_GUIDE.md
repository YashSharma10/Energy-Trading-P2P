# CarbonEase Deployment Guide

Simple setup with two environments: **Local** (development) and **Dev** (development server).

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Local Development Setup

**Step 1: Configure Environment Variables**

Edit `server/.env`:
```
# Uncomment LOCAL section, comment out DEV section
NODE_ENV=local
PORT=3000
MONGODB_URI=mongodb://localhost:27017/carbonease-local
...
```

Edit `client/.env`:
```
# Uncomment LOCAL section, comment out DEV section
VITE_API_URL=http://localhost:3000/api
VITE_ENV=local
...
```

**Step 2: Install & Run**

```bash
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

---

### 2️⃣ Dev Environment Setup

**Step 1: Configure Environment Variables**

Edit `server/.env`:
```
# Comment out LOCAL section, uncomment DEV section
# NODE_ENV=local
...

NODE_ENV=dev
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/carbonease-dev
...
```

Edit `client/.env`:
```
# Comment out LOCAL section, uncomment DEV section
# VITE_API_URL=http://localhost:3000/api
...

VITE_API_URL=https://dev-api.carbonease.com/api
VITE_ENV=dev
...
```

**Step 2: Build & Start**

```bash
# Build frontend
cd client
npm run dev:build

# Start backend
cd ../server
npm start
```

---

## 📝 .env File Structure

### Backend (server/.env)

```dotenv
# ============================================================
# LOCAL DEVELOPMENT ENVIRONMENT
# ============================================================

NODE_ENV=local
PORT=3000
MONGODB_URI=mongodb://localhost:27017/carbonease-local
JWT_SECRET=your-local-secret-key-change-this
JWT_EXPIRY=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173

# ============================================================
# DEV ENVIRONMENT (Comment out LOCAL, uncomment DEV)
# ============================================================

# NODE_ENV=dev
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/carbonease-dev
# JWT_SECRET=your-dev-secret-key-min-32-chars
# FRONTEND_URL=https://dev.carbonease.com
```

### Frontend (client/.env)

```dotenv
# ============================================================
# LOCAL DEVELOPMENT ENVIRONMENT
# ============================================================

VITE_API_URL=http://localhost:3000/api
VITE_ENV=local
VITE_APP_NAME=CarbonEase Local

# ============================================================
# DEV ENVIRONMENT (Comment out LOCAL, uncomment DEV)
# ============================================================

# VITE_API_URL=https://dev-api.carbonease.com/api
# VITE_ENV=dev
# VITE_APP_NAME=CarbonEase Dev
```

---

## 🛠️ Configuration Guide

### JWT Secret
Use a strong key (minimum 32 characters):
```bash
JWT_SECRET=your-very-strong-secret-key-with-32-or-more-characters
```

### MongoDB Connection

**Local:**
```
MONGODB_URI=mongodb://localhost:27017/carbonease-local
```

**Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonease-dev
```

### Email Configuration
Get Gmail App Password: https://myaccount.google.com/apppasswords

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password (16 characters from Gmail)
EMAIL_FROM=noreply@carbonease.com
```

### Gemini AI API Key
Get from: https://aistudio.google.com/app/apikey

```
GEMINI_API_KEY=your-api-key
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

# Start for dev deployment
npm start

# Seed database
npm run seed

# Add listings to users
npm run add-listings

# Add transactions
npm run add-transactions
```

---

## 🌐 Deploying Dev Environment

### Option 1: VPS (DigitalOcean, Linode, AWS EC2)

```bash
# SSH into your server
ssh user@your-server-ip

# Clone repository
git clone <your-repo-url>
cd CarbonEase-2.0/Energy\ Trading\ P2P

# Install dependencies
cd server && npm ci
cd ../client && npm ci

# Edit .env files for dev
nano server/.env   # uncomment DEV section
nano client/.env   # uncomment DEV section

# Build frontend
cd client && npm run dev:build

# Copy frontend to web server location
mkdir -p /var/www/carbonease
cp -r dist/* /var/www/carbonease/

# Install PM2 globally
sudo npm install -g pm2

# Start backend
cd ../server
pm2 start index.js --name "carbonease-api"
pm2 startup
pm2 save

# Configure nginx (see config below)
sudo apt-get install -y nginx
```

**Nginx Configuration** (`/etc/nginx/sites-available/carbonease`):
```nginx
upstream api {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-dev-domain.com;

    location / {
        root /var/www/carbonease;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api;
        proxy_set_header Host $host;
    }
}
```

### Option 2: Railway.app

1. Create project at railway.app
2. Add MongoDB service
3. Deploy from GitHub
4. Set environment variables in dashboard:
   - `NODE_ENV=dev`
   - `MONGODB_URI=your-connection-string`
   - `JWT_SECRET=your-secret`
   - etc.

### Option 3: Render.com

1. Create account at render.com
2. Connect GitHub
3. Create Web Service
4. Set environment variables
5. Deploy!

---

## ✅ Deployment Checklist

### Before Dev Deployment

- [ ] `NODE_ENV=dev` in `server/.env`
- [ ] `VITE_ENV=dev` in `client/.env`
- [ ] MongoDB connection string is correct
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Email credentials are valid (if using email)
- [ ] FRONTEND_URL matches your domain
- [ ] Frontend build completes: `npm run dev:build`
- [ ] Backend starts: `npm start`
- [ ] Test endpoints with Postman/curl

### After Deployment

- [ ] Test login endpoint
- [ ] Test OTP verification
- [ ] Test email notifications
- [ ] Monitor server logs
- [ ] Set up database backups

---

## 🔄 Switching Between Environments

Quick method:

```bash
# Show environment info
switch-env.bat local    # Windows
./switch-env.sh local   # Mac/Linux

# Then manually edit .env files
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `lsof -i :3000 \| awk '{print $2}' \| xargs kill -9` |
| **Build fails** | `rm -rf node_modules && npm ci` |
| **.env not loading** | Restart dev server after changes |
| **CORS errors** | Check FRONTEND_URL in backend .env |
| **MongoDB won't connect** | Verify connection string is correct |
| **Email not sending** | Check EMAIL_USER and EMAIL_PASS |

---

## 📞 Quick Commands

```bash
# Local Development
cd server && npm run dev
cd client && npm run dev

# Dev Build & Deploy
cd client && npm run dev:build
cd ../server && npm start

# Seed database
npm run seed

# View logs
pm2 logs carbonease-api
```

---

**Last Updated:** February 18, 2026
