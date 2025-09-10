# MongoDB Atlas Setup Guide for XCoinPay

This guide will help you connect your XCoinPay project to MongoDB Atlas (cloud database).

## 🚀 Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas:**
   - Visit [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" or "Start Free"

2. **Sign Up:**
   - Create an account with your email
   - Choose "Build a new app" when prompted

## 🏗️ Step 2: Create a Cluster

1. **Choose Cloud Provider:**
   - Select AWS, Google Cloud, or Azure
   - Choose a region close to your users

2. **Select Cluster Tier:**
   - **M0 Sandbox (Free):** Perfect for development and testing
   - **M2/M5:** For production (paid)

3. **Configure Cluster:**
   - Cluster Name: `xcoinpay-cluster` (or any name you prefer)
   - Click "Create Cluster"

## 🔐 Step 3: Set Up Database Access

1. **Create Database User:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `xcoinpay-user` (or your preferred username)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

## 🌐 Step 4: Configure Network Access

1. **Add IP Address:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

## 🔗 Step 5: Get Connection String

1. **Connect to Cluster:**
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: 4.1 or later

2. **Copy Connection String:**
   ```
   mongodb+srv://<username>:<password>@xcoinpay-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## ⚙️ Step 6: Configure Your Project

### Option 1: Environment Variables (Recommended)

1. **Create `.env` file in backend folder:**
   ```env
   MONGO_URI=mongodb+srv://xcoinpay-user:YOUR_PASSWORD@xcoinpay-cluster.xxxxx.mongodb.net/xcoinpay?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   APP_BASE_URL=http://localhost:5000
   ```

2. **Replace placeholders:**
   - `YOUR_PASSWORD`: The password you created for the database user
   - `xcoinpay-cluster.xxxxx`: Your actual cluster URL
   - `xcoinpay`: Your database name

### Option 2: Direct Configuration

Update the connection string directly in your code (not recommended for production).

## 🧪 Step 7: Test Connection

1. **Start your backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Check console output:**
   - You should see: "Connected to MongoDB"
   - If you see errors, check your connection string

## 📊 Step 8: Verify Data

1. **Go to MongoDB Atlas:**
   - Click "Browse Collections" in your cluster
   - You should see your database and collections after using the app

## 🔧 Environment Variables for Different Environments

### Development (.env)
```env
MONGO_URI=mongodb+srv://xcoinpay-user:dev_password@xcoinpay-cluster.xxxxx.mongodb.net/xcoinpay_dev?retryWrites=true&w=majority
JWT_SECRET=dev-secret-key
PORT=5000
APP_BASE_URL=http://localhost:5000
```

### Production (.env.production)
```env
MONGO_URI=mongodb+srv://xcoinpay-user:prod_password@xcoinpay-cluster.xxxxx.mongodb.net/xcoinpay_prod?retryWrites=true&w=majority
JWT_SECRET=super-secure-production-jwt-secret
PORT=5000
APP_BASE_URL=https://your-domain.com
```

## 🚀 Deployment with MongoDB Atlas

### For Netlify + Heroku/Railway:

1. **Set environment variables in your hosting platform:**
   - Heroku: `heroku config:set MONGO_URI=your-atlas-connection-string`
   - Railway: Add in dashboard under "Variables"
   - Render: Add in dashboard under "Environment"

2. **Your backend will automatically connect to Atlas when deployed**

## 🔒 Security Best Practices

1. **Use strong passwords** for database users
2. **Restrict IP access** in production
3. **Use environment variables** (never commit connection strings)
4. **Enable MongoDB Atlas security features:**
   - Database encryption at rest
   - Network encryption in transit
   - Regular security updates

## 🆘 Troubleshooting

### Common Issues:

1. **Connection timeout:**
   - Check if your IP is whitelisted
   - Verify connection string format

2. **Authentication failed:**
   - Check username and password
   - Ensure user has correct permissions

3. **Network access denied:**
   - Add your IP to the whitelist
   - Check firewall settings

### Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

## 📱 Your Database Collections

After connecting, your app will create these collections:
- `users` - User accounts and KYC data
- `transactions` - Token purchase transactions
- `sessions` - User sessions (if using)

---

**Your XCoinPay project is now connected to MongoDB Atlas! 🎉**
