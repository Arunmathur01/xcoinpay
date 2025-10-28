import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, failed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const userTransactions = JSON.parse(localStorage.getItem(`transactions_${userEmail}`) || '[]');
      const buyTransactions = userTransactions
        .filter(transaction => transaction.type === 'buy')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(buyTransactions);
    }
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const getStatusIcon = (status) => {
    return status === 'completed' ? '✓' : '✗';
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? '#28a745' : '#dc3545';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Transaction hash copied to clipboard!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="history-loading">
          <div className="loading-spinner"></div>
          <p>Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <header className="history-header">
        <Link to="/" className="back-to-home">
          ← Back to Home
        </Link>
        <div className="history-header-content">
          <h1
            className="large-header typewriter-header"
            style={{ '--type-chars': '19ch', '--type-steps': 19, '--type-duration': '2.4s', '--caret-blinks': 3, '--type-final': '19ch' }}
          >
            Transaction History
          </h1>
          <p className="animate-fadeInUp animate-delay-2">View all your XIPAY token purchase transactions</p>
        </div>
      </header>

      <div className="history-content">
        <div className="history-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({transactions.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({transactions.filter(t => t.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
            onClick={() => setFilter('failed')}
          >
            Failed ({transactions.filter(t => t.status === 'failed').length})
          </button>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="transactions-list">
            {filteredTransactions.map((transaction, index) => (
              <div key={transaction.id} className={`transaction-card ${transaction.status}`}>
                <div className="transaction-header">
                  <div className="transaction-status">
                    <span 
                      className="status-icon"
                      style={{ color: getStatusColor(transaction.status) }}
                    >
                      {getStatusIcon(transaction.status)}
                    </span>
                    <span className="status-text">
                      {transaction.status === 'completed' ? 'Completed' : 'Failed'}
                    </span>
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.createdAt)}
                  </div>
                </div>

                <div className="transaction-details">
                  <div className="transaction-amount">
                    <span className="amount-label">Token Amount:</span>
                    <span className={`amount-value ${transaction.status}`}>
                      {transaction.status === 'completed' ? '+' : ''}{parseFloat(transaction.tokenAmount).toLocaleString()} XIPAY
                    </span>
                  </div>

                  <div className="transaction-info">
                    <div className="info-row">
                      <span className="info-label">Investment:</span>
                      <span className="info-value">{transaction.amount} {transaction.tokenType}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Token Type:</span>
                      <span className="info-value">{transaction.tokenType}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Receiver:</span>
                      <span className="info-value">
                        {transaction.receiverAddress.substring(0, 6)}...{transaction.receiverAddress.substring(transaction.receiverAddress.length - 4)}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-hash">
                    <span className="hash-label">Transaction Hash:</span>
                    <div className="hash-container">
                      <span className="hash-value">
                        {transaction.txHash}
                      </span>
                      <button 
                        className="copy-hash-btn"
                        onClick={() => copyToClipboard(transaction.txHash)}
                        title="Copy transaction hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  {transaction.status === 'failed' && transaction.errorMessage && (
                    <div className="error-message">
                      <span className="error-label">Error:</span>
                      <span className="error-text">{transaction.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <div className="empty-icon">📊</div>
            <h3>No Transactions Found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't made any transactions yet."
                : `No ${filter} transactions found.`
              }
            </p>
            <Link to="/ico" className="cta-btn">
              Start Investing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
