import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userTotalTokens, setUserTotalTokens] = useState(0);
  const [userTransactions, setUserTransactions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkWalletConnection();
    loadUserTokens();
    
    // Scroll detection
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Listen for wallet connection changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Set up periodic balance refresh
    const balanceInterval = setInterval(() => {
      if (isConnected && walletAddress) {
        fetchWalletBalance(walletAddress);
      }
    }, 30000); // Refresh every 30 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
      clearInterval(balanceInterval);
    };
  }, [isConnected, walletAddress]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await fetchWalletBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setWalletAddress('');
      setWalletBalance('');
      setIsConnected(false);
    } else {
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      await fetchWalletBalance(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const fetchWalletBalance = async (address) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      // Convert balance from wei to ETH
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
      setWalletBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setWalletBalance('0.0000');
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await fetchWalletBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet!');
    }
  };

  const disconnectWallet = () => {
    // Clear in-app wallet state
    setWalletAddress('');
    setWalletBalance('');
    setIsConnected(false);

    // Remove any stored wallet info so UI reflects a disconnected state
    try {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletType');
      localStorage.removeItem('currentNetwork');
    } catch (_) {}

    // Note: Wallet providers like MetaMask cannot be programmatically disconnected;
    // the user must disconnect from the wallet extension/app if they want to revoke access.
  };

  const loadUserTokens = () => {
    const userEmail = localStorage.getItem('userEmail');
    console.log('Loading tokens for user:', userEmail);
    
    if (userEmail) {
      // Get user's transaction history from localStorage
      const transactions = JSON.parse(localStorage.getItem(`transactions_${userEmail}`) || '[]');
      console.log('Raw transactions:', transactions);
      
      // Filter only buy transactions and sort by date (newest first)
      const buyTransactions = transactions
        .filter(transaction => transaction.type === 'buy')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('Filtered buy transactions:', buyTransactions);
      
      // Calculate total tokens bought (only completed transactions)
      const totalTokens = buyTransactions.reduce((total, transaction) => {
        if (transaction.status === 'completed') {
          return total + parseFloat(transaction.tokenAmount || 0);
        }
        return total;
      }, 0);
      
      console.log('Total tokens:', totalTokens);
      
      setUserTotalTokens(totalTokens);
      setUserTransactions(buyTransactions);
      setIsUserSignedIn(true);
      setUserEmail(userEmail);
    } else {
      setUserTotalTokens(0);
      setUserTransactions([]);
      setIsUserSignedIn(false);
      setUserEmail('');
    }
  };

  const handleUserMenu = () => {
    // Don't show user menu on sign-in or KYC page
    if (location.pathname === '/signin' || location.pathname === '/kyc') {
      return;
    }
    setShowUserMenu(!showUserMenu);
  };

  const handleSignIn = () => {
    setShowUserMenu(false);
    navigate('/signin');
  };

  const handleRegister = () => {
    setShowUserMenu(false);
    navigate('/signin?mode=register');
  };

  // Close user menu when navigating to sign-in or KYC page
  useEffect(() => {
    if (location.pathname === '/signin' || location.pathname === '/kyc') {
      setShowUserMenu(false);
    }
  }, [location.pathname]);

  // Listen for user sign-in events to refresh token count
  useEffect(() => {
    const handleUserSignedIn = () => {
      loadUserTokens();
    };

    const handleTransactionCompleted = () => {
      loadUserTokens();
    };

    window.addEventListener('userSignedIn', handleUserSignedIn);
    window.addEventListener('transactionCompleted', handleTransactionCompleted);
    
    return () => {
      window.removeEventListener('userSignedIn', handleUserSignedIn);
      window.removeEventListener('transactionCompleted', handleTransactionCompleted);
    };
  }, []);


  const signOutUser = () => {
    setUserEmail('');
    setIsUserSignedIn(false);
    setUserTotalTokens(0);
    setUserTransactions([]);
    localStorage.removeItem('userEmail');
    setShowUserMenu(false);
    alert('Signed out successfully');
  };

  // Check for existing user sign-in on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setIsUserSignedIn(true);
    }
  }, []);

  // Listen for sign-in events from SignIn component
  useEffect(() => {
    const handleUserSignedIn = (event) => {
      setUserEmail(event.detail.email);
      setIsUserSignedIn(true);
    };

    window.addEventListener('userSignedIn', handleUserSignedIn);
    return () => {
      window.removeEventListener('userSignedIn', handleUserSignedIn);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className={`navbar animate-slideInFromTop ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo animate-fadeInLeft animate-delay-1">
        <img src="/crlogo.jpg" alt="XCoinpay logo" />
        <span>XCoinpay</span>
      </div>
      
      <button 
        className={`nav-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <ul className={`nav-links ${isOpen ? 'nav-open' : ''} animate-fadeInRight animate-delay-2`}>
        <li><Link to="/" onClick={() => setIsOpen(false)} className="hover-lift">Home</Link></li>
        <li><Link to="/about" onClick={() => setIsOpen(false)} className="hover-lift">About</Link></li>
        <li><Link to="/tokenomics" onClick={() => setIsOpen(false)} className="hover-lift">Tokenomics</Link></li>
        <li><Link to="/ico" onClick={() => setIsOpen(false)} className="hover-lift">ICO</Link></li>
         
                   {/* User Menu */}
          <li className="user-menu-container">
            <div className="user-info-container">
              <button 
                onClick={handleUserMenu}
                className={`user-logo-btn ${isUserSignedIn ? 'signed-in' : ''}`}
                title={isUserSignedIn ? `Signed in as ${userEmail}` : "User Menu"}
              >
                <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                {isUserSignedIn && <div className="signed-in-indicator"></div>}
              </button>
              {isUserSignedIn && userTotalTokens > 0 && (
                <div className="user-token-display">
                  <span className="token-amount">{userTotalTokens.toLocaleString()}</span>
                  <span className="token-label">XIPAY</span>
                </div>
              )}
            </div>
            
                                      {showUserMenu && location.pathname !== '/signin' && location.pathname !== '/kyc' && (
               <div className="user-menu-dropdown">
                 {!isUserSignedIn ? (
                   // Before sign-in: Show only sign-in/register options
                   <div className="auth-section">
                     <div className="signin-form">
                       <h4>Welcome to XCoinpay</h4>
                       <p>Sign in or create an account to continue</p>
                       <button onClick={handleSignIn} className="signin-btn">
                         Sign In
                       </button>
                       <button onClick={handleRegister} className="register-btn">
                         Register
                       </button>
                       </div>
                     </div>
                   ) : (
                     // After sign-in: Show only wallet and logout options
                     <div className="user-section">
                       {isConnected ? (
                         <div className="wallet-info-card">
                           <div className="wallet-address">
                             {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                           </div>
                           <div className="wallet-balance">
                             {walletBalance} ETH
                             <button 
                               onClick={() => fetchWalletBalance(walletAddress)}
                               className="refresh-balance-btn"
                               title="Refresh balance"
                             >
                               🔄
                             </button>
                           </div>
                           <button onClick={disconnectWallet} className="disconnect-btn">
                             Disconnect Wallet
                           </button>
                         </div>
                       ) : (
                         <div className="wallet-connect-section">
                           <h4>Connect Wallet</h4>
                           <p>Connect your wallet to view balance and make transactions</p>
                           <button onClick={connectWallet} className="connect-wallet-btn">
                             Connect Wallet
                           </button>
                         </div>
                       )}
                       
                       {/* Purchase History Section */}
                       <div className="history-section">
                         <h4>Purchase History ({userTransactions.length})</h4>
                         {userTransactions.length > 0 ? (
                           <div className="history-list">
                             {userTransactions.slice(0, 2).map((transaction, index) => (
                               <div key={index} className={`history-item-compact ${transaction.status}`}>
                                 <div className="history-item-info">
                                   <span className={`history-token-amount-compact ${transaction.status}`}>
                                     {transaction.status === 'completed' ? '+' : ''}{parseFloat(transaction.tokenAmount).toLocaleString()} XIPAY
                                   </span>
                                   <span className="history-date-compact">
                                     {new Date(transaction.createdAt).toLocaleDateString()}
                                   </span>
                                   <span className="history-hash-compact">
                                     {transaction.txHash.substring(0, 8)}...{transaction.txHash.substring(transaction.txHash.length - 6)}
                                   </span>
                                 </div>
                                 <div className="history-item-right">
                                   <div className="history-token-type-compact">{transaction.tokenType}</div>
                                   <div className={`history-status-compact ${transaction.status}`}>
                                     {transaction.status === 'completed' ? '✓' : '✗'}
                                   </div>
                                 </div>
                               </div>
                             ))}
                             {userTransactions.length > 2 && (
                               <div className="history-more">
                                 +{userTransactions.length - 2} more transactions
                               </div>
                             )}
                             <div className="history-view-all">
                               <Link to="/history" className="view-all-btn">
                                 View Full History →
                               </Link>
                             </div>
                           </div>
                         ) : (
                           <div className="history-empty-compact">
                             <p>No purchases yet</p>
                             <small>Visit ICO page to start investing</small>
                           </div>
                         )}
                       </div>
                       
                       <div className="logout-section">
                         <div className="user-email">{userEmail}</div>
                         <button onClick={signOutUser} className="logout-btn">
                           Logout
                         </button>
                       </div>
                     </div>
                   )}
                 </div>
               )}
          </li>
         
         
      </ul>

    </nav>
  );
};

export default Navbar;
