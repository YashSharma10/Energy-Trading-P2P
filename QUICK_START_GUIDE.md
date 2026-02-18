# Quick Start Guide - P2P Energy Trading Platform

## 🚀 Running the Application

### Step 1: Start the Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

Server will run on: `http://localhost:5000` (or your configured port)

### Step 2: Start the Frontend

```bash
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🧪 Testing the Role-Based System

### Scenario 1: Register and Test PRODUCER Role

1. **Open browser:** Go to `http://localhost:5173`
2. **Click "Sign Up"** or navigate to `/register`
3. **Fill in the form:**
   - Name: John Producer
   - Email: producer@test.com
   - Password: password123
   - **Select Role:** ⚡ Producer (Sell energy)
4. **Accept Terms** and click "Register"
5. **Verify OTP** (if email is configured, or auto-verified in dev mode)
6. **Login** with your credentials
7. **Expected Behavior:**
   - Redirected to `/dashboard/producer`
   - See Producer Dashboard with:
     - Total Earnings card
     - Active Listings
     - Energy Sold stats
   - Navbar shows "Sell Energy" link
   - Can access `/form` to create listings
   - Can access `/listings` to view all listings
   - **Cannot** access `/marketplace` (consumer route)

### Scenario 2: Register and Test CONSUMER Role

1. **Logout** from previous account
2. **Register new account:**
   - Name: Jane Consumer
   - Email: consumer@test.com
   - Password: password123
   - **Select Role:** 🛒 Consumer (Buy energy)
3. **Login** with new credentials
4. **Expected Behavior:**
   - Redirected to `/dashboard/consumer`
   - See Consumer Dashboard with:
     - Total Spent card
     - Energy Purchased
     - Purchase history
   - Navbar shows "Buy Energy" link
   - Can access `/marketplace` to browse energy
   - Can access `/buyer-analytics`
   - **Cannot** access `/form` (producer route)
   - **Cannot** access `/listings` (producer route)

### Scenario 3: Register and Test BOTH Role

1. **Logout** from previous account
2. **Register new account:**
   - Name: Alex Both
   - Email: both@test.com
   - Password: password123
   - **Select Role:** 🔄 Both (Buy & Sell energy)
3. **Login** with new credentials
4. **Expected Behavior:**
   - Redirected to `/dashboard` (Combined Dashboard)
   - See Combined Dashboard with:
     - Total Earnings AND Total Spent
     - Net Balance calculation
     - Three tabs: Sell Energy, Buy Energy, Transactions
   - Navbar shows **both** "Sell Energy" AND "Buy Energy" links
   - **Can access ALL routes:**
     - ✅ `/form` - Create listings
     - ✅ `/listings` - View seller listings
     - ✅ `/marketplace` - Browse energy
     - ✅ `/seller-analytics`
     - ✅ `/buyer-analytics`
     - ✅ All transaction routes

---

## 🔍 Testing Role-Based Access Control

### Test 1: Try Accessing Unauthorized Routes

**As PRODUCER user:**
```
Try navigating to: http://localhost:5173/marketplace
Expected: Redirected to /dashboard/producer (your role's dashboard)
```

**As CONSUMER user:**
```
Try navigating to: http://localhost:5173/form
Expected: Redirected to /dashboard/consumer (your role's dashboard)
```

**As BOTH user:**
```
Try navigating to: http://localhost:5173/marketplace
Expected: Access granted ✅

Try navigating to: http://localhost:5173/form
Expected: Access granted ✅
```

### Test 2: Verify Navbar Links

**PRODUCER user should see:**
- ✅ Calculator
- ✅ About Us
- ✅ Contact Us
- ✅ Blog
- ✅ Sell Energy
- ✅ Dashboard
- ❌ Buy Energy (not visible)

**CONSUMER user should see:**
- ✅ Calculator
- ✅ About Us
- ✅ Contact Us
- ✅ Blog
- ✅ Buy Energy
- ✅ Dashboard
- ❌ Sell Energy (not visible)

**BOTH user should see:**
- ✅ Calculator
- ✅ About Us
- ✅ Contact Us
- ✅ Blog
- ✅ Sell Energy
- ✅ Buy Energy
- ✅ Dashboard

### Test 3: API Authentication

**Using Postman or curl:**

1. **Register a new user:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "PRODUCER"
}
```

2. **Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response will include:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "PRODUCER"
  }
}
```

3. **Access Protected Route:**
```bash
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <your_token_here>
```

---

## 🎯 Feature Checklist

### Registration Flow
- [ ] Can select role during registration
- [ ] All three roles are available (PRODUCER, CONSUMER, BOTH)
- [ ] Visual icons show for each role
- [ ] Role validation works (invalid roles rejected)

### Login Flow
- [ ] PRODUCER redirects to `/dashboard/producer`
- [ ] CONSUMER redirects to `/dashboard/consumer`
- [ ] BOTH redirects to `/dashboard`
- [ ] Token stored in localStorage
- [ ] User data available in AuthContext

### Dashboard Features
- [ ] Producer Dashboard shows seller stats
- [ ] Consumer Dashboard shows buyer stats
- [ ] Combined Dashboard shows both stats
- [ ] All dashboards have proper tabs
- [ ] Navigation buttons work correctly

### Role-Based Access
- [ ] PRODUCER can access seller routes only
- [ ] CONSUMER can access buyer routes only
- [ ] BOTH can access all routes
- [ ] Unauthorized access gets redirected
- [ ] Backend middleware enforces roles

### Navbar
- [ ] Shows correct links based on role
- [ ] Dashboard link points to correct dashboard
- [ ] Logout functionality works
- [ ] Mobile menu works properly

---

## 📊 Sample Test Data

Create these test accounts for comprehensive testing:

```javascript
// Producer Account
{
  name: "Solar Energy Co",
  email: "solar@energy.com",
  password: "producer123",
  role: "PRODUCER"
}

// Consumer Account
{
  name: "Green Buildings Inc",
  email: "buildings@green.com",
  password: "consumer123",
  role: "CONSUMER"
}

// Both Account
{
  name: "Hybrid Energy Solutions",
  email: "hybrid@energy.com",
  password: "both123",
  role: "BOTH"
}
```

---

## 🐛 Common Testing Issues

### Issue: "User already exists" error
**Solution:** Use a different email or delete the user from MongoDB

### Issue: Redirected to login after page refresh
**Solution:** 
- Check if token is in localStorage
- Verify AuthContext is fetching user on mount
- Check browser console for errors

### Issue: Cannot access any routes
**Solution:**
- Ensure backend is running
- Check API endpoint configuration
- Verify JWT_SECRET is set in backend .env

### Issue: Role validation not working
**Solution:**
- Check role value is exactly: PRODUCER, CONSUMER, or BOTH (case-sensitive)
- Verify JWT includes role in payload
- Check roleMiddleware implementation

---

## 🔧 Developer Tools

### Check Current User in Browser Console
```javascript
// Get token
localStorage.getItem('authToken')

// Decode JWT (paste token in jwt.io)
// Should see: { userId: "...", role: "PRODUCER" }
```

### MongoDB Queries
```javascript
// Find user by email
db.users.findOne({ email: "producer@test.com" })

// Check user's role
db.users.findOne({ email: "producer@test.com" }).role

// Update user role (for testing)
db.users.updateOne(
  { email: "producer@test.com" },
  { $set: { role: "BOTH" } }
)
```

---

## 📈 Performance Tips

1. **Use React DevTools:** Check component re-renders
2. **Use Network Tab:** Verify API calls
3. **Use Redux DevTools:** If using Redux (currently using Context)
4. **Monitor localStorage:** Check token persistence

---

## 🎓 Learning Points

### Key Concepts Demonstrated

1. **JWT Authentication:** Token-based auth with role payload
2. **Role-Based Access Control (RBAC):** Backend middleware + Frontend guards
3. **React Context API:** Global state management
4. **Protected Routes:** Route-level authentication
5. **Conditional Rendering:** Dynamic UI based on role
6. **RESTful API Design:** Standard auth endpoints
7. **Password Security:** Bcrypt hashing
8. **Form Validation:** Client and server-side
9. **Error Handling:** Proper error messages
10. **Responsive Design:** Mobile-friendly UI

---

## 🚦 Ready to Go!

Your P2P Energy Trading Platform with role-based authentication is now fully functional!

**Next Steps:**
1. Test all three roles thoroughly
2. Customize dashboards with real data
3. Add more features as needed
4. Deploy to production

**Happy Trading! ⚡🌟**
