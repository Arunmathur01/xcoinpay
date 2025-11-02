import React, { useEffect } from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: October 30, 2025</p>
        <p>
          Welcome to Xcoinpay.org ("Xcoinpay," "we," "our," or "us").
          These Terms of Service ("Terms") govern your access to and use of our website, applications, digital wallets, and related services (collectively, the "Services").
        </p>
        <p>By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately.</p>

        <hr />

        <section>
          <h2>1. Eligibility</h2>
          <p>To use Xcoinpay, you must:</p>
          <ul>
            <li>Be at least 18 years old (or the legal age of majority in your jurisdiction).</li>
            <li>Have full legal capacity to enter into binding agreements.</li>
            <li>Not be a resident of a country under sanctions or restrictions imposed by applicable laws.</li>
          </ul>
          <p>By using our Services, you represent that all information you provide is accurate and complete.</p>
        </section>

        <hr />

        <section>
          <h2>2. Description of Services</h2>
          <p>Xcoinpay is a blockchain-based payment platform that enables users to:</p>
          <ul>
            <li>Create and manage digital wallets.</li>
            <li>Send, receive, and store supported cryptocurrencies.</li>
            <li>Perform instant crypto withdrawals and payments.</li>
            <li>Access real-time blockchain transaction processing.</li>
          </ul>
          <p>We may update, modify, or discontinue any feature at our sole discretion and without prior notice.</p>
        </section>

        <hr />

        <section>
          <h2>3. Account Registration and Security</h2>
          <ul>
            <li>You must create an account to access certain features.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You agree to notify us immediately at <a href="mailto:support@xcoinpay.org">support@xcoinpay.org</a> if you suspect any unauthorized use of your account.</li>
            <li>You are solely responsible for all activities that occur under your account.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>4. User Responsibilities</h2>
          <p>When using Xcoinpay, you agree to:</p>
          <ul>
            <li>Use the Services only for lawful purposes.</li>
            <li>Not engage in fraudulent, deceptive, or illegal transactions.</li>
            <li>Not attempt to hack, exploit, or disrupt our platform or networks.</li>
            <li>Not use the Services to launder money or finance terrorism.</li>
          </ul>
          <p>Violation of these terms may result in suspension or termination of your account.</p>
        </section>

        <hr />

        <section>
          <h2>5. KYC & AML Compliance</h2>
          <p>
            To comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations, Xcoinpay may 
            request identity verification, including personal documents or other information.
          </p>
          <p>Failure to provide requested information may result in account restrictions or suspension.</p>
        </section>

        <hr />

        <section>
          <h2>6. Transactions and Blockchain Records</h2>
          <ul>
            <li>All cryptocurrency transactions are irreversible once broadcast to the blockchain.</li>
            <li>Xcoinpay has no control over blockchain confirmations or third-party wallet behavior.</li>
            <li>You are responsible for ensuring the accuracy of wallet addresses and transaction details.</li>
            <li>Xcoinpay does not guarantee the value, stability, or future performance of any supported cryptocurrency.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>7. Fees</h2>
          <p>Xcoinpay may charge fees for certain transactions or services. All applicable fees will be disclosed prior to processing.</p>
          <p>We reserve the right to modify fee structures at any time, with notice posted on our website.</p>
        </section>

        <hr />

        <section>
          <h2>8. Risk Disclosure</h2>
          <p>Cryptocurrency transactions involve substantial risks, including but not limited to:</p>
          <ul>
            <li>Market volatility and potential loss of value.</li>
            <li>Technical failures, wallet loss, or system errors.</li>
            <li>Regulatory changes or legal restrictions.</li>
          </ul>
          <p>By using Xcoinpay, you acknowledge and accept these risks. We are not responsible for any losses arising from your use of cryptocurrencies or our Services.</p>
        </section>

        <hr />

        <section>
          <h2>9. Intellectual Property</h2>
          <p>All content, logos, trademarks, and software related to Xcoinpay are our property or licensed to us.</p>
          <p>You may not copy, reproduce, distribute, or modify any part of our platform without prior written consent.</p>
        </section>

        <hr />

        <section>
          <h2>10. Third-Party Services</h2>
          <p>Our Services may include links to third-party websites or dApps.</p>
          <p>We do not control, endorse, or assume responsibility for any third-party content or services. Use them at your own risk.</p>
        </section>

        <hr />

        <section>
          <h2>11. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul>
            <li>Xcoinpay shall not be liable for any indirect, incidental, or consequential damages, including lost profits or data.</li>
            <li>Our total liability for any claim arising from the use of our Services shall not exceed the amount of fees paid (if any) in the preceding 12 months.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Xcoinpay, its affiliates, employees, and partners from any claims, 
            damages, or losses arising out of your use of the Services, violation of these Terms, or infringement of third-party rights.
          </p>
        </section>

        <hr />

        <section>
          <h2>13. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time for any reason, including violation 
            of these Terms or suspected illegal activity.
          </p>
          <p>Upon termination, your right to access the Services will immediately cease.</p>
        </section>

        <hr />

        <section>
          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with applicable laws, without regard to conflict 
            of law principles.
          </p>
          <p>Any disputes shall be resolved exclusively in the competent courts of the applicable jurisdiction.</p>
        </section>

        <hr />

        <section>
          <h2>15. Changes to Terms</h2>
          <p>We may update these Terms periodically. Any changes will take effect upon posting on xcoinpay.org.</p>
          <p>Continued use of our Services after updates constitutes acceptance of the new Terms.</p>
        </section>

        <hr />

        <section>
          <h2>16. Contact Us</h2>
          <p>For questions, concerns, or support regarding these Terms, please contact us:</p>
          <p>
            📧 <a href="mailto:support@xcoinpay.org">support@xcoinpay.org</a><br />
            🌐 <a href="https://xcoinpay.org">www.xcoinpay.org</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;