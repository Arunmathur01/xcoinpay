import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ICO.css';

const ICO = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ethereum');
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [kycStatus, setKycStatus] = useState('unknown'); // none|pending|approved|rejected|unknown
  const [kycInfo, setKycInfo] = useState(null); // latest kyc record from backend
  
  // Fixed receiver address - cannot be changed by users
  const FIXED_RECEIVER_ADDRESS = '0xC8C07C10C5Ab5F4d9fBbbc1cD33a91fB837cb883';
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    fetchTransactions();
  }, []);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
      setShowAuthPrompt(true);
      setIsAuthenticated(false);
      setKycStatus('unknown');
      setKycInfo(null);
      return;
    }

    // Prefer backend status over localStorage
    try {
      const res = await axios.get('/api/kyc/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const backendCompleted = Boolean(res.data?.kycCompleted);
      const backendStatus = res.data?.kycStatus || 'none';
      setKycStatus(backendStatus);
      setKycInfo(res.data?.kyc || null);

      // If token exists, allow page to render; control actions with kycStatus
      setIsAuthenticated(true);
      setShowAuthPrompt(false);
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) localStorage.setItem(`kycCompleted_${userEmail}`, backendCompleted ? 'true' : 'false');
      } catch(_) {}
    } catch (_) {
      // If token invalid/expired or API fails, require authentication again and clear token
      try {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } catch(_) {}
      setIsAuthenticated(false);
      setShowAuthPrompt(true);
      setKycStatus('unknown');
      setKycInfo(null);
    }
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Fallback to local storage for demo
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      setTransactions(storedTransactions);
      return;
    }
    try {
      const res = await axios.get('/api/transactions', { headers: { Authorization: `Bearer ${token}` } });
      setTransactions(res.data?.transactions || []);
    } catch (_) {
      // Fallback to local storage if API fails
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      setTransactions(storedTransactions);
    }
  };

  const connectMetaMask = async () => {
    try {
      // Ensure we only target MetaMask
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      let provider = null;

      if (typeof window.ethereum === 'undefined') {
        setMessage('MetaMask is not installed. Redirecting to MetaMask download...');
        if (isMobile) {
          // Deep link to MetaMask app and back to this DApp
          const dappUrl = encodeURIComponent(window.location.href);
          window.location.href = `https://metamask.app.link/dapp/${window.location.host}`;
        } else {
          window.open('https://metamask.io/download/', '_blank');
        }
        return;
      }

      // If multiple providers are injected, pick MetaMask explicitly
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        provider = window.ethereum.providers.find((p) => p && p.isMetaMask);
      }
      if (!provider && window.ethereum && window.ethereum.isMetaMask) {
        provider = window.ethereum;
      }

      if (!provider) {
        setMessage('MetaMask provider not found. Please use MetaMask to continue.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      // Optional: set window.ethereum to MetaMask provider to keep later calls consistent
      try {
        window.ethereum = provider;
      } catch (_) {}

      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setWalletConnected(true);
        
        // Get current network
        const chainId = await provider.request({ 
          method: 'eth_chainId' 
        });
        
        // Set current network name
        const networkNames = {
          '0x1': 'Ethereum Mainnet',
          '0x89': 'Polygon Mainnet',
          '0x38': 'BNB Smart Chain'
        };
        setCurrentNetwork(networkNames[chainId] || 'Unknown Network');
        
        // Save wallet info to local storage for demo
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletType', 'metamask');
        localStorage.setItem('currentNetwork', networkNames[chainId] || 'Unknown Network');
        
        setMessage('Wallet connected successfully!');
        setTimeout(() => setCurrentStep(2), 1000);
      }
    } catch (error) {
      setMessage('Failed to connect MetaMask. Please try again in the MetaMask app.');
      console.error('Wallet connection error:', error);
    }
  };



  const processPayment = async () => {
    if (!investmentAmount || !walletConnected) {
      setMessage('Please enter amount and connect your wallet first.');
      return;
    }

    // Calculate tokens (moved outside try-catch for error handling)
    const tokenPrice = 0.1;
    const baseTokens = Math.floor(investmentAmount / tokenPrice);
    let bonusPercentage = 0;
    
    if (investmentAmount >= 1000) bonusPercentage = 20;
    else if (investmentAmount >= 500) bonusPercentage = 15;
    else if (investmentAmount >= 100) bonusPercentage = 10;
    else bonusPercentage = 5;
    
    const bonusTokens = Math.floor(baseTokens * (bonusPercentage / 100));
    const totalTokens = baseTokens + bonusTokens;

    try {
      setLoading(true);

      // Get token configuration based on selection
      const tokenConfig = getTokenConfig(selectedToken);
      
      // Switch to the correct network
      await switchNetwork(tokenConfig.chainId);
      
      // Calculate token amount based on USD value
      const tokenAmount = investmentAmount / tokenConfig.price;
      const weiAmount = (tokenAmount * Math.pow(10, tokenConfig.decimals)).toString(16);
      
      // Request transaction from wallet
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: FIXED_RECEIVER_ADDRESS,
          from: walletAddress,
          value: '0x' + weiAmount,
          gas: '0x5208',
        }],
      });

      // Save transaction to backend API
      const transactionData = {
        amount: parseFloat(investmentAmount),
        tokens: baseTokens,
        bonusTokens: bonusTokens,
        totalTokens: totalTokens,
        txHash: txHash,
        status: 'completed' // Mark as completed
      };

      try {
        // Send transaction to backend API
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/transactions', transactionData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Transaction saved to backend:', response.data);
        
        // Also save to local storage for frontend display
        const transaction = {
          id: Date.now(),
          type: 'buy',
          amount: investmentAmount,
          tokenAmount: totalTokens,
          tokens: baseTokens,
          bonusTokens: bonusTokens,
          totalTokens: totalTokens,
          txHash: txHash,
          status: 'completed',
          receiverAddress: FIXED_RECEIVER_ADDRESS,
          tokenType: selectedToken,
          senderAddress: walletAddress,
          createdAt: new Date().toISOString()
        };
        
        // Get user email for storing transactions per user
        const userEmail = localStorage.getItem('userEmail');
        const transactionKey = userEmail ? `transactions_${userEmail}` : 'transactions';
        
        const existingTransactions = JSON.parse(localStorage.getItem(transactionKey) || '[]');
        existingTransactions.push(transaction);
        localStorage.setItem(transactionKey, JSON.stringify(existingTransactions));
        setTransactions(existingTransactions);
        
      } catch (apiError) {
        console.error('Failed to save transaction to backend:', apiError);
        // Still save to local storage even if backend fails
        const transaction = {
          id: Date.now(),
          type: 'buy',
          amount: investmentAmount,
          tokenAmount: totalTokens,
          tokens: baseTokens,
          bonusTokens: bonusTokens,
          totalTokens: totalTokens,
          txHash: txHash,
          status: 'completed',
          receiverAddress: FIXED_RECEIVER_ADDRESS,
          tokenType: selectedToken,
          senderAddress: walletAddress,
          createdAt: new Date().toISOString()
        };
        
        const userEmail = localStorage.getItem('userEmail');
        const transactionKey = userEmail ? `transactions_${userEmail}` : 'transactions';
        
        const existingTransactions = JSON.parse(localStorage.getItem(transactionKey) || '[]');
        existingTransactions.push(transaction);
        localStorage.setItem(transactionKey, JSON.stringify(existingTransactions));
        setTransactions(existingTransactions);
      }

      // Dispatch event to update navbar token count
      window.dispatchEvent(new CustomEvent('transactionCompleted', {
        detail: { tokenAmount: parseFloat(tokenAmount) }
      }));

      setMessage('Payment successful! Tokens sent to the receiver address.');
              setCurrentStep(3);
    } catch (error) {
      // Generate a failed transaction hash for tracking
      const failedTxHash = `0x${Math.random().toString(16).substr(2, 8)}${Date.now().toString(16)}`;
      
      // Try to save failed transaction to backend API
      const transactionData = {
        amount: parseFloat(investmentAmount),
        tokens: baseTokens,
        bonusTokens: bonusTokens,
        totalTokens: totalTokens,
        txHash: failedTxHash,
        status: 'failed' // Mark as failed
      };

      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.post('/api/transactions', transactionData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Failed transaction saved to backend:', response.data);
        }
      } catch (apiError) {
        console.error('Failed to save failed transaction to backend:', apiError);
      }
      
      // Save failed transaction to local storage
      const userEmail = localStorage.getItem('userEmail');
      const transactionKey = userEmail ? `transactions_${userEmail}` : 'transactions';
      
      const failedTransaction = {
        id: Date.now(),
        type: 'buy',
        amount: investmentAmount,
        tokenAmount: totalTokens,
        tokens: baseTokens,
        bonusTokens: bonusTokens,
        totalTokens: totalTokens,
        txHash: failedTxHash,
        status: 'failed',
        receiverAddress: FIXED_RECEIVER_ADDRESS,
        tokenType: selectedToken,
        senderAddress: walletAddress,
        createdAt: new Date().toISOString(),
        errorMessage: error.code === 4001 ? 'User rejected transaction' : 'Transaction failed'
      };
      
      const existingTransactions = JSON.parse(localStorage.getItem(transactionKey) || '[]');
      existingTransactions.push(failedTransaction);
      localStorage.setItem(transactionKey, JSON.stringify(existingTransactions));
      setTransactions(existingTransactions);

      // Dispatch event to update navbar
      window.dispatchEvent(new CustomEvent('transactionCompleted', {
        detail: { tokenAmount: 0 }
      }));

      if (error.code === 4001) {
        setMessage('Transaction was rejected by user.');
      } else {
        setMessage('Transaction failed. Please try again.');
      }
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTokenConfig = (tokenType) => {
    const configs = {
      ethereum: {
        name: 'Ethereum (ETH)',
        price: 2000, // USD price
        decimals: 18,
        chainId: '0x1', // Mainnet
        symbol: 'ETH'
      },
      polygon: {
        name: 'Polygon (MATIC)',
        price: 1.5, // USD price
        decimals: 18,
        chainId: '0x89', // Polygon Mainnet
        symbol: 'MATIC'
      },
      bnb: {
        name: 'BNB Smart Chain (BNB)',
        price: 300, // USD price
        decimals: 18,
        chainId: '0x38', // BSC Mainnet
        symbol: 'BNB'
      }
    };
    return configs[tokenType] || configs.ethereum;
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getNetworkParams(chainId)],
          });
        } catch (addError) {
          setMessage('Failed to add network to MetaMask. Please add it manually.');
        }
      } else {
        setMessage('Failed to switch network. Please switch manually in MetaMask.');
      }
    }
  };

  const getNetworkParams = (chainId) => {
    const networks = {
      '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io/']
      },
      '0x89': {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      '0x38': {
        chainId: '0x38',
        chainName: 'BNB Smart Chain',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/']
      }
    };
    return networks[chainId];
  };

    

  // Show authentication prompt if no token or not signed in
  if (showAuthPrompt) {
    return (
      <div className="ico-container">
        <div className="auth-required-container">
          <div className="auth-required-card">
            <div className="auth-required-icon">🔒</div>
            <h2>Authentication Required</h2>
            <p>You need to sign in and complete KYC verification to access the ICO page.</p>
            
            <div className="auth-actions">
              <button 
                onClick={() => navigate('/signin')}
                className="signin-btn"
              >
                Sign In / Register
              </button>
              <button 
                onClick={() => navigate('/')}
                className="back-home-btn"
              >
                Back to Home
              </button>
            </div>
            
            <div className="auth-info">
              <h4>Why is authentication required?</h4>
              <ul>
                <li>ICO participation requires verified identity</li>
                <li>KYC compliance for regulatory requirements</li>
                <li>Secure transaction processing</li>
                <li>Fraud prevention and user protection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If KYC is not approved, show only KYC status/update panel
  if (kycStatus !== 'approved') {
    const isPending = kycStatus === 'pending';
    const isRejected = kycStatus === 'rejected';
    const isNone = kycStatus === 'none' || kycStatus === 'unknown';
    return (
      <div className="ico-container">
        <div className="auth-required-container">
          <div className="auth-required-card">
            <div className="auth-required-icon">🪪</div>
            <h2>{isPending ? 'KYC Pending Review' : isRejected ? 'KYC Rejected' : 'KYC Required'}</h2>
            {isPending && (
              <p>Your KYC has been submitted and is awaiting approval.</p>
            )}
            {isRejected && (
              <p>Your KYC was rejected. Please review details and re-submit your KYC.</p>
            )}
            {isNone && (
              <p>You must complete KYC verification before participating in the ICO.</p>
            )}

            {kycInfo && (
              <div className="auth-info" style={{ marginTop: '1rem' }}>
                <h4>Submission Details</h4>
                <ul>
                  <li>Submitted: {kycInfo.submittedAt ? new Date(kycInfo.submittedAt).toLocaleString() : '-'}</li>
                  {kycInfo.reviewedAt && <li>Reviewed: {new Date(kycInfo.reviewedAt).toLocaleString()}</li>}
                  {kycInfo.fullName && <li>Name: {kycInfo.fullName}</li>}
                  {kycInfo.country && <li>Country: {kycInfo.country}</li>}
                </ul>
              </div>
            )}

            <div className="auth-actions" style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => navigate('/kyc')}
                className="signin-btn"
              >
                {isPending ? 'View KYC Status' : 'Go to KYC'}
              </button>
              <button 
                onClick={() => navigate('/')}
                className="back-home-btn"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="hero">
        <h1 className="large-header typewriter-header">XCoinpay ICO – Be Part of the Real-Time Crypto Revolution</h1>
        <p className="animate-fadeInUp animate-delay-2">Participate in the future of crypto payments with instant, secure, and low-fee blockchain withdrawals.</p>
        <p className="hero-subtitle animate-fadeInUp animate-delay-3">
          Join the revolution that's transforming crypto accessibility. Our ICO offers you the opportunity to be part of 
          a high-speed blockchain ecosystem that eliminates the friction between crypto exchanges and real-world access to funds.
        </p>
      </header>
      
      <div className="ico-container">

            {/* ICO Specifications Section */}
      <div className="ico-specifications animate-fadeInUp animate-delay-3">
        <h2 className="specifications-title">ICO Specifications</h2>
        <div className="specifications-grid">
          <div className="spec-item">
            <div className="spec-label">Token Name</div>
            <div className="spec-value">Cpay</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">Token Type</div>
            <div className="spec-value">Utility</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">Total Supply</div>
            <div className="spec-value">1,000,000,000 Cpay</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">Tokens for Sale</div>
            <div className="spec-value">200,000,000 Cpay</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">ICO Floor Price</div>
            <div className="spec-value">$0.10 USD per Cpay</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">Accepted Payments</div>
            <div className="spec-value">USDT</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">Soft Cap</div>
            <div className="spec-value">$100</div>
          </div>
          <div className="spec-item">
            <div className="spec-label">Hard Cap</div>
            <div className="spec-value">$2,000</div>
          </div>
        </div>
      </div>

      {/* Token Allocation Section */}
      <div className="token-allocation animate-fadeInUp animate-delay-4">
        <h2 className="allocation-title">
          <span className="allocation-icon">📊</span>
          Token Allocation
        </h2>
        <div className="allocation-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Allocation (%)</th>
                <th>Tokens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ICO Sale</td>
                <td>20%</td>
                <td>200,000,000 Cpay</td>
              </tr>
              <tr>
                <td>Team & Founders</td>
                <td>15%</td>
                <td>150,000,000 Cpay</td>
              </tr>
              <tr>
                <td>Liquidity & Reserves</td>
                <td>25%</td>
                <td>250,000,000 Cpay</td>
              </tr>
              <tr>
                <td>Ecosystem & Rewards</td>
                <td>20%</td>
                <td>200,000,000 Cpay</td>
              </tr>
              <tr>
                <td>Partnerships & Growth</td>
                <td>10%</td>
                <td>100,000,000 Cpay</td>
              </tr>
              <tr>
                <td>Advisors</td>
                <td>5%</td>
                <td>50,000,000 Cpay</td>
              </tr>
              <tr>
                <td>Community Airdrop</td>
                <td>5%</td>
                <td>50,000,000 Cpay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

            <div className="progress-container animate-fadeInUp animate-delay-5">
       <div className="progress-bar">
         <div 
           className="progress-fill" 
           style={{width: `${(currentStep / 3) * 100}%`}}
         ></div>
       </div>
                <div className="progress-steps">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} animate-scaleIn animate-delay-6`}>Wallet</div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} animate-scaleIn animate-delay-7`}>Amount</div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} animate-scaleIn animate-delay-8`}>Payment</div>
        </div>
     </div>

     {message && (
       <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
         {message}
       </div>
     )}

     {currentStep === 1 && (
       <div className="wallet-connect">
         <h3>Connect Your Wallet</h3>
         <p>Connect your MetaMask wallet to participate in the ICO</p>
         <button onClick={connectMetaMask} disabled={loading}>
           {loading ? 'Connecting...' : 'Connect MetaMask'}
         </button>
       </div>
     )}

     {currentStep === 2 && (
       <div className="amount-input">
         <h3>Payment Details</h3>
                    <div className="payment-form">
                          <div className="form-group">
               <label>Receiver Address</label>
               <div className="fixed-address-display">
                 <span className="receiver-address">{FIXED_RECEIVER_ADDRESS}</span>
                 <button 
                   className="copy-btn"
                   onClick={() => {
                     navigator.clipboard.writeText(FIXED_RECEIVER_ADDRESS);
                     setMessage('Address copied to clipboard!');
                     setTimeout(() => setMessage(''), 2000);
                   }}
                   title="Copy address"
                 >
                   📋
                 </button>
               </div>
               <small>This is the official XCoinpay wallet address. All payments will be sent to this address.</small>
             </div>

           <div className="form-group">
             <label>Token Type</label>
             <select
               value={selectedToken}
               onChange={(e) => setSelectedToken(e.target.value)}
               className="token-select"
             >
               <option value="ethereum">Ethereum (ETH)</option>
               <option value="polygon">Polygon (MATIC)</option>
               <option value="bnb">BNB Smart Chain (BNB)</option>
             </select>
             <small>Select the blockchain network for your transaction</small>
           </div>

           {walletConnected && currentNetwork && (
             <div className="network-info">
               <label>Current Network</label>
               <div className="network-display">
                 <span className="network-name">{currentNetwork}</span>
                 <span className="network-status connected">Connected</span>
               </div>
               <small>Your wallet is connected to {currentNetwork}</small>
             </div>
           )}

           <div className="form-group">
             <label>Investment Amount (USD)</label>
             <input
               type="number"
               placeholder="Enter amount (USD)"
               value={investmentAmount}
               onChange={(e) => setInvestmentAmount(e.target.value)}
               min="50"
               max="50000"
               className="amount-input-field"
             />
             <small>Minimum: $50 | Maximum: $50,000</small>
           </div>

           {investmentAmount && selectedToken && (
             <div className="payment-summary">
               <h4>Payment Summary</h4>
               <div className="summary-item">
                 <span>Amount:</span>
                 <span>${investmentAmount} USD</span>
               </div>
               <div className="summary-item">
                 <span>Token:</span>
                 <span>{getTokenConfig(selectedToken).name}</span>
               </div>
               <div className="summary-item">
                 <span>Token Amount:</span>
                 <span>{(investmentAmount / getTokenConfig(selectedToken).price).toFixed(6)} {getTokenConfig(selectedToken).symbol}</span>
               </div>
                                <div className="summary-item">
                  <span>Receiver:</span>
                  <span className="receiver-preview">{FIXED_RECEIVER_ADDRESS.substring(0, 6)}...{FIXED_RECEIVER_ADDRESS.substring(38)}</span>
                </div>
             </div>
           )}

                        <button 
              onClick={processPayment} 
              disabled={loading || !investmentAmount}
              className="send-payment-btn"
            >
              {loading ? 'Processing...' : 'Send Payment'}
            </button>
         </div>
       </div>
     )}

     {currentStep === 3 && (
       <div className="success-screen">
         <h3>🎉 Payment Successful!</h3>
         <p>Your CPAY tokens have been sent to your connected wallet.</p>
         <button onClick={() => setCurrentStep(1)}>Start New Investment</button>
       </div>
     )}

            {transactions.length > 0 && (
        <div className="transactions">
          <h3>Your Transactions</h3>
          <div className="transaction-summary">
            <div className="summary-stat">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{transactions.length}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total Amount</span>
              <span className="stat-value">${transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toFixed(2)} USD</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total Tokens</span>
              <span className="stat-value">{transactions.reduce((sum, tx) => sum + tx.totalTokens, 0)} CPAY</span>
            </div>
          </div>
          <div className="transaction-list">
                        {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-header">
                  <span className="tx-amount">${tx.amount} USD</span>
                  <span className={`tx-status ${tx.status}`}>{tx.status}</span>
                </div>
                <div className="tx-details">
                  <div className="tx-detail-row">
                    <span className="detail-label">Tokens:</span>
                    <span className="detail-value">{tx.totalTokens} CPAY</span>
                  </div>
                  <div className="tx-detail-row">
                    <span className="detail-label">Token Type:</span>
                    <span className="detail-value">{tx.tokenType ? getTokenConfig(tx.tokenType).name : 'N/A'}</span>
                  </div>
                  <div className="tx-detail-row">
                    <span className="detail-label">From:</span>
                    <span className="detail-value address">{tx.senderAddress ? `${tx.senderAddress.substring(0, 6)}...${tx.senderAddress.substring(38)}` : 'N/A'}</span>
                  </div>
                  <div className="tx-detail-row">
                    <span className="detail-label">To:</span>
                    <span className="detail-value address">{tx.receiverAddress ? `${tx.receiverAddress.substring(0, 6)}...${tx.receiverAddress.substring(38)}` : 'N/A'}</span>
                  </div>
                  <div className="tx-detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}</span>
                  </div>
                  {tx.txHash && (
                    <div className="tx-detail-row">
                      <span className="detail-label">Transaction Hash:</span>
                      <span className="detail-value hash">{tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
         </div>
                </div>
      )}
      </div>
    </>
  );
};

export default ICO;
