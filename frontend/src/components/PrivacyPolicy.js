import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: July 30, 2025</p>
        <p>
          Welcome to Xcoinpay ("we," "our," or "us"). Your privacy is important to us, and we are committed 
          to protecting your personal information and your right to privacy. This Privacy Policy explains how 
          we collect, use, disclose, and safeguard your information when you use our website, mobile 
          application, and related services (collectively, the "Services").
        </p>
        <p>Please read this Privacy Policy carefully. By accessing or using our Services, you agree to the collection and use of information in accordance with this policy.</p>

        <hr />

        <section>
          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>

          <h3>A. Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we may collect your name, email address, username, password, and other details you voluntarily provide.</li>
            <li><strong>Identity Verification:</strong> To comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations, we may collect identification documents (e.g., government ID, proof of address).</li>
            <li><strong>Communication Data:</strong> When you contact us for support or feedback, we may collect messages, emails, or other communication records.</li>
          </ul>

          <h3>B. Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage Data:</strong> Includes information such as IP address, browser type, device identifiers, operating system, access times, and the pages you visit.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience and analyze usage patterns.</li>
          </ul>

          <h3>C. Blockchain Data</h3>
          <p>Transactions executed through Xcoinpay may be recorded on public blockchains. Such information is immutable and publicly accessible. Xcoinpay cannot modify or delete blockchain records.</p>
        </section>

        <hr />

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use collected data for purposes such as:</p>
          <ul>
            <li>To operate, maintain, and improve our Services.</li>
            <li>To process transactions and verify user identity.</li>
            <li>To comply with legal obligations (KYC/AML requirements).</li>
            <li>To prevent fraud, unauthorized access, or illegal activities.</li>
            <li>To send service-related communications and updates.</li>
            <li>To improve customer support and user experience.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>3. How We Share Your Information</h2>
          <p>We do not sell or trade your personal information. However, we may share your data in the following cases:</p>
          <ul>
            <li><strong>With Service Providers:</strong> To help operate our platform, such as cloud hosting, analytics, or identity verification partners.</li>
            <li><strong>For Legal Reasons:</strong> If required by law, regulation, or court order.</li>
            <li><strong>In Business Transfers:</strong> In case of mergers, acquisitions, or restructuring of Xcoinpay.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures, including encryption and multi-factor authentication, 
            to protect your information. However, no online system is completely secure. You use our Services at your own risk.
          </p>
        </section>

        <hr />

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this 
            policy, or as required by applicable law (e.g., AML compliance).
          </p>
        </section>

        <hr />

        <section>
          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal information.</li>
            <li>Withdraw consent at any time (where applicable).</li>
            <li>Request data portability.</li>
          </ul>
          <p>To exercise your rights, please contact us at <a href="mailto:privacy@xcoinpay.org">privacy@xcoinpay.org</a></p>
        </section>

        <hr />

        <section>
          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries outside your residence. By using our 
            Services, you consent to such transfers, which will always comply with applicable data protection laws.
          </p>
        </section>

        <hr />

        <section>
          <h2>8. Cookies Policy</h2>
          <p>We use cookies to:</p>
          <ul>
            <li>Enable essential functionality (login, security).</li>
            <li>Analyze site traffic and performance.</li>
            <li>Personalize content and improve your experience.</li>
          </ul>
          <p>You can manage your cookie preferences in your browser settings.</p>
        </section>

        <hr />

        <section>
          <h2>9. Third-Party Links</h2>
          <p>
            Our Services may contain links to third-party websites or dApps. We are not responsible for their 
            privacy practices or content. Please review their policies before providing personal information.
          </p>
        </section>

        <hr />

        <section>
          <h2>10. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an 
            updated "Last Updated" date. Continued use of our Services indicates your acceptance of the revised policy.
          </p>
        </section>

        <hr />

        <section>
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <p>
            📧 <a href="mailto:privacy@xcoinpay.org">privacy@xcoinpay.org</a><br />
            🌐 <a href="https://xcoinpay.org">www.xcoinpay.org</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;