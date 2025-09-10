import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Whitepaper from './Whitepaper';
import './Home.css';

const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Animate statistics on scroll
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate stat numbers
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber) {
            const target = parseInt(statNumber.getAttribute('data-target'));
            if (target) {
              animateNumber(statNumber, target);
            }
          }
          
          // Add animation class
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const statItems = document.querySelectorAll('.stat-item');
    const featureItems = document.querySelectorAll('.features li');
    
    statItems.forEach(item => observer.observe(item));
    featureItems.forEach(item => observer.observe(item));

    return () => {
      statItems.forEach(item => observer.unobserve(item));
      featureItems.forEach(item => observer.unobserve(item));
    };
  }, []);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      // Using CoinGecko API (free alternative to CoinMarketCap)
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,solana,polkadot,tron,ripple&vs_currencies=usd&include_24hr_change=true&include_market_cap=true');
      const data = await response.json();
      
      const cryptoList = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', data: data.bitcoin },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', data: data.ethereum },
        { id: 'tether', symbol: 'USDT', name: 'Tether', data: data.tether },
        { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', data: data['usd-coin'] },
        { id: 'solana', symbol: 'SOL', name: 'Solana', data: data.solana },
        { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', data: data.polkadot },
        { id: 'tron', symbol: 'TRX', name: 'TRON', data: data.tron },
        { id: 'ripple', symbol: 'XRP', name: 'XRP', data: data.ripple }
      ];
      
      setCryptoData(cryptoList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  const animateNumber = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 30);
  };

  return (
    <div className="home">
      <header className="hero">
        <h1 className="large-header typewriter-header">Welcome to XCoinpay</h1>
        <p className="animate-fadeInUp animate-delay-2">The Future of Fast, Frictionless Crypto Withdrawals</p>
        <p className="hero-subtitle animate-fadeInUp animate-delay-3">
          Join thousands of users who trust XCoinpay for secure, low-fee crypto transactions worldwide.
        </p>
        <Link to="/ico" className="cta-btn btn-animate animate-fadeInUp animate-delay-4">Join the presale</Link>
      </header>

      <section className="features animate-fadeInUp animate-delay-5">
        <h2 className="typewriter-header" style={{fontSize: '2.5rem', color: '#333', marginBottom: '2rem'}}>Why XCoinpay?</h2>
        <ul>
          <li className="animate-fadeInLeft animate-delay-6 hover-lift">Real-world utility: Withdraw funds from exchanges without P2P friction</li>
          <li className="animate-fadeInLeft animate-delay-7 hover-lift">10,000 TPS: Designed for real-time performance</li>
          <li className="animate-fadeInLeft animate-delay-8 hover-lift">Deflationary model: CPAY buyback + burn using transaction fees</li>
          <li className="animate-fadeInLeft animate-delay-9 hover-lift">Investor-first launch strategy: Low entry, high potential</li>
          <li className="animate-fadeInLeft animate-delay-10 hover-lift">Native stablecoin (CUSDT): Stability in every transaction</li>
        </ul>
      </section>

      <section className="stats-section animate-fadeInUp">
        <div className="stats-container">
          <div className="stat-item animate-scaleIn animate-delay-1">
            <div className="stat-number" data-target="10000">0</div>
            <div className="stat-label">TPS Capacity</div>
          </div>
          <div className="stat-item animate-scaleIn animate-delay-2">
            <div className="stat-number" data-target="99">0</div>
            <div className="stat-label">% Uptime</div>
          </div>
          <div className="stat-item animate-scaleIn animate-delay-3">
            <div className="stat-number" data-target="15">0</div>
            <div className="stat-label">Blockchain Networks</div>
          </div>
          <div className="stat-item animate-scaleIn animate-delay-4">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      <section className="crypto-section animate-fadeInUp">
        <h2 className="typewriter-header" style={{fontSize: '2.5rem', color: '#fff', marginBottom: '2rem'}}>Live Crypto Prices</h2>
        <div className="crypto-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading live crypto data...</p>
            </div>
          ) : (
            cryptoData.map((crypto, index) => (
              <div key={crypto.symbol} className={`crypto-card card-animate animate-zoomIn animate-delay-${index + 1}`}>
                <div className="crypto-header">
                  <div className="crypto-icon">
                    <img 
                      src={`https://assets.coingecko.com/coins/images/1/large/${crypto.id}.png`} 
                      alt={crypto.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="fallback-icon">{crypto.symbol}</span>
                  </div>
                  <div className="crypto-info">
                    <h3 className="crypto-name">{crypto.name}</h3>
                    <span className="crypto-symbol">{crypto.symbol}</span>
                  </div>
                </div>
                <div className="crypto-price">
                  <span className="price-value">${crypto.data?.usd?.toLocaleString() || 'N/A'}</span>
                  <span className={`price-change ${crypto.data?.usd_24h_change > 0 ? 'positive' : 'negative'}`}>
                    {crypto.data?.usd_24h_change ? `${crypto.data.usd_24h_change > 0 ? '+' : ''}${crypto.data.usd_24h_change.toFixed(2)}%` : 'N/A'}
                  </span>
                </div>
                <div className="crypto-market-cap">
                  <span className="market-cap-label">Market Cap:</span>
                  <span className="market-cap-value">
                    ${crypto.data?.usd_market_cap ? (crypto.data.usd_market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="crypto-footer">
          <p className="animate-fadeInUp animate-delay-8">
            Real-time data powered by CoinGecko API • Updates every 30 seconds
          </p>
        </div>
      </section>

      <section className="features-grid animate-fadeInUp">
        <h2 className="animate-fadeInDown">Key Features</h2>
        <div className="features-container">
          <div className="feature-card card-animate animate-zoomIn animate-delay-1">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Instant withdrawals with 10,000 TPS capacity for real-time transactions</p>
          </div>
          <div className="feature-card card-animate animate-zoomIn animate-delay-2">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Military-grade encryption and multi-layer security protocols</p>
          </div>
          <div className="feature-card card-animate animate-zoomIn animate-delay-3">
            <div className="feature-icon">💰</div>
            <h3>Low Fees</h3>
            <p>Minimal transaction costs with transparent fee structure</p>
          </div>
          <div className="feature-card card-animate animate-zoomIn animate-delay-4">
            <div className="feature-icon">🌍</div>
            <h3>Global Access</h3>
            <p>Available worldwide with support for multiple currencies</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join the Future?</h2>
          <p>Don't miss out on the next big thing in crypto payments. Join our presale now and be part of the revolution.</p>
          <div className="cta-buttons">
            <Link to="/ico" className="cta-btn primary">Join Presale</Link>
            <Whitepaper />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
