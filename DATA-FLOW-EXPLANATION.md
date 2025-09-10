# 📊 How XCoinPay Stores Data in MongoDB Atlas

This document explains exactly how user registration, login, and KYC data flows from your frontend to MongoDB Atlas.

## 🏗️ Database Structure

### Collections in MongoDB Atlas:

1. **`users`** - Stores all user account information
2. **`transactions`** - Stores token purchase transactions

## 👤 User Registration Flow

### 1. Frontend Form Submission
```javascript
// User fills registration form
const userData = {
  name: "John Doe",
  email: "john@example.com", 
  password: "securePassword123",
  kycData: {  // Optional during registration
    fullName: "John Doe",
    dateOfBirth: "1990-01-01",
    nationality: "US",
    passportId: "A1234567",
    country: "United States",
    address: "123 Main St",
    city: "New York",
    postalCode: "10001"
  }
}
```

### 2. API Call to Backend
```javascript
// Frontend sends POST request
fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})
```

### 3. Backend Processing (`/api/register`)
```javascript
// 1. Check if user already exists
const existingUser = await User.findOne({ email });

// 2. Hash password for security
const hashedPassword = await bcrypt.hash(password, 12);

// 3. Create new user document
const user = new User({
  name,
  email,
  password: hashedPassword,  // Stored as hash, never plain text
  kycData: kycData || undefined,
  kycStatus: kycData ? 'pending' : 'none',
  kycCompleted: false,
  createdAt: new Date()
});

// 4. Save to MongoDB Atlas
await user.save();
```

### 4. Data Stored in MongoDB Atlas
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j4j4j4j4j4",
  "kycCompleted": false,
  "kycStatus": "pending",
  "kycData": {
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "nationality": "US",
    "passportId": "A1234567",
    "country": "United States",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001"
  },
  "walletAddress": null,
  "walletType": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🔐 User Login Flow

### 1. Frontend Login Form
```javascript
const loginData = {
  email: "john@example.com",
  password: "securePassword123"
}
```

### 2. API Call (`/api/login`)
```javascript
// 1. Find user by email
const user = await User.findOne({ email });

// 2. Verify password
const isValidPassword = await bcrypt.compare(password, user.password);

// 3. Generate JWT token
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### 3. Response to Frontend
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "kycCompleted": false,
    "kycStatus": "pending"
  }
}
```

## 📋 KYC Form Submission Flow

### 1. Frontend KYC Form
```javascript
const kycData = {
  fullName: "John Doe",
  dateOfBirth: "1990-01-01",
  nationality: "US",
  passportId: "A1234567",
  country: "United States",
  address: "123 Main St",
  city: "New York",
  postalCode: "10001"
}
```

### 2. API Call (`/api/kyc`)
```javascript
// 1. Verify JWT token
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 2. Find user
const user = await User.findById(decoded.userId);

// 3. Update KYC data
user.kycData = { fullName, dateOfBirth, nationality, passportId, country, address, city, postalCode };
user.kycStatus = 'pending';
user.kycCompleted = false;

// 4. Save to MongoDB Atlas
await user.save();
```

### 3. Updated User Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j4j4j4j4j4",
  "kycCompleted": false,
  "kycStatus": "pending",
  "kycData": {
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "nationality": "US",
    "passportId": "A1234567",
    "country": "United States",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001"
  },
  "walletAddress": null,
  "walletType": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 💰 Transaction Storage Flow

### 1. Token Purchase
```javascript
const transactionData = {
  amount: 100,
  tokens: 1000,
  bonusTokens: 100,
  totalTokens: 1100,
  txHash: "0x1234567890abcdef...",
  walletAddress: "0xabcdef1234567890..."
}
```

### 2. API Call (`/api/transactions`)
```javascript
// 1. Verify user token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.userId);

// 2. Create transaction
const transaction = new Transaction({
  userId: user._id,
  amount: 100,
  tokens: 1000,
  bonusTokens: 100,
  totalTokens: 1100,
  txHash: "0x1234567890abcdef...",
  walletAddress: user.walletAddress,
  status: 'completed',
  createdAt: new Date()
});

// 3. Save to MongoDB Atlas
await transaction.save();
```

### 3. Transaction Document in MongoDB Atlas
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 100,
  "tokens": 1000,
  "bonusTokens": 100,
  "totalTokens": 1100,
  "txHash": "0x1234567890abcdef...",
  "status": "completed",
  "walletAddress": "0xabcdef1234567890...",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

## 🔄 KYC Approval/Rejection Flow

### 1. Owner Receives Email
When KYC is submitted, owner gets email with approval/rejection links.

### 2. Approval (`/api/kyc/approve`)
```javascript
// 1. Find user by ID
const user = await User.findById(userId);

// 2. Update KYC status
user.kycStatus = 'approved';
user.kycCompleted = true;

// 3. Save to MongoDB Atlas
await user.save();
```

### 3. Rejection (`/api/kyc/reject`)
```javascript
// 1. Find user by ID
const user = await User.findById(userId);

// 2. Update KYC status
user.kycStatus = 'rejected';
user.kycCompleted = false;

// 3. Save to MongoDB Atlas
await user.save();
```

## 📊 Data Relationships

```
User Document
├── _id (ObjectId)
├── name, email, password
├── kycData (embedded object)
├── kycStatus, kycCompleted
└── walletAddress, walletType

Transaction Document
├── _id (ObjectId)
├── userId (references User._id)
├── amount, tokens, bonusTokens
├── txHash, status
└── walletAddress, createdAt
```

## 🔍 Viewing Data in MongoDB Atlas

### 1. Go to MongoDB Atlas Dashboard
- Login to your Atlas account
- Click on your cluster
- Click "Browse Collections"

### 2. View Collections
- **`users`** - All user accounts and KYC data
- **`transactions`** - All token purchase transactions

### 3. Sample Queries
```javascript
// Find all users with pending KYC
db.users.find({ kycStatus: "pending" })

// Find all completed transactions
db.transactions.find({ status: "completed" })

// Find user by email
db.users.findOne({ email: "john@example.com" })
```

## 🛡️ Security Features

1. **Password Hashing** - Passwords are never stored in plain text
2. **JWT Tokens** - Secure authentication without storing sessions
3. **Input Validation** - All data is validated before storage
4. **Encryption** - MongoDB Atlas encrypts data at rest and in transit
5. **Access Control** - Database user has limited permissions

## 📈 Data Flow Summary

```
Frontend Form → API Endpoint → Validation → MongoDB Atlas → Response
     ↓              ↓              ↓            ↓           ↓
  User Input → Backend Logic → Data Check → Cloud DB → Frontend Update
```

## 🎯 Key Points

- ✅ **All data is stored in MongoDB Atlas cloud database**
- ✅ **Passwords are hashed for security**
- ✅ **KYC data is embedded in user documents**
- ✅ **Transactions are separate documents linked to users**
- ✅ **Real-time updates when data changes**
- ✅ **Automatic backups and encryption**

---

**Your XCoinPay app securely stores all user data in MongoDB Atlas! 🚀**
