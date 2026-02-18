# P2P Energy Trading Platform - Role-Based Authentication Guide

## Overview
Complete role-based authentication and authorization system for a Peer-to-Peer Energy Trading Platform with three distinct user roles: PRODUCER (sellers), CONSUMER (buyers), and BOTH (producer + consumer).

---

## 🎯 Features Implemented

### Backend (Node.js + Express + MongoDB + JWT)

#### 1. User Model (`server/src/models/userModel.js`)
- **Fields:**
  - `name`: User's full name
  - `email`: Unique email address
  - `password`: Bcrypt hashed password
  - `role`: Enum with values: `PRODUCER`, `CONSUMER`, `BOTH`, `admin`
  - `createdAt`: Timestamp of account creation
  - Additional fields: company, phone, totalCredits, totalSpents, etc.

- **Methods:**
  - `comparePassword()`: Compares plaintext password with hashed password
  - `generateAuthToken()`: Generates JWT with userId and role

#### 2. Authentication Controller (`server/src/controllers/authController.js`)
- **POST `/api/auth/register`:**
  - Accepts: email, password, name, role
  - Validates role (must be PRODUCER, CONSUMER, or BOTH)
  - Creates user with hashed password
  - Sends OTP for email verification (or auto-verifies in dev mode)

- **POST `/api/auth/login`:**
  - Validates credentials
  - Returns JWT token containing userId and role
  - Returns user object with role information

- **GET `/api/auth/profile`:**
  - Protected route (requires JWT)
  - Returns authenticated user's profile

#### 3. Middleware (`server/src/middlewares/authMiddleware.js`)
- **`authMiddleware`:**
  - Verifies JWT token from Authorization header
  - Attaches user data (userId, role) to request object

- **`roleMiddleware(allowedRoles)`:**
  - Checks if user's role is in allowed roles array
  - Special handling for `BOTH` role - grants access to both PRODUCER and CONSUMER routes
  - Returns 403 if user lacks permission

#### 4. Example Usage in Routes
```javascript
import { authMiddleware, roleMiddleware } from './middlewares/authMiddleware.js';

// Only PRODUCER can access
router.get('/seller-only', authMiddleware, roleMiddleware(['PRODUCER']), sellerController);

// Only CONSUMER can access
router.get('/buyer-only', authMiddleware, roleMiddleware(['CONSUMER']), buyerController);

// BOTH role can access both routes automatically
```

---

### Frontend (React + Tailwind CSS)

#### 1. Auth Context (`client/src/context/AuthContext.jsx`)
- Manages global authentication state
- Stores user object and token
- Persists token in localStorage
- Auto-fetches user profile on mount if token exists

#### 2. Registration Page (`client/src/features/auth/Register.jsx`)
**Features:**
- Name input field
- Email input field
- Password input field
- **Role selection with radio buttons:**
  - 🔌 **Producer** - Sell surplus energy
  - 🛒 **Consumer** - Buy energy
  - 🔄 **Both** - Buy & Sell energy
- Terms & Conditions checkbox
- Beautiful UI with icons and visual feedback

**Flow:**
1. User fills in credentials and selects role
2. Submits registration
3. Redirected to OTP verification page
4. After verification, can login

#### 3. Login Page (`client/src/features/auth/Login.jsx`)
**Role-Based Redirects:**
- `PRODUCER` → `/dashboard/producer`
- `CONSUMER` → `/dashboard/consumer`
- `BOTH` → `/dashboard`
- `admin` → `/admin`

#### 4. Dashboard Components

##### A. Producer Dashboard (`client/src/features/seller/ProducerDashboard.jsx`)
**Features:**
- 📊 **Stats Cards:**
  - Total Earnings
  - Active Listings
  - Energy Sold (kWh)
  - Total Transactions
  
- 📑 **Tabs:**
  - **Listings**: View active energy listings
  - **Transactions**: Recent sales history
  - **Analytics**: Performance metrics
  
- **Actions:**
  - Create new energy listing
  - View/manage listings
  - Track earnings

##### B. Consumer Dashboard (`client/src/features/buyer/ConsumerDashboard.jsx`)
**Features:**
- 📊 **Stats Cards:**
  - Total Spent
  - Energy Purchased (kWh)
  - Active Purchases
  - Total Transactions
  
- 📑 **Tabs:**
  - **Marketplace**: Browse available energy
  - **Purchases**: Purchase history
  - **Analytics**: Consumption metrics
  
- **Actions:**
  - Browse marketplace
  - Purchase energy
  - Track spending

##### C. Combined Dashboard (`client/src/features/shared/CombinedDashboard.jsx`)
**For BOTH role - Features both buying and selling:**
- 📊 **Stats Cards:**
  - Total Earnings (from selling)
  - Total Spent (from buying)
  - Net Balance (profit/loss)
  - Energy Balance (sold vs consumed)
  
- 📑 **Tabs:**
  - **Sell Energy**: Manage listings and view earnings
  - **Buy Energy**: Browse and purchase energy
  - **Transactions**: Complete transaction history (sales + purchases)
  
- **Actions:**
  - All producer actions
  - All consumer actions
  - Unified transaction view

#### 5. Protected Routes (`client/src/components/layout/`)

##### ProtectedRoute.jsx
- Checks if user is authenticated
- Redirects to login if not authenticated

##### RoleBasedRoute.jsx
- Checks if user has required role
- **Special handling for BOTH role:**
  - Users with `BOTH` role can access all PRODUCER and CONSUMER routes
- Redirects to appropriate dashboard if role doesn't match

#### 6. Dynamic Navbar (`client/src/components/common/Navbar.jsx`)
**Shows different links based on role:**
- **PRODUCER or BOTH:** "Sell Energy" link
- **CONSUMER or BOTH:** "Buy Energy" link
- **All roles:** Dynamic dashboard link pointing to correct dashboard
- **Responsive:** Works on mobile and desktop

#### 7. App Routing (`client/src/App.jsx`)
```jsx
// Producer Dashboard - PRODUCER and BOTH
/dashboard/producer → ProducerDashboard

// Consumer Dashboard - CONSUMER and BOTH
/dashboard/consumer → ConsumerDashboard

// Combined Dashboard - BOTH only
/dashboard → CombinedDashboard

// Seller routes - PRODUCER and BOTH
/listings → All seller listings
/form → Create new listing
/seller-analytics → Seller analytics

// Buyer routes - CONSUMER and BOTH
/marketplace → Browse energy
/buyer-analytics → Buyer analytics

// Common routes - All energy trading roles
/payment → Payment processing
/transaction-listing → Transaction history
```

---

## 🚀 Getting Started

### Backend Setup

1. **Install Dependencies:**
```bash
cd server
npm install
```

2. **Environment Variables (.env):**
```env
JWT_SECRET=your_secret_key_here
TOKEN_EXPIRY=7d
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

3. **Start Server:**
```bash
npm run dev
```

### Frontend Setup

1. **Install Dependencies:**
```bash
cd client
npm install
```

2. **Start Development Server:**
```bash
npm run dev
```

---

## 📝 API Endpoints

### Authentication
```
POST /api/auth/register
Body: { email, password, name, role }
Response: { success, message }

POST /api/auth/login
Body: { email, password }
Response: { success, token, user: { id, email, name, role } }

GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: { success, user }
```

---

## 🔐 Role-Based Access Control

### PRODUCER Role
- Can access: Seller routes, Producer Dashboard
- Can: Create listings, view earnings, manage energy sales
- Cannot: Access consumer-specific features

### CONSUMER Role
- Can access: Buyer routes, Consumer Dashboard
- Can: Browse marketplace, purchase energy, view spending
- Cannot: Create listings or sell energy

### BOTH Role
- Can access: ALL producer and consumer routes
- Has: Combined Dashboard with both functionalities
- Unique: Can sell AND buy energy in one account

### Admin Role
- Full access to admin panel
- Can manage users and platform

---

## 🎨 UI/UX Highlights

1. **Beautiful Registration:** Role selection with visual icons and descriptions
2. **Smart Redirects:** Automatic redirect to correct dashboard after login
3. **Dynamic Navigation:** Navbar shows relevant links based on user role
4. **Responsive Design:** Works perfectly on all devices
5. **Modern UI:** Tailwind CSS with shadcn/ui components
6. **Visual Feedback:** Loading states, error messages, success notifications

---

## 🔒 Security Features

1. **Password Hashing:** Bcrypt with salt rounds
2. **JWT Authentication:** Secure token-based auth
3. **Protected Routes:** Backend middleware + Frontend route guards
4. **Role Validation:** Both client and server-side
5. **Token Expiry:** Configurable token lifetime
6. **CORS Protection:** Configured for security

---

## 📚 File Structure

```
server/
├── src/
│   ├── models/
│   │   └── userModel.js          # User schema with roles
│   ├── controllers/
│   │   └── authController.js     # Login, Register, Profile
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT + Role middleware
│   └── routes/
│       └── authRoute.js          # Auth endpoints

client/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state
│   ├── features/
│   │   ├── auth/
│   │   │   ├── Register.jsx      # Registration with role selection
│   │   │   └── Login.jsx         # Login with role-based redirect
│   │   ├── seller/
│   │   │   └── ProducerDashboard.jsx
│   │   ├── buyer/
│   │   │   └── ConsumerDashboard.jsx
│   │   └── shared/
│   │       └── CombinedDashboard.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleBasedRoute.jsx
│   │   └── common/
│   │       └── Navbar.jsx        # Dynamic role-based nav
│   └── services/
│       └── authService.js        # API calls
```

---

## 🧪 Testing the System

### Test User Scenarios

1. **Register as PRODUCER:**
   - Create account with Producer role
   - Login → Redirects to `/dashboard/producer`
   - See "Sell Energy" in navbar
   - Can create listings

2. **Register as CONSUMER:**
   - Create account with Consumer role
   - Login → Redirects to `/dashboard/consumer`
   - See "Buy Energy" in navbar
   - Can browse marketplace

3. **Register as BOTH:**
   - Create account with Both role
   - Login → Redirects to `/dashboard`
   - See both "Sell Energy" and "Buy Energy" in navbar
   - Can access all features
   - Combined dashboard with tabs

---

## 💡 Key Implementation Details

### How BOTH Role Works
The `BOTH` role is special - it's automatically granted access to routes requiring either `PRODUCER` or `CONSUMER`:

**Backend (roleMiddleware):**
```javascript
if (userRole === "BOTH") {
  return next(); // Auto-allow
}
```

**Frontend (RoleBasedRoute):**
```javascript
if (user.role === "BOTH") {
  return children; // Auto-allow
}
```

### JWT Payload Structure
```javascript
{
  userId: "64abc123...",
  role: "PRODUCER", // or "CONSUMER", "BOTH", "admin"
  iat: 1234567890,
  exp: 1234567890
}
```

---

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid role" error:**
   - Ensure role is exactly: PRODUCER, CONSUMER, or BOTH (case-sensitive)

2. **Redirecting to wrong dashboard:**
   - Check user.role in AuthContext
   - Verify JWT payload includes role

3. **Cannot access routes:**
   - Check if roleMiddleware is applied correctly
   - Verify allowedRoles array includes user's role

4. **Token expired:**
   - Adjust TOKEN_EXPIRY in .env
   - Implement refresh token logic if needed

---

## 🎯 Next Steps / Enhancements

1. **Email Verification:** Full OTP flow with email service
2. **Password Reset:** Forgot password functionality
3. **Profile Updates:** Allow users to update profile (not change role)
4. **Real Data Integration:** Connect dashboards to real APIs
5. **Transaction Processing:** Implement actual energy trading logic
6. **Payment Gateway:** Integrate payment processing
7. **Admin Panel:** Full user management for admins
8. **Analytics:** Real-time charts and statistics
9. **Notifications:** Real-time updates on trades
10. **Role Change Requests:** Allow users to request role changes

---

## 📄 License
This implementation is part of the CarbonEase P2P Energy Trading Platform.

---

## 👨‍💻 Support
For issues or questions, please refer to the project documentation or contact the development team.
