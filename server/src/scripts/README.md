# Database Seed Script

This directory contains the database seeding script to populate the CarbonEase application with sample data.

## Usage

To seed the database with sample data, run:

```bash
npm run seed
```

This will:
1. Clear all existing data from the database
2. Create sample users
3. Create sample carbon credit listings
4. Create sample transactions
5. Link all relationships between entities

## Seeded Data

### 👤 Users (6 total)

| Email | Password | Role | Name | Company |
|-------|----------|------|------|---------|
| yashsharma67953@gmail.com | Admin@123 | admin | Yash Sharma | CarbonEase Admin |
| yash22csu295@ncuindia.edu | Seller@123 | seller | Yash Kumar | Green Energy Solutions |
| y.s.gamer10310@gmail.com | Buyer@123 | buyer | Yash Singh | EcoTech Industries |
| seller1@example.com | Seller@456 | seller | Rajesh Mehta | Solar Power Corp |
| buyer1@example.com | Buyer@456 | buyer | Priya Sharma | Tech Innovations Ltd |
| both1@example.com | User@789 | both | Amit Patel | GreenTech Solutions |

### 🌱 Carbon Credit Listings (10 total)

1. **Reforestation Project - Amazon Rainforest** (5000 credits @ ₹15/credit)
   - Seller: yash22csu295@ncuindia.edu
   - Location: Amazon Basin, Brazil
   - Status: Available

2. **Wind Energy Farm - Rajasthan** (8000 credits @ ₹12/credit)
   - Seller: seller1@example.com
   - Location: Jaisalmer, Rajasthan, India
   - Status: Available

3. **Solar Power Installation - Gujarat** (6000 credits @ ₹13/credit)
   - Seller: seller1@example.com
   - Location: Kutch, Gujarat, India
   - Status: Available

4. **Waste-to-Energy Project - Mumbai** (4000 credits @ ₹14/credit)
   - Seller: yash22csu295@ncuindia.edu
   - Location: Mumbai, Maharashtra, India
   - Status: Available

5. **Sustainable Agriculture - Punjab** (3000 credits @ ₹11/credit)
   - Seller: both1@example.com
   - Location: Ludhiana, Punjab, India
   - Status: Available

6. **Mangrove Restoration - Kerala** (2500 credits @ ₹16/credit)
   - Seller: both1@example.com
   - Location: Kannur, Kerala, India
   - Status: Available

7. **Biogas Plant - Rural Haryana** (1500 credits @ ₹10/credit)
   - Seller: yash22csu295@ncuindia.edu
   - Location: Rohtak, Haryana, India
   - Status: Available

8. **Hydroelectric Power - Uttarakhand** (7000 credits @ ₹14/credit)
   - Seller: seller1@example.com
   - Location: Tehri, Uttarakhand, India
   - Status: Available

9. **Forest Conservation - Western Ghats** (9000 credits @ ₹17/credit) 
   - Seller: both1@example.com
   - Location: Western Ghats, Karnataka, India
   - Status: Sold

10. **Energy Efficiency - Industrial Park** (3500 credits @ ₹12/credit)
    - Seller: yash22csu295@ncuindia.edu
    - Location: Chennai, Tamil Nadu, India
    - Status: Pending

### 💰 Transactions (5 total)

1. **Forest Conservation Purchase**
   - Buyer: y.s.gamer10310@gmail.com
   - Seller: both1@example.com
   - Quantity: 1000 credits
   - Total: ₹17,000
   - Status: Completed
   - Date: Nov 1, 2024

2. **Wind Energy Purchase**
   - Buyer: buyer1@example.com
   - Seller: seller1@example.com
   - Quantity: 2000 credits
   - Total: ₹24,000
   - Status: Completed
   - Date: Nov 10, 2024

3. **Reforestation Purchase**
   - Buyer: both1@example.com
   - Seller: yash22csu295@ncuindia.edu
   - Quantity: 500 credits
   - Total: ₹7,500
   - Status: Completed
   - Date: Nov 15, 2024

4. **Energy Efficiency Purchase**
   - Buyer: y.s.gamer10310@gmail.com
   - Seller: yash22csu295@ncuindia.edu
   - Quantity: 800 credits
   - Total: ₹9,600
   - Status: Pending
   - Date: Nov 20, 2024

5. **Solar Power Purchase**
   - Buyer: buyer1@example.com
   - Seller: seller1@example.com
   - Quantity: 1500 credits
   - Total: ₹19,500
   - Status: Completed
   - Date: Nov 18, 2024

## Features

- ✅ All users are verified and active
- ✅ Passwords are properly hashed using bcrypt
- ✅ Listings include various project types (Reforestation, Renewable Energy, Waste Management, etc.)
- ✅ All listings have proper verification certificates
- ✅ Transactions include both completed and pending statuses
- ✅ User relationships (posted listings, transactions) are properly linked
- ✅ Realistic Indian locations and companies

## Notes

⚠️ **Warning**: This script will delete all existing data in the database before seeding. Use with caution in production environments.

💡 **Tip**: You can modify the `seedData.js` file to add more or different sample data as needed.
