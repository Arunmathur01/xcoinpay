import React, { useState } from 'react';
import './Whitepaper.css';

const Whitepaper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeModal();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={openModal}
        className="whitepaper-btn"
      >
        📄 Read Whitepaper
      </button>

      {isOpen && (
        <div className="whitepaper-modal" onClick={handleBackdropClick}>
          <div className="whitepaper-modal-content">
            <button className="whitepaper-close" onClick={closeModal}>
              ×
            </button>
            
            <div className="whitepaper-content">
              <h1>XCoinpay Whitepaper</h1>
              
              <section>
                <h2>1. Introduction</h2>
                <p>
                  The global adoption of cryptocurrencies continues to grow, yet the practical accessibility of those assets remains a major challenge. One of the most significant pain points in crypto today is the inability to easily withdraw funds from centralized exchanges without relying on unreliable or risky P2P transactions.
                </p>
                <p>
                  XCoinpay is a blockchain solution built from the ground up to solve this problem — offering instant, low-fee, P2P-free crypto withdrawals at scale. At its core, XCoinpay is designed for speed, security, and utility, with a native ecosystem of tokens that rewards users and drives real-world value.
                </p>
              </section>

              <section>
                <h2>2. Problem Statement</h2>
                <ul>
                  <li>Dependence on P2P platforms that are slow, unregulated, and often unsafe</li>
                  <li>Inconsistent liquidity and regional limitations</li>
                  <li>High risk of scams and disputes</li>
                  <li>Delays in fund transfers and confirmations</li>
                </ul>
                <p>
                  As a result, users experience frustration, capital inefficiency, and avoidable financial risks — undermining the promise of crypto as a fast and borderless financial system.
                </p>
              </section>

              <section>
                <h2>3. The XCoinpay Solution</h2>
                <ul>
                  <li>A high-speed blockchain (10,000 TPS) optimized for real-time, fee-efficient transactions</li>
                  <li>A $0.25 flat fee per transaction — predictable and affordable</li>
                  <li>A P2P-free withdrawal mechanism that allows users to instantly convert and withdraw through integrated platforms</li>
                  <li>A deflationary model where 100% of network fees are used to burn XIPAY, creating long-term scarcity and token value</li>
                </ul>
              </section>

              <section>
                <h2>4. Technical Architecture</h2>
                <ul>
                  <li><strong>Transaction Speed:</strong> Up to 10,000 transactions per second</li>
                  <li><strong>Consensus Mechanism:</strong> Delegated Proof of Stake (DPoS) for scalability, governance, and efficiency</li>
                  <li><strong>Smart Contract Support:</strong> dApps, DeFi, payment gateways, exchange/wallet integration</li>
                  <li><strong>Security:</strong> Layered cryptographic security, periodic audits, real-time monitoring</li>
                </ul>
              </section>

              <section>
                <h2>5. Ecosystem Overview</h2>
                <ul>
                  <li><strong>XIPAY — Native Utility Token:</strong> Transaction fees, validator rewards, deflationary burn</li>
                  <li><strong>CUSDT — XCoinpay USD Stablecoin:</strong> Pegged 1:1 to USD, instant withdrawals, low-volatility settlements, daily payments</li>
                </ul>
              </section>

              <section>
                <h2>6. Tokenomics</h2>
                <div className="tokenomics-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Allocation</th>
                        <th>Supply (XIPAY)</th>
                        <th>% of Total</th>
                        <th>Unlock Schedule</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Pre-Sale</td>
                        <td>200,000,000</td>
                        <td>20%</td>
                        <td>Immediate</td>
                      </tr>
                      <tr>
                        <td>Team & Founders</td>
                        <td>150,000,000</td>
                        <td>15%</td>
                        <td>1-year lock, then 3-year vesting</td>
                      </tr>
                      <tr>
                        <td>Ecosystem/Rewards</td>
                        <td>250,000,000</td>
                        <td>25%</td>
                        <td>Gradual release over 4 years</td>
                      </tr>
                      <tr>
                        <td>Marketing & Partnerships</td>
                        <td>150,000,000</td>
                        <td>15%</td>
                        <td>10% at TGE, remainder over 3 years</td>
                      </tr>
                      <tr>
                        <td>Liquidity & Exchanges</td>
                        <td>100,000,000</td>
                        <td>10%</td>
                        <td>Released with listings and partnerships</td>
                      </tr>
                      <tr>
                        <td>Reserve Fund</td>
                        <td>150,000,000</td>
                        <td>15%</td>
                        <td>Locked for future use</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="tokenomics-summary">
                  <strong>Total Supply:</strong> 1,000,000,000 XIPAY<br />
                  <strong>Pre-Sale Price:</strong> $0.10 per XIPAY
                </p>

                <div className="tokenomics-details">
                  <h3>6.1 XIPAY Utilities</h3>
                  <ul>
                    <li>Gas for on-chain transactions and smart contracts</li>
                    <li>Staking for validator/delegator rewards and governance</li>
                    <li>Fee-burn mechanism: 100% of network fees are used to buy back and burn XIPAY</li>
                    <li>Discounts on withdrawal fees and ecosystem services when paid in XIPAY</li>
                  </ul>

                  <h3>6.2 Sale Rounds</h3>
                  <ul>
                    <li><strong>Private/Seed:</strong> Strategic partners and early contributors (vesting applies)</li>
                    <li><strong>Pre-Sale:</strong> Public allocation at $0.10 per XIPAY (immediate unlock)</li>
                    <li><strong>Public/Listing:</strong> Initial exchange listings post-mainnet</li>
                  </ul>

                  <h3>6.3 Vesting & Unlocks</h3>
                  <ul>
                    <li><strong>Team & Founders:</strong> 12-month cliff, linear vesting over 36 months</li>
                    <li><strong>Marketing & Partnerships:</strong> 10% at TGE, remainder linearly over 36 months</li>
                    <li><strong>Ecosystem/Rewards:</strong> Emissions scheduled over ~48 months</li>
                    <li><strong>Reserve:</strong> Locked; released only by on-chain governance</li>
                  </ul>

                  <h3>6.4 Emissions & Deflation</h3>
                  <ul>
                    <li>Base issuance for staking rewards declines over time (disinflationary)</li>
                    <li>All protocol fees are used to market-buy and burn XIPAY (deflationary)</li>
                    <li>Net supply expected to trend downward with adoption</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2>7. Revenue & Deflation Model</h2>
                <ul>
                  <li>All on-chain transactions incur a $0.25 flat fee</li>
                  <li>Fees are used to buy back and burn XIPAY tokens</li>
                  <li>Continuous reduction in circulating supply</li>
                  <li>Increased scarcity and long-term value</li>
                </ul>
              </section>

              <section>
                <h2>8. Roadmap</h2>
                <div className="roadmap-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Quarter</th>
                        <th>Milestone</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Q2 2025</td>
                        <td>Whitepaper & Roadmap Release, Core Team Onboarding, Architecture Finalization</td>
                      </tr>
                      <tr>
                        <td>Q3 2025</td>
                        <td>MVP Development, Smart Contract Audits</td>
                      </tr>
                      <tr>
                        <td>Q4 2025</td>
                        <td>Pre-Sale Launch, Community Growth, Testnet Live</td>
                      </tr>
                      <tr>
                        <td>Q1 2026</td>
                        <td>Mainnet Launch, CUSDT Launch, Exchange Listings</td>
                      </tr>
                      <tr>
                        <td>Q2 2026</td>
                        <td>Integration with Partner Exchanges, App Release</td>
                      </tr>
                      <tr>
                        <td>Q3 2026</td>
                        <td>XIPAY Burn Dashboard, Global Expansion Campaign</td>
                      </tr>
                      <tr>
                        <td>Q4 2026</td>
                        <td>Cross-chain Bridges, DEX Launch, Institutional Onboarding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2>9. Pre-Sale Details</h2>
                <ul>
                  <li><strong>Token:</strong> XIPAY</li>
                  <li><strong>Supply:</strong> 200,000,000 XIPAY</li>
                  <li><strong>Price:</strong> $0.10 per token</li>
                  <li><strong>Method:</strong> Via official platform (TBA)</li>
                  <li><strong>Use of Funds:</strong> Tech development, exchange listings, marketing, and liquidity</li>
                </ul>
              </section>

              <section>
                <h2>10. Conclusion</h2>
                <p>
                  XCoinpay is more than just a high-speed blockchain — it's a practical solution to one of crypto's biggest limitations. By offering instant withdrawals, removing P2P friction, and embedding deflationary mechanics into its core, XCoinpay creates value for users, investors, and the wider crypto economy.
                </p>
              </section>

              <section>
                <h2>11. Legal Disclaimer</h2>
                <p>
                  This document is for informational purposes only and does not constitute investment advice, legal advice, or an offer to sell securities. Cryptocurrencies are volatile and involve risk. Always conduct your own due diligence and consult a licensed advisor before participating in token sales or blockchain projects.
                </p>
              </section>

              <section className="contact-section">
                <h2>Contact</h2>
                <p>
                  Website: <a href="#" target="_blank" rel="noopener noreferrer">xcoinpay.org</a><br />
                  Email: <a href="mailto:support@xcoinpay.org">support@xcoinpay.org</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Whitepaper;
