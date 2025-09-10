# 📊 XCoinPay Data Flow Diagram

## 🔄 Complete Data Flow from Frontend to MongoDB Atlas

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │  MONGODB ATLAS  │
│   (React App)   │    │  (Node.js API)  │    │  (Cloud DB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐              ┌────▼────┐
    │ 1. User │              │ 2. API│              │ 3. Data │
    │ Fills   │              │ Route │              │ Storage │
    │ Form    │              │ Logic │              │         │
    └────┬────┘              └───┬───┘              └────┬────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
```

## 👤 User Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                            │
└─────────────────────────────────────────────────────────────────┘

Frontend Form → POST /api/register → Backend Processing → MongoDB Atlas

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   API       │    │  Password   │    │   Users     │
│   Input:    │───▶│   Route:    │───▶│   Hashing   │───▶│ Collection  │
│             │    │             │    │             │    │             │
│ • name      │    │ /api/       │    │ bcrypt.hash │    │ Document:   │
│ • email     │    │ register    │    │ (password,  │    │ {           │
│ • password  │    │             │    │  12 rounds) │    │   _id: ...  │
│ • kycData   │    │             │    │             │    │   name: ... │
│   (optional)│    │             │    │             │    │   email: ...│
└─────────────┘    └─────────────┘    └─────────────┘    │   password: │
                                                         │   hash      │
                                                         │   kycData:  │
                                                         │   {...}     │
                                                         │   kycStatus:│
                                                         │   "pending" │
                                                         │ }           │
                                                         └─────────────┘
```

## 🔐 User Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER LOGIN                                 │
└─────────────────────────────────────────────────────────────────┘

Frontend Form → POST /api/login → Backend Processing → JWT Token

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   API       │    │  Password   │    │   JWT       │
│   Input:    │───▶│   Route:    │───▶│   Verify    │───▶│   Token     │
│             │    │             │    │             │    │             │
│ • email     │    │ /api/       │    │ bcrypt.     │    │ {           │
│ • password  │    │ login       │    │ compare()   │    │   userId:   │
│             │    │             │    │             │    │   email:    │
│             │    │             │    │             │    │   exp: 24h  │
└─────────────┘    └─────────────┘    └─────────────┘    │ }           │
                                                         └─────────────┘
```

## 📋 KYC Form Submission Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    KYC SUBMISSION                               │
└─────────────────────────────────────────────────────────────────┘

Frontend Form → POST /api/kyc → Backend Processing → MongoDB Atlas

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   KYC       │    │   API       │    │   JWT       │    │   Users     │
│   Data:     │───▶│   Route:    │───▶│   Verify    │───▶│ Collection  │
│             │    │             │    │             │    │             │
│ • fullName  │    │ /api/kyc    │    │ jwt.verify  │    │ Update:     │
│ • dateOfBirth│   │             │    │ (token)     │    │ {           │
│ • nationality│   │             │    │             │    │   kycData:  │
│ • passportId │   │             │    │             │    │   {...}     │
│ • country   │    │             │    │             │    │   kycStatus:│
│ • address   │    │             │    │             │    │   "pending" │
│ • city      │    │             │    │             │    │ }           │
│ • postalCode│    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 💰 Transaction Storage Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  TRANSACTION STORAGE                            │
└─────────────────────────────────────────────────────────────────┘

Frontend Form → POST /api/transactions → Backend Processing → MongoDB Atlas

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Transaction │    │   API       │    │   JWT       │    │Transactions│
│   Data:     │───▶│   Route:    │───▶│   Verify    │───▶│ Collection  │
│             │    │             │    │             │    │             │
│ • amount    │    │ /api/       │    │ jwt.verify  │    │ Document:   │
│ • tokens    │    │ transactions│    │ (token)     │    │ {           │
│ • bonusTokens│   │             │    │             │    │   _id: ...  │
│ • totalTokens│   │             │    │             │    │   userId:   │
│ • txHash    │    │             │    │             │    │   amount:   │
│ • walletAddr│    │             │    │             │    │   tokens:   │
└─────────────┘    └─────────────┘    └─────────────┘    │   txHash:   │
                                                         │   status:   │
                                                         │   "completed"│
                                                         │   createdAt:│
                                                         │ }           │
                                                         └─────────────┘
```

## 🔄 KYC Approval/Rejection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                KYC APPROVAL/REJECTION                           │
└─────────────────────────────────────────────────────────────────┘

Email Link → GET /api/kyc/approve → Backend Processing → MongoDB Atlas

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Owner     │    │   API       │    │   Find      │    │   Users     │
│   Clicks    │───▶│   Route:    │───▶│   User      │───▶│ Collection  │
│   Link      │    │             │    │             │    │             │
│             │    │ /api/kyc/   │    │ User.       │    │ Update:     │
│ • Approve   │    │ approve     │    │ findById()  │    │ {           │
│ • Reject    │    │ /api/kyc/   │    │             │    │   kycStatus:│
│             │    │ reject      │    │             │    │   "approved"│
│             │    │             │    │             │    │   kycCompleted:│
└─────────────┘    └─────────────┘    └─────────────┘    │   true     │
                                                         │ }           │
                                                         └─────────────┘
```

## 📊 Database Collections Structure

```
MongoDB Atlas Database: "xcoinpay"
├── Collection: "users"
│   ├── Document 1: {
│   │     _id: ObjectId("..."),
│   │     name: "John Doe",
│   │     email: "john@example.com",
│   │     password: "$2a$12$...", // hashed
│   │     kycData: {
│   │       fullName: "John Doe",
│   │       dateOfBirth: "1990-01-01",
│   │       nationality: "US",
│   │       passportId: "A1234567",
│   │       country: "United States",
│   │       address: "123 Main St",
│   │       city: "New York",
│   │       postalCode: "10001"
│   │     },
│   │     kycStatus: "approved",
│   │     kycCompleted: true,
│   │     walletAddress: "0x...",
│   │     createdAt: "2024-01-15T10:30:00Z"
│   │   }
│   └── Document 2: { ... }
│
└── Collection: "transactions"
    ├── Document 1: {
    │     _id: ObjectId("..."),
    │     userId: ObjectId("..."), // references users._id
    │     amount: 100,
    │     tokens: 1000,
    │     bonusTokens: 100,
    │     totalTokens: 1100,
    │     txHash: "0x1234567890abcdef...",
    │     status: "completed",
    │     walletAddress: "0x...",
    │     createdAt: "2024-01-15T11:00:00Z"
    │   }
    └── Document 2: { ... }
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   MongoDB   │    │   Atlas     │
│             │    │             │    │   Atlas     │    │   Security  │
│ • Input     │    │ • JWT       │    │ • Data      │    │ • Network   │
│   Validation│    │   Tokens    │    │   Encryption│    │   Access    │
│ • HTTPS     │    │ • Password  │    │ • Backup    │    │ • Firewall  │
│   Requests  │    │   Hashing   │    │ • Monitoring│    │ • SSL/TLS   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 📈 Data Flow Summary

```
1. User fills form on frontend
   ↓
2. Frontend sends HTTP request to backend API
   ↓
3. Backend validates data and processes request
   ↓
4. Backend connects to MongoDB Atlas
   ↓
5. Data is stored/updated in cloud database
   ↓
6. Backend sends response back to frontend
   ↓
7. Frontend updates UI based on response
```

---

**This is how your XCoinPay app securely stores all data in MongoDB Atlas! 🚀**
