import React from 'react';
import './Tokenomics.css';
import Whitepaper from './Whitepaper';

const Tokenomics = () => {
  return (
    <div className="tokenomics">
      <header className="hero">
        <h1 className="large-header typewriter-header">XCoinpay Tokenomics</h1>
        <p className="animate-fadeInUp animate-delay-2">Transparent. Deflationary. Designed for Growth.</p>
        <p className="hero-subtitle animate-fadeInUp animate-delay-3">
          At the heart of the XCoinpay ecosystem lies XIPAY, our native utility token, and XUSDT, our blockchain-native stablecoin. Together, they power a scalable, user-first blockchain designed to solve real-world problems in crypto withdrawals, payments, and asset movement.
        </p>
      </header>

      <section className="about-mission animate-fadeInUp animate-delay-4">
        <div className="about-container">
          <div className="mission-content">
            <h2 className="animate-fadeInDown">XIPAY Token Overview</h2>
            <p>The XIPAY token is the native utility token of the XCoinpay blockchain, used for gas fees and network incentives. With a fixed supply of 1 billion tokens and deflationary mechanics, XIPAY is designed to increase in value over time.</p>
            <div className="mission-stats">
              <div className="mission-stat animate-scaleIn animate-delay-5">
                <div className="stat-number">1B</div>
                <div className="stat-label">Total Supply</div>
              </div>
              <div className="mission-stat animate-scaleIn animate-delay-6">
                <div className="stat-number">$0.10</div>
                <div className="stat-label">Pre-Sale Price</div>
              </div>
              <div className="mission-stat animate-scaleIn animate-delay-7">
                <div className="stat-number">$0.25</div>
                <div className="stat-label">Transaction Fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-what animate-fadeInUp animate-delay-8">
        <div className="about-container">
          <h2 className="animate-fadeInDown">Token Specifications</h2>
          <p className="about-subtitle animate-fadeInUp animate-delay-1">Complete transparency in our token structure and mechanics.</p>
          
          <div className="about-grid">
            <div className="about-card card-animate animate-zoomIn animate-delay-2">
              <div className="card-icon">🪙</div>
              <h3>Token Name</h3>
              <p>XIPAY - The native coin of the XCoinpay blockchain ecosystem.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">🔗</div>
              <h3>Token Type</h3>
              <p>Native Coin on XCoinpay chain with full utility and governance rights.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">💰</div>
              <h3>Pre-Sale Allocation</h3>
              <p>200,000,000 XIPAY (20% of total supply) available at $0.10 each.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">🔥</div>
              <h3>Burn Model</h3>
              <p>100% of transaction fees used to buy back and burn XIPAY tokens.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">⚡</div>
              <h3>Gas Fees</h3>
              <p>Used for all on-chain transactions and network operations.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">📈</div>
              <h3>Deflationary</h3>
              <p>Fixed supply with automatic burning mechanism for value appreciation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="allocation-section">
        <div className="about-container">
          <h2>Token Allocation</h2>
          <div className="allocation-grid">
            <div className="allocation-item">
              <h4>Pre-Sale (20%)</h4>
              <p>200,000,000 XIPAY</p>
              <small>Available to early investors at $0.10 per token</small>
            </div>
            <div className="allocation-item">
              <h4>Liquidity Pool (30%)</h4>
              <p>300,000,000 XIPAY</p>
              <small>Locked for exchange trading and price stability</small>
            </div>
            <div className="allocation-item">
              <h4>Team & Development (15%)</h4>
              <p>150,000,000 XIPAY</p>
              <small>Vested over 24 months with quarterly unlocks</small>
            </div>
            <div className="allocation-item">
              <h4>Marketing & Partnerships (15%)</h4>
              <p>150,000,000 XIPAY</p>
              <small>For global marketing campaigns and strategic partnerships</small>
            </div>
            <div className="allocation-item">
              <h4>Ecosystem & Rewards (10%)</h4>
              <p>100,000,000 XIPAY</p>
              <small>For staking rewards, governance incentives, and community programs</small>
            </div>
            <div className="allocation-item">
              <h4>Reserve Fund (10%)</h4>
              <p>100,000,000 XIPAY</p>
              <small>Emergency fund and future development initiatives</small>
            </div>
          </div>
        </div>
      </section>

      <section className="utility-section">
        <div className="about-container">
          <h2>Token Utility</h2>
          <p className="utility-subtitle">XIPAY tokens serve multiple functions within the XCoinpay ecosystem</p>
          
          <div className="utility-grid">
            <div className="utility-card">
              <div className="utility-icon">⚡</div>
              <h3>Gas Fees</h3>
              <p>Pay for all on-chain transactions, smart contract executions, and network operations.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🔒</div>
              <h3>Staking</h3>
              <p>Stake XIPAY to earn rewards and participate in network governance decisions.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🏛️</div>
              <h3>Governance</h3>
              <p>Vote on protocol upgrades, fee structures, and ecosystem development proposals.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🎁</div>
              <h3>Rewards</h3>
              <p>Earn XIPAY through liquidity provision, referral programs, and community activities.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">💎</div>
              <h3>Premium Features</h3>
              <p>Access advanced features, priority transactions, and exclusive platform benefits.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🌐</div>
              <h3>Cross-Chain</h3>
              <p>Use XIPAY for cross-chain transactions and bridge operations across networks.</p>
            </div>
          </div>
        </div>
      </section>



      <section className="utility-cta">
        <div className="about-container">
          <h3>Ready to Join the XIPAY Revolution?</h3>
          <p>Don't miss out on the opportunity to be part of the next generation of blockchain technology. Join our pre-sale and secure your XIPAY tokens today.</p>
          <div className="utility-buttons">
            <a href="/ico" className="cta-btn primary">Join Pre-Sale</a>
            <Whitepaper />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tokenomics;
