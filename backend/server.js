const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://xcoinpay-frontend.onrender.com',
    'https://xcoinpay.onrender.com',
    'https://xcoinpay.org',
    'https://www.xcoinpay.org',
    /^https:\/\/.*\.xcoinpay\.org$/,
   
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection (supports MONGO_URI preferred, fallback to MONGODB_URI)
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/xcoinpay';

// Enhanced MongoDB connection with better error handling
mongoose.connect(mongoUri, {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});

const db = mongoose.connection;

// Connection event handlers
db.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
  if (error.message.includes('authentication failed')) {
    console.error('🔐 Authentication failed. Check your username and password.');
  } else if (error.message.includes('network')) {
    console.error('🌐 Network error. Check your IP whitelist and connection string.');
  }
});

db.on('connected', () => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log(`📊 Database: ${db.name}`);
  console.log(`🔗 Host: ${db.host}:${db.port}`);
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

db.once('open', () => {
  console.log('🚀 MongoDB connection established successfully');
});

// Health/Test Route
app.get('/', (_req, res) => {
  res.send('KYC API up ✅');
});

// Email Transport (optional - enabled when SMTP creds provided)
let mailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.OWNER_EMAIL) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kycCompleted: { type: Boolean, default: false },
  kycStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  kycData: {
    fullName: String,
    dateOfBirth: Date,
    nationality: String,
    passportId: String,
    country: String,
    address: String,
    city: String,
    postalCode: String
  },
  walletAddress: String,
  walletType: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  tokens: { type: Number, required: true },
  bonusTokens: { type: Number, required: true },
  totalTokens: { type: Number, required: true },
  txHash: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  walletAddress: String,
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// KYC Schema (stored in dedicated collection)
const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  dateOfBirth: Date,
  nationality: String,
  passportId: String,
  country: String,
  address: String,
  city: String,
  postalCode: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date
});

const Kyc = mongoose.model('Kyc', kycSchema);

// Auth helpers
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.authUserId = decoded.userId;
    req.isAdmin = Boolean(decoded.isAdmin);
    req.authEmail = decoded.email || null;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireOwner = async (req, res, next) => {
  try {
    // Allow admin token auth
    if (req.isAdmin) return next();
    const ownerEmail = process.env.OWNER_EMAIL;
    if (!ownerEmail) return res.status(403).json({ message: 'OWNER_EMAIL not configured' });
    // If email present in token, check it; otherwise load user
    let emailToCheck = req.authEmail;
    if (!emailToCheck && req.authUserId) {
      const user = await User.findById(req.authUserId).select('email');
      emailToCheck = user?.email;
    }
    if (!emailToCheck || String(emailToCheck).toLowerCase() !== String(ownerEmail).toLowerCase()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// helper to build owner action links
const getOwnerActionLinks = (userId) => {
  const base = process.env.APP_BASE_URL || 'https://xcoinpay.org';
  return {
    approve: `${base}/api/kyc/approve?userId=${userId}`,
    reject: `${base}/api/kyc/reject?userId=${userId}`
  };
};

// Routes

// Register User (now accepts optional kycData and sets pending)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, kycData } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      kycData: kycData || undefined,
      kycStatus: kycData ? 'pending' : 'none',
      kycCompleted: false
    });
    
    await user.save();

    // Notify owner if KYC submitted during registration
    if (mailTransporter && kycData) {
      const links = getOwnerActionLinks(user._id.toString());
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.OWNER_EMAIL,
        subject: `New Registration + KYC Pending - ${email}`,
        html: `
          <h3>New User Registration with KYC</h3>
          <p><strong>User:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>KYC:</strong> Pending review</p>
          <pre style="background:#f7f7f7;padding:12px;border-radius:6px;">${JSON.stringify(kycData, null, 2)}</pre>
          <p>
            <a href="${links.approve}" style="padding:10px 16px;background:#28a745;color:#fff;text-decoration:none;border-radius:6px;">Approve</a>
            &nbsp;
            <a href="${links.reject}" style="padding:10px 16px;background:#dc3545;color:#fff;text-decoration:none;border-radius:6px;">Reject</a>
          </p>
        `
      };
      try { await mailTransporter.sendMail(mailOptions); } catch (e) { console.error('Owner email fail:', e.message); }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        kycStatus: user.kycStatus,
        kycCompleted: user.kycCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login User
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        kycCompleted: user.kycCompleted,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit KYC (sets pending and emails owner)
app.post('/api/kyc', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { fullName, dateOfBirth, nationality, passportId, country, address, city, postalCode } = req.body;

    // Create a new KYC document in dedicated collection
    const kyc = await Kyc.create({
      userId: user._id,
      fullName,
      dateOfBirth,
      nationality,
      passportId,
      country,
      address,
      city,
      postalCode,
      status: 'pending'
    });

    // Keep quick-reference status on User as well
    user.kycData = { fullName, dateOfBirth, nationality, passportId, country, address, city, postalCode };
    user.kycStatus = 'pending';
    user.kycCompleted = false;
    await user.save();

    // Send KYC email to owner with action links
    if (mailTransporter) {
      const links = getOwnerActionLinks(user._id.toString());
      const submittedAt = new Date().toISOString();
      const kycLines = [
        `Full Name: ${fullName || ''}`,
        `Date of Birth: ${dateOfBirth || ''}`,
        `Nationality: ${nationality || ''}`,
        `Passport ID: ${passportId || ''}`,
        `Country: ${country || ''}`,
        `Address: ${address || ''}`,
        `City: ${city || ''}`,
        `Postal Code: ${postalCode || ''}`,
      ].join('<br/>');

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.OWNER_EMAIL,
        subject: `KYC Pending Approval - ${user.email}`,
        html: `
          <h3>KYC Submission Pending</h3>
          <p><strong>User:</strong> ${user.name || ''} &lt;${user.email}&gt;</p>
          <p><strong>Submitted At:</strong> ${submittedAt}</p>
          <div style="background:#f7f7f7;padding:12px;border-radius:6px;line-height:1.6">${kycLines}</div>
          <p style="margin-top:12px">
            <a href="${links.approve}" style="padding:10px 16px;background:#28a745;color:#fff;text-decoration:none;border-radius:6px;">Approve</a>
            &nbsp;
            <a href="${links.reject}" style="padding:10px 16px;background:#dc3545;color:#fff;text-decoration:none;border-radius:6px;">Reject</a>
          </p>
        `
      };
      try { await mailTransporter.sendMail(mailOptions); } catch (mailErr) { console.error('Failed to send KYC email:', mailErr.message); }
    }
    
    res.json({ message: 'KYC submitted successfully', kycStatus: 'pending', kycId: kyc._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Owner approves KYC via emailed link
app.get('/api/kyc/approve', async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Update the most recent KYC record for this user
    const latestKyc = await Kyc.findOne({ userId: user._id }).sort({ submittedAt: -1 });
    if (latestKyc) {
      latestKyc.status = 'approved';
      latestKyc.reviewedAt = new Date();
      await latestKyc.save();
    }

    user.kycStatus = 'approved';
    user.kycCompleted = true;
    await user.save();

    // Notify user
    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'KYC Approved',
          text: 'Your KYC has been approved. You can now access the ICO page.'
        });
      } catch (e) { console.error('Notify user email fail:', e.message); }
    }

    res.send('KYC approved successfully. User notified.');
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Owner rejects KYC via emailed link
app.get('/api/kyc/reject', async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Update the most recent KYC record for this user
    const latestKyc = await Kyc.findOne({ userId: user._id }).sort({ submittedAt: -1 });
    if (latestKyc) {
      latestKyc.status = 'rejected';
      latestKyc.reviewedAt = new Date();
      await latestKyc.save();
    }

    user.kycStatus = 'rejected';
    user.kycCompleted = false;
    await user.save();

    // Notify user
    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'KYC Rejected',
          text: 'Your KYC was rejected. Please re-submit with correct details.'
        });
      } catch (e) { console.error('Notify user email fail:', e.message); }
    }

    res.send('KYC rejected. User notified.');
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Frontend can poll KYC status
app.get('/api/kyc/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('kycStatus kycCompleted');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Also include the latest KYC record if present
    const latestKyc = await Kyc.findOne({ userId: user._id }).sort({ submittedAt: -1 });
    res.json({
      kycStatus: user.kycStatus,
      kycCompleted: user.kycCompleted,
      kyc: latestKyc || null
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest KYC record (explicit endpoint)
app.get('/api/kyc/latest', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const latestKyc = await Kyc.findOne({ userId: decoded.userId }).sort({ submittedAt: -1 });
    res.json({ kyc: latestKyc || null });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin fixed-credential login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const adminEmail = process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL; // fallback to owner email
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin credentials not configured' });
    }
    const ok = String(email).toLowerCase() === String(adminEmail).toLowerCase() && String(password) === String(adminPassword);
    if (!ok) return res.status(401).json({ message: 'Invalid admin credentials' });
    const token = jwt.sign({ isAdmin: true, email: adminEmail }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list KYC submissions
app.get('/api/admin/kyc', requireAuth, requireOwner, async (req, res) => {
  try {
    const { status } = req.query; // optional: pending|approved|rejected
    const query = status ? { status } : {};
    const kycs = await Kyc.find(query)
      .sort({ submittedAt: -1 })
      .limit(200)
      .lean();

    // Attach minimal user info
    const userIds = kycs.map(k => k.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
    const userMap = new Map(users.map(u => [String(u._id), u]));
    const data = kycs.map(k => ({
      ...k,
      user: userMap.get(String(k.userId)) || null,
    }));
    res.json({ kycs: data });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: approve KYC by kycId
app.post('/api/admin/kyc/:kycId/approve', requireAuth, requireOwner, async (req, res) => {
  try {
    const { kycId } = req.params;
    const kyc = await Kyc.findById(kycId);
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });
    kyc.status = 'approved';
    kyc.reviewedAt = new Date();
    await kyc.save();

    // sync user quick fields
    const user = await User.findById(kyc.userId);
    if (user) {
      user.kycStatus = 'approved';
      user.kycCompleted = true;
      await user.save();
    }
    res.json({ message: 'KYC approved' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: reject KYC by kycId
app.post('/api/admin/kyc/:kycId/reject', requireAuth, requireOwner, async (req, res) => {
  try {
    const { kycId } = req.params;
    const kyc = await Kyc.findById(kycId);
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });
    kyc.status = 'rejected';
    kyc.reviewedAt = new Date();
    await kyc.save();

    // sync user quick fields
    const user = await User.findById(kyc.userId);
    if (user) {
      user.kycStatus = 'rejected';
      user.kycCompleted = false;
      await user.save();
    }
    res.json({ message: 'KYC rejected' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect Wallet
app.post('/api/connect-wallet', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { walletAddress, walletType } = req.body;
    
    user.walletAddress = walletAddress;
    user.walletType = walletType;
    
    await user.save();
    
    res.json({ 
      message: 'Wallet connected successfully',
      walletAddress,
      walletType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { amount, tokens, bonusTokens, totalTokens, txHash, status } = req.body;
    
    const transaction = new Transaction({
      userId: user._id,
      amount,
      tokens,
      bonusTokens,
      totalTokens,
      txHash,
      walletAddress: user.walletAddress,
      status: status || 'completed' // Default to completed if not specified
    });
    
    await transaction.save();
    
    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: {
        id: transaction._id,
        amount,
        tokens,
        bonusTokens,
        totalTokens,
        txHash,
        status: transaction.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const transactions = await Transaction.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Profile
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
