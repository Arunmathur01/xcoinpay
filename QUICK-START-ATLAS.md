# 🚀 Quick Start: MongoDB Atlas for XCoinPay

## ⚡ 5-Minute Setup

### 1. Create MongoDB Atlas Account
- Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Click "Try Free" → Sign up with email
- Choose "Build a new app"

### 2. Create Free Cluster
- Click "Create" → Choose "M0 Sandbox (Free)"
- Select region → Name: `xcoinpay-cluster`
- Click "Create Cluster" (takes 3-5 minutes)

### 3. Create Database User
- Go to "Database Access" → "Add New Database User"
- Username: `xcoinpay-user`
- Password: Generate strong password (save it!)
- Privileges: "Read and write to any database"
- Click "Add User"

### 4. Allow Network Access
- Go to "Network Access" → "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Go to "Clusters" → Click "Connect"
- Choose "Connect your application"
- Copy the connection string

### 6. Configure Your Project

**Create `.env` file in `backend/` folder:**
```env
MONGO_URI=mongodb+srv://xcoinpay-user:YOUR_PASSWORD@xcoinpay-cluster.xxxxx.mongodb.net/xcoinpay?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
APP_BASE_URL=http://localhost:5000
```

**Replace:**
- `YOUR_PASSWORD` with your database user password
- `xcoinpay-cluster.xxxxx` with your actual cluster URL

### 7. Test Connection
```bash
cd backend
node test-connection.js
```

You should see: `✅ Successfully connected to MongoDB Atlas!`

### 8. Start Your App
```bash
cd backend
npm start
```

## 🎉 You're Done!

Your XCoinPay app is now connected to MongoDB Atlas cloud database!

## 📊 What Happens Next

When users register, login, or submit KYC:
- Data is stored in MongoDB Atlas
- You can view it in Atlas dashboard
- Data persists even if you restart your app

## 🔧 For Deployment

When deploying to Heroku/Railway/Render:
1. Set `MONGO_URI` environment variable
2. Your app will automatically connect to Atlas

## 🆘 Need Help?

- Check the detailed guide: `MONGODB-ATLAS-SETUP.md`
- Run connection test: `node test-connection.js`
- Check console for error messages

---

**Your crypto app now has a cloud database! 🚀**
