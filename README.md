# XCoinPay - MERN Stack Crypto ICO Platform

A full-stack cryptocurrency ICO (Initial Coin Offering) platform built with the MERN stack, featuring KYC verification, admin dashboard, and secure transaction processing.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **KYC Verification**: Know Your Customer compliance with document verification
- **ICO Participation**: Token purchase with wallet integration
- **Admin Dashboard**: KYC approval/rejection system
- **Transaction History**: Complete transaction tracking
- **Responsive Design**: Modern UI with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React.js, CSS3, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for notifications

## 📁 Project Structure

```
mern-xcoinpay/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── App.js         # Main App component
│   ├── public/            # Static files
│   ├── build/             # Production build
│   └── package.json       # Frontend dependencies
├── .gitignore             # Git ignore rules
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/xcoinpay-mern.git
   cd xcoinpay-mern
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   - Copy `env.example` to `.env` in the root directory
   - Update the environment variables with your MongoDB Atlas connection string and other settings

5. **Start the development servers**
   ```bash
   # Backend (from backend directory)
   npm start
   
   # Frontend (from frontend directory, in a new terminal)
   npm start
   ```

## 🌐 Deployment

### Render Deployment (Recommended)

1. **Backend Deployment**
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set Root Directory to `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

2. **Frontend Deployment**
   - Create a new Static Site on Render
   - Connect your GitHub repository
   - Set Root Directory to `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

### Environment Variables

Required environment variables for production:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@xcoinpay.org
ADMIN_PASSWORD=your-admin-password
OWNER_EMAIL=admin@xcoinpay.org
```

## 📱 Usage

1. **User Registration**: Users can register with email and password
2. **KYC Submission**: Complete identity verification process
3. **Admin Approval**: Admins can approve/reject KYC applications
4. **ICO Participation**: Approved users can participate in token sales
5. **Transaction Tracking**: View complete transaction history

## 🔐 Admin Access

- **Admin Email**: Set in environment variables
- **Admin Password**: Set in environment variables
- **Access**: Navigate to `/admin` route

## 📧 Email Notifications

The system sends email notifications for:
- New KYC submissions (to admin)
- KYC approval/rejection (to users)

Configure SMTP settings in environment variables for email functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using the MERN Stack**