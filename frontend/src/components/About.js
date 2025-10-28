import React, { useEffect } from 'react';
import Whitepaper from './Whitepaper';
import './About.css';

const About = () => {
  useEffect(() => {
    // Animate statistics on scroll
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector('.stat-number');
          const target = parseInt(statNumber.getAttribute('data-target'));
          if (target) {
            animateNumber(statNumber, target);
          }
        }
      });
    }, observerOptions);

    const statItems = document.querySelectorAll('.mission-stat');
    statItems.forEach(item => observer.observe(item));

    return () => {
      statItems.forEach(item => observer.unobserve(item));
    };
  }, []);

  const animateNumber = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 30);
  };

  return (
    <div className="about">
      <header className="hero">
        <h1 className="large-header typewriter-header">About XCoinpay</h1>
        <p className="animate-fadeInUp animate-delay-2">Revolutionizing Crypto Withdrawals with Speed & Security</p>
        <p className="hero-subtitle animate-fadeInUp animate-delay-3">
          We're on a mission to eliminate the most frustrating pain points in crypto: slow and inconvenient withdrawals. 
          XCoinpay is more than just a high-speed blockchain — it's a practical solution to one of crypto's biggest limitations.
        </p>
      </header>

      <section className="about-mission animate-fadeInUp animate-delay-4">
        <div className="about-container">
          <div className="mission-content">
            <div className="mission-header">
              <h2 className="typewriter-header" style={{fontSize: '3rem', color: '#0a2540', marginBottom: '1rem'}}>Our Mission</h2>
              <div className="mission-subtitle animate-fadeInUp animate-delay-5">
                <span className="mission-icon"></span>
                <span>Transforming Crypto Accessibility</span>
              </div>
            </div>
            
            <div className="mission-description animate-fadeInUp animate-delay-6">
              <p className="mission-text">
                At <strong>XCoinpay</strong>, we believe that crypto should be as easy to use as traditional banking. 
                Our mission is to create a seamless, high-speed blockchain ecosystem that eliminates the friction 
                between crypto exchanges and real-world access to funds.
              </p>
              <p className="mission-text-secondary animate-fadeInUp animate-delay-7">
                We're building the bridge that connects the digital economy to everyday life, making crypto 
                withdrawals instant, secure, and accessible to everyone.
              </p>
            </div>



            <div className="mission-stats animate-fadeInUp animate-delay-2">
              <div className="mission-stat card-animate animate-scaleIn animate-delay-3">
                <div className="stat-icon">🚀</div>
                <div className="stat-number" data-target="10000">0</div>
                <div className="stat-label">TPS Capacity</div>
                <div className="stat-description">Lightning Speed</div>
              </div>
              <div className="mission-stat card-animate animate-scaleIn animate-delay-4">
                <div className="stat-icon">💎</div>
                <div className="stat-number">$0.25</div>
                <div className="stat-label">Flat Fee</div>
                <div className="stat-description">Always Affordable</div>
              </div>
              <div className="mission-stat card-animate animate-scaleIn animate-delay-5">
                <div className="stat-icon">🔥</div>
                <div className="stat-number">1B</div>
                <div className="stat-label">XIPAY Supply</div>
                <div className="stat-description">Deflationary Model</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="enhanced-stats animate-fadeInUp animate-delay-8">
        <div className="about-container">
          <h2 className="animate-fadeInDown">Why XCoinpay Matters</h2>
          <div className="mission-stats">
            <div className="mission-stat animate-zoomIn animate-delay-9">
              <div className="stat-number">⚡</div>
              <div className="stat-label">High-Speed Transactions</div>
            </div>
            <div className="mission-stat animate-zoomIn animate-delay-10">
              <div className="stat-number">🔄</div>
              <div className="stat-label">Integrated Ecosystem</div>
            </div>
            <div className="mission-stat animate-zoomIn animate-delay-1">
              <div className="stat-number">📈</div>
              <div className="stat-label">Deflationary Rewards</div>
            </div>
            <div className="mission-stat animate-zoomIn animate-delay-2">
              <div className="stat-number">🎯</div>
              <div className="stat-label">Real Use Case</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tech-specs">
        <div className="about-container">
          <h2>Technical Architecture</h2>
          <p className="tech-subtitle">Built for speed, security, and scalability</p>
          
          <div className="specs-grid">
            <div className="spec-card">
              <h3><span className="spec-icon">⚡</span>Transaction Speed</h3>
              <p>Up to 10,000 transactions per second for lightning-fast processing and real-time settlements.</p>
            </div>
            <div className="spec-card">
              <h3><span className="spec-icon">🔗</span>Consensus Mechanism</h3>
              <p>Delegated Proof of Stake (DPoS) for scalability, governance, and energy efficiency.</p>
            </div>
            <div className="spec-card">
              <h3><span className="spec-icon">🤖</span>Smart Contract Support</h3>
              <p>Full support for dApps, DeFi protocols, payment gateways, and exchange integrations.</p>
            </div>
            <div className="spec-card">
              <h3><span className="spec-icon">🛡️</span>Security</h3>
              <p>Layered cryptographic security with periodic audits and real-time monitoring systems.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-what">
        <div className="about-container">
          <h2>What Is XCoinpay?</h2>
          <p className="about-subtitle">A next-generation blockchain ecosystem designed for speed, efficiency, and user freedom.</p>
          
          <div className="about-grid">
            <div className="about-card">
              <div className="card-icon">⚡</div>
              <h3>XIPAY Token</h3>
              <p>The native utility token powering the XCoinpay ecosystem, used for gas fees, staking, and governance.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">🔗</div>
              <h3>High-Speed Blockchain</h3>
              <p>Built for real-time transactions with 10,000 TPS capacity and instant finality for seamless user experience.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">💰</div>
              <h3>Exchange Integration</h3>
              <p>Direct integration with major crypto exchanges for instant withdrawals without P2P friction.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">🌍</div>
              <h3>Global Accessibility</h3>
              <p>Available worldwide with support for multiple currencies and regulatory compliance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap-section">
        <div className="about-container">
          <h2>Development Roadmap</h2>
          <div className="roadmap-grid">
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q2 2025</div>
              <div className="roadmap-milestone">
                • Whitepaper & Roadmap Release<br/>
                • Core Team Onboarding<br/>
                • Architecture Finalization
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q3 2025</div>
              <div className="roadmap-milestone">
                • MVP Development<br/>
                • Smart Contract Audits<br/>
                • Early Community Programs
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q4 2025</div>
              <div className="roadmap-milestone">
                • Pre-Sale Launch<br/>
                • Community Growth<br/>
                • Testnet Live
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q1 2026</div>
              <div className="roadmap-milestone">
                • Mainnet Launch<br/>
                • CUSDT Launch<br/>
                • Initial Exchange Listings
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q2 2026</div>
              <div className="roadmap-milestone">
                • Partner Exchange Integrations<br/>
                • Mobile App Release<br/>
                • Developer SDKs
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q3 2026</div>
              <div className="roadmap-milestone">
                • XIPAY Burn Dashboard<br/>
                • Global Expansion Campaign<br/>
                • Strategic Partnerships
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-quarter">Q4 2026</div>
              <div className="roadmap-milestone">
                • Cross-chain Bridges<br/>
                • DEX Launch<br/>
                • Institutional Onboarding
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-enhanced">
        <div className="about-container">
          <h2>Ready to Join the Revolution?</h2>
          <p>Be part of the future of crypto payments. Join our presale and help build the next generation of blockchain technology.</p>
          <div className="cta-buttons-enhanced">
            <a href="/ico" className="cta-btn-enhanced cta-btn-primary">Join Presale</a>
            <Whitepaper />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
